using FitnessCenter.Api.Domain.Entities;
using FitnessCenter.Api.DTOs;
using FitnessCenter.Api.Repositories;

public class BookingService
{
    private readonly ISubscriptionRepository _subRepo;
    private readonly IWorkoutSessionRepository _sessionRepo;

    public BookingService(ISubscriptionRepository subRepo, IWorkoutSessionRepository sessionRepo)
    {
        _subRepo = subRepo;
        _sessionRepo = sessionRepo;
    }

    public async Task<WorkoutSession> BookAsync(BookSessionDto dto)
    {
        var sub = await _subRepo.GetByIdAsync(dto.SubscriptionId) ?? throw new Exception("Subscription not found");

        if (sub.Status != "ACTIVE" || sub.EndDate < DateOnly.FromDateTime(DateTime.UtcNow))
            throw new Exception("Subscription inactive/expired");

        if (sub.RemainingSessions <= 0)
            throw new Exception("No remaining sessions");

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

        return session;
    }

    public async Task<List<WorkoutSession>> GetByMemberAsync(Guid memberId)
        => await _sessionRepo.GetByMemberAsync(memberId);

    public async Task CancelAsync(Guid id)
    {
        var session = await _sessionRepo.GetByIdAsync(id) ?? throw new Exception("Session not found");
        session.Status = "CANCELLED";
        await _sessionRepo.UpdateAsync(session);
    }

    public async Task RescheduleAsync(Guid id, RescheduleDto dto)
    {
        var session = await _sessionRepo.GetByIdAsync(id) ?? throw new Exception("Session not found");

        var conflict = await _sessionRepo.HasTrainerConflict(session.TrainerId, dto.SessionDate, dto.StartTime, dto.EndTime);
        if (conflict) throw new Exception("Trainer timeslot conflict");

        session.SessionDate = dto.SessionDate;
        session.StartTime = dto.StartTime;
        session.EndTime = dto.EndTime;
        await _sessionRepo.UpdateAsync(session);
    }
}