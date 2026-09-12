using FitnessCenter.Api.Data;
using FitnessCenter.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace FitnessCenter.Api.Services;

public class TrainerService
{
    private readonly AppDbContext _db;

    public TrainerService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<TrainerDashboardDto> GetDashboardAsync(Guid trainerId)
    {
        var trainer = await _db.Trainers.FirstOrDefaultAsync(x => x.Id == trainerId)
            ?? throw new Exception("Trainer not found");

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var endOfWeek = today.AddDays(7);

        var schedule = await (
            from session in _db.WorkoutSessions
            join member in _db.Members on session.MemberId equals member.Id
            join subscription in _db.Subscriptions on session.SubscriptionId equals subscription.Id
            join plan in _db.MembershipPlans on subscription.PlanId equals plan.Id
            where session.TrainerId == trainerId && session.SessionDate >= today && session.Status == "BOOKED"
            orderby session.SessionDate, session.StartTime
            select new TrainerSessionItemDto(
                session.Id,
                member.FullName,
                plan.PlanName,
                session.SessionDate,
                session.StartTime,
                session.EndTime,
                session.Status)
        ).ToListAsync();

        var memberProgress = await (
            from subscription in _db.Subscriptions
            join member in _db.Members on subscription.MemberId equals member.Id
            join plan in _db.MembershipPlans on subscription.PlanId equals plan.Id
            where _db.WorkoutSessions.Any(session =>
                session.SubscriptionId == subscription.Id &&
                session.TrainerId == trainerId &&
                session.Status == "BOOKED")
            orderby member.FullName
            select new TrainerMemberProgressDto(
                member.FullName,
                plan.PlanName,
                subscription.RemainingSessions,
                subscription.Status)
        ).ToListAsync();

        var weeklySessions = schedule.Where(x => x.SessionDate <= endOfWeek).ToList();
        var weeklyHours = weeklySessions.Sum(x => (x.EndTime.ToTimeSpan() - x.StartTime.ToTimeSpan()).TotalHours);

        return new TrainerDashboardDto(
            trainer.FullName,
            trainer.Specialty ?? "General fitness",
            schedule.Count(x => x.SessionDate == today && x.Status == "BOOKED"),
            schedule.Count(x => x.Status == "BOOKED"),
            memberProgress.Select(x => x.MemberName).Distinct().Count(),
            Math.Round(weeklyHours, 1),
            schedule.Take(8).ToList(),
            memberProgress.Take(6).ToList());
    }
}
