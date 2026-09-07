public interface IWorkoutSessionRepository : IRepository<WorkoutSession>
{
    Task<bool> HasTrainerConflict(Guid trainerId, DateOnly date, TimeOnly start, TimeOnly end);
}