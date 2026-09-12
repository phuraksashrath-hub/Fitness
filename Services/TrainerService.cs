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
                session.Status,
                session.TrainerNotes,
                session.CompletedAt)
        ).ToListAsync();

        var memberProgress = await (
            from subscription in _db.Subscriptions
            join member in _db.Members on subscription.MemberId equals member.Id
            join plan in _db.MembershipPlans on subscription.PlanId equals plan.Id
            where _db.WorkoutSessions.Any(session =>
                session.SubscriptionId == subscription.Id &&
                session.TrainerId == trainerId &&
                (session.Status == "BOOKED" || session.Status == "COMPLETED"))
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
            schedule.Count(x => x.SessionDate == today),
            schedule.Count,
            memberProgress.Select(x => x.MemberName).Distinct().Count(),
            Math.Round(weeklyHours, 1),
            schedule.Take(8).ToList(),
            memberProgress.Take(6).ToList());
    }

    public async Task UpdateNotesAsync(Guid trainerId, Guid sessionId, string notes)
    {
        var session = await _db.WorkoutSessions.FirstOrDefaultAsync(x => x.Id == sessionId)
            ?? throw new Exception("Session not found");
        if (session.TrainerId != trainerId) throw new Exception("Session does not belong to this trainer");

        session.TrainerNotes = string.IsNullOrWhiteSpace(notes) ? null : notes.Trim();
        await _db.SaveChangesAsync();
    }

    public async Task MarkCompletedAsync(Guid trainerId, Guid sessionId, string? notes)
    {
        var session = await _db.WorkoutSessions.FirstOrDefaultAsync(x => x.Id == sessionId)
            ?? throw new Exception("Session not found");
        if (session.TrainerId != trainerId) throw new Exception("Session does not belong to this trainer");
        if (session.Status != "BOOKED") throw new Exception("Only booked sessions can be marked as completed");

        session.Status = "COMPLETED";
        session.CompletedAt = DateTime.UtcNow;
        if (!string.IsNullOrWhiteSpace(notes))
        {
            session.TrainerNotes = notes.Trim();
        }

        await _db.SaveChangesAsync();
    }
}
