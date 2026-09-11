using FitnessCenter.Api.Data;
using FitnessCenter.Api.Domain.Entities;
using FitnessCenter.Api.DTOs;
using FitnessCenter.Api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace FitnessCenter.Api.Services;

public class AdminService
{
    private readonly IUserRepository _userRepo;
    private readonly IRepository<MembershipPlan> _planRepo;
    private readonly AppDbContext _db;

    public AdminService(IUserRepository userRepo, IRepository<MembershipPlan> planRepo, AppDbContext db)
    {
        _userRepo = userRepo;
        _planRepo = planRepo;
        _db = db;
    }

    public async Task<IEnumerable<AdminMemberDto>> GetMembersAsync()
    {
        var members = await _userRepo.GetAllMembersAsync();
        return members.Select(x => new AdminMemberDto(x.Id, x.FullName, x.Email, x.Phone ?? "-", x.Role));
    }

    public async Task<AdminMemberDto> UpdateMemberAsync(Guid id, UpdateMemberDto dto)
    {
        var member = await _userRepo.GetMemberByIdAsync(id) ?? throw new Exception("Member not found");
        member.FullName = dto.FullName;
        member.Email = dto.Email;
        member.Phone = dto.Phone;
        member.Role = dto.Role;

        await _userRepo.UpdateMemberAsync(member);
        return new AdminMemberDto(member.Id, member.FullName, member.Email, member.Phone ?? "-", member.Role);
    }

    public async Task<IEnumerable<MembershipPlanDto>> GetPlansAsync()
    {
        var plans = await _planRepo.GetAllAsync();
        return plans.Select(x => new MembershipPlanDto(x.Id, x.PlanName, x.DurationDays, x.Price, x.MaxSessionsPerMonth));
    }

    public async Task<MembershipPlanDto> CreatePlanAsync(CreatePlanDto dto)
    {
        var plan = new MembershipPlan
        {
            PlanName = dto.PlanName,
            DurationDays = dto.DurationDays,
            Price = dto.Price,
            MaxSessionsPerMonth = dto.MaxSessionsPerMonth
        };

        await _planRepo.AddAsync(plan);
        return new MembershipPlanDto(plan.Id, plan.PlanName, plan.DurationDays, plan.Price, plan.MaxSessionsPerMonth);
    }

    public async Task<MembershipPlanDto> UpdatePlanAsync(Guid id, UpdatePlanDto dto)
    {
        var plan = await _planRepo.GetByIdAsync(id) ?? throw new Exception("Plan not found");
        plan.PlanName = dto.PlanName;
        plan.DurationDays = dto.DurationDays;
        plan.Price = dto.Price;
        plan.MaxSessionsPerMonth = dto.MaxSessionsPerMonth;

        await _planRepo.UpdateAsync(plan);
        return new MembershipPlanDto(plan.Id, plan.PlanName, plan.DurationDays, plan.Price, plan.MaxSessionsPerMonth);
    }

    public async Task DeleteMemberAsync(Guid id)
    {
        var member = await _userRepo.GetMemberByIdAsync(id) ?? throw new Exception("Member not found");
        var all = await _db.Subscriptions.Where(x => x.MemberId == id).ToListAsync();
        _db.Subscriptions.RemoveRange(all);
        _db.Members.Remove(member);
        await _db.SaveChangesAsync();
    }

    public async Task<IEnumerable<object>> GetDashboardSummaryAsync()
    {
        var totalMembers = await _db.Members.CountAsync();
        var totalPlans = await _db.MembershipPlans.CountAsync();
        var totalSubscriptions = await _db.Subscriptions.CountAsync();

        return new[]
        {
            new { label = "Members", value = totalMembers },
            new { label = "Plans", value = totalPlans },
            new { label = "Subscriptions", value = totalSubscriptions }
        };
    }
}
