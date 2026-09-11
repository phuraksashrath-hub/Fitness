using FitnessCenter.Api.Domain.Entities;

namespace FitnessCenter.Api.Repositories;

public interface IWorkoutSessionRepository : IRepository<WorkoutSession>
{
    Task<List<WorkoutSession>> GetByMemberAsync(Guid memberId);
    Task<bool> HasTrainerConflict(Guid trainerId, DateOnly date, TimeOnly start, TimeOnly end);
}