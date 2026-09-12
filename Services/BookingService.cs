using FitnessCenter.Api.Data;
using FitnessCenter.Api.Domain.Entities;
using FitnessCenter.Api.DTOs;
using FitnessCenter.Api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace FitnessCenter.Api.Services;

public class BookingService
{
    private readonly AppDbContext _db;
    private readonly ISubscriptionRepository _subRepo;
    private readonly IWorkoutSessionRepository _sessionRepo;

    public BookingService(AppDbContext db, ISubscriptionRepository subRepo, IWorkoutSessionRepository sessionRepo)
    {
        _db = db;
        _subRepo = subRepo;
        _sessionRepo = sessionRepo;
    }

    public async Task<SessionSummaryDto> BookAsync(BookSessionDto dto)
    {
        if (dto.EndTime <= dto.StartTime)
            throw new Exception("Session end time must be after start time");

        var sub = await _subRepo.GetByIdAsync(dto.SubscriptionId) ?? throw new Exception("Subscription not found");
        if (sub.MemberId != dto.MemberId)
            throw new Exception("Subscription does not belong to this member");

        if (sub.Status != "ACTIVE" || sub.EndDate < DateOnly.FromDateTime(DateTime.UtcNow))
            throw new Exception("Subscription inactive/expired");

        if (sub.RemainingSessions <= 0)
            throw new Exception("No remaining sessions");

        var trainer = await _db.Trainers.FirstOrDefaultAsync(x => x.Id == dto.TrainerId) ?? throw new Exception("Trainer not found");

        var conflict = await _sessionRepo.HasTrainerConflict(dto.TrainerId, dto.SessionDate, dto.StartTime, dto.EndTime);
        if (conflict) throw new Exception("Trainer timeslot conflict");

        var session = new WorkoutSession
        {
            MemberId = dto.MemberId,
            TrainerId = dto.TrainerId,
            SubscriptionId = dto.SubscriptionId,
            SessionDate = dto.SessionDate,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Status = "BOOKED"
        };

        sub.RemainingSessions -= 1;
        await _sessionRepo.AddAsync(session);
        await _subRepo.UpdateAsync(sub);

        return new SessionSummaryDto(session.Id, session.MemberId, session.TrainerId, session.SubscriptionId, trainer.FullName, session.SessionDate, session.StartTime, session.EndTime, session.Status);
    }

    public async Task<List<SessionSummaryDto>> GetByMemberAsync(Guid memberId)
    {
        return await (
            from session in _db.WorkoutSessions
            join trainer in _db.Trainers on session.TrainerId equals trainer.Id
            where session.MemberId == memberId
            orderby session.SessionDate descending, session.StartTime descending
            select new SessionSummaryDto(
                session.Id,
                session.MemberId,
                session.TrainerId,
                session.SubscriptionId,
                trainer.FullName,
                session.SessionDate,
                session.StartTime,
                session.EndTime,
                session.Status)
        ).ToListAsync();
    }

    public async Task<List<TrainerSummaryDto>> GetTrainerCatalogAsync()
    {
        return await _db.Trainers
            .OrderBy(x => x.FullName)
            .Select(x => new TrainerSummaryDto(x.Id, x.FullName, x.Specialty ?? "General fitness"))
            .ToListAsync();
    }

    public async Task CancelAsync(Guid id, Guid memberId)
    {
        var session = await _sessionRepo.GetByIdAsync(id) ?? throw new Exception("Session not found");
        if (session.MemberId != memberId) throw new Exception("Session does not belong to this member");
        if (session.Status != "BOOKED") throw new Exception("Only booked sessions can be cancelled");

        var subscription = await _subRepo.GetByIdAsync(session.SubscriptionId) ?? throw new Exception("Subscription not found");
        subscription.RemainingSessions += 1;
        await _subRepo.UpdateAsync(subscription);
        session.Status = "CANCELLED";
        await _sessionRepo.UpdateAsync(session);
    }

    public async Task RescheduleAsync(Guid id, Guid memberId, RescheduleDto dto)
    {
        if (dto.EndTime <= dto.StartTime)
            throw new Exception("Session end time must be after start time");

        var session = await _sessionRepo.GetByIdAsync(id) ?? throw new Exception("Session not found");
        if (session.MemberId != memberId) throw new Exception("Session does not belong to this member");
        if (session.Status != "BOOKED") throw new Exception("Only booked sessions can be rescheduled");

        var sameSlot = session.SessionDate == dto.SessionDate &&
            session.StartTime == dto.StartTime &&
            session.EndTime == dto.EndTime;

        var conflict = !sameSlot && await _db.WorkoutSessions.AnyAsync(s =>
            s.Id != session.Id &&
            s.TrainerId == session.TrainerId &&
            s.SessionDate == dto.SessionDate &&
            s.Status == "BOOKED" &&
            ((dto.StartTime >= s.StartTime && dto.StartTime < s.EndTime) ||
             (dto.EndTime > s.StartTime && dto.EndTime <= s.EndTime) ||
             (dto.StartTime <= s.StartTime && dto.EndTime >= s.EndTime)));
        if (conflict) throw new Exception("Trainer timeslot conflict");

        session.SessionDate = dto.SessionDate;
        session.StartTime = dto.StartTime;
        session.EndTime = dto.EndTime;
        await _sessionRepo.UpdateAsync(session);
    }
}
