using FitnessCenter.Api.Data;
using FitnessCenter.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FitnessCenter.Api.Repositories;

public class WorkoutSessionRepository : Repository<WorkoutSession>, IWorkoutSessionRepository
{
    public WorkoutSessionRepository(AppDbContext db) : base(db) { }

    public async Task<List<WorkoutSession>> GetByMemberAsync(Guid memberId)
    {
        return await _db.WorkoutSessions
            .Where(x => x.MemberId == memberId)
            .OrderByDescending(x => x.SessionDate)
            .ToListAsync();
    }

    public async Task<bool> HasTrainerConflict(Guid trainerId, DateOnly date, TimeOnly start, TimeOnly end)
    {
        return await _db.WorkoutSessions.AnyAsync(s =>
            s.TrainerId == trainerId &&
            s.SessionDate == date &&
            s.Status == "BOOKED" &&
            ((start >= s.StartTime && start < s.EndTime) ||
             (end > s.StartTime && end <= s.EndTime) ||
             (start <= s.StartTime && end >= s.EndTime)));
    }
}