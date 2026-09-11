namespace FitnessCenter.Api.Domain.Entities;

public class WorkoutSession
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid MemberId { get; set; }
    public Guid TrainerId { get; set; }
    public Guid SubscriptionId { get; set; }
    public DateOnly SessionDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public string Status { get; set; } = "BOOKED";
}