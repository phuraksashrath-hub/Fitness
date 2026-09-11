using FitnessCenter.Api.Domain.Entities;
using FitnessCenter.Api.DTOs;
using FitnessCenter.Api.Repositories;

public class SubscriptionService
{
    private readonly IRepository<MembershipPlan> _planRepo;
    private readonly ISubscriptionRepository _subRepo;

    public SubscriptionService(IRepository<MembershipPlan> planRepo, ISubscriptionRepository subRepo)
    {
        _planRepo = planRepo;
        _subRepo = subRepo;
    }

    public async Task<Subscription> SubscribeAsync(SubscribeDto dto)
    {
        var plan = await _planRepo.GetByIdAsync(dto.PlanId) ?? throw new Exception("Plan not found");
        var start = DateOnly.FromDateTime(DateTime.UtcNow);
        var end = start.AddDays(plan.DurationDays);

        var sub = new Subscription
        {
            MemberId = dto.MemberId,
            PlanId = dto.PlanId,
            StartDate = start,
            EndDate = end,
            Status = "ACTIVE",
            RemainingSessions = plan.MaxSessionsPerMonth
        };

        await _subRepo.AddAsync(sub);
        return sub;
    }
}