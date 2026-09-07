public class MembershipPlan
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string PlanName { get; set; } = "";
    public int DurationDays { get; set; }
    public decimal Price { get; set; }
    public int MaxSessionsPerMonth { get; set; }
}