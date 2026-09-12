using FitnessCenter.Api.Data;
using FitnessCenter.Api.Domain.Entities;
using FitnessCenter.Api.DTOs;
using FitnessCenter.Api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace FitnessCenter.Api.Services;

public class SubscriptionService
{
    private readonly AppDbContext _db;
    private readonly IRepository<MembershipPlan> _planRepo;
    private readonly ISubscriptionRepository _subRepo;

    public SubscriptionService(AppDbContext db, IRepository<MembershipPlan> planRepo, ISubscriptionRepository subRepo)
    {
        _db = db;
        _planRepo = planRepo;
        _subRepo = subRepo;
    }

    public async Task<Subscription> SubscribeAsync(SubscribeDto dto)
    {
        var plan = await _planRepo.GetByIdAsync(dto.PlanId) ?? throw new Exception("Plan not found");
        var memberExists = await _db.Members.AnyAsync(x => x.Id == dto.MemberId);
        if (!memberExists) throw new Exception("Member not found");

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

    public async Task<IEnumerable<MembershipPlanDto>> GetPlansAsync()
    {
        var plans = await _planRepo.GetAllAsync();
        return plans
            .Cast<MembershipPlan>()
            .OrderBy(x => x.Price)
            .Select(x => new MembershipPlanDto(x.Id, x.PlanName, x.DurationDays, x.Price, x.MaxSessionsPerMonth));
    }

    public async Task<IEnumerable<SubscriptionSummaryDto>> GetSubscriptionsByMemberAsync(Guid memberId)
    {
        return await (
            from subscription in _db.Subscriptions
            join plan in _db.MembershipPlans on subscription.PlanId equals plan.Id
            where subscription.MemberId == memberId
            orderby subscription.EndDate descending
            select new SubscriptionSummaryDto(
                subscription.Id,
                subscription.MemberId,
                subscription.PlanId,
                plan.PlanName,
                subscription.StartDate,
                subscription.EndDate,
                subscription.Status,
                subscription.RemainingSessions,
                plan.Price,
                plan.DurationDays)
        ).ToListAsync();
    }
}
