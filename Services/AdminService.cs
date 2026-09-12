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

    public async Task<IEnumerable<AdminTrainerDto>> GetTrainersAsync()
    {
        var trainers = await _userRepo.GetAllTrainersAsync();
        return trainers.Select(x => new AdminTrainerDto(x.Id, x.FullName, x.Email, x.Specialty ?? "General fitness", x.Role));
    }

    public async Task<AdminTrainerDto> CreateTrainerAsync(CreateTrainerDto dto)
    {
        var exists = await _userRepo.GetUserByEmailAsync(dto.Email);
        if (exists is not null) throw new Exception("Email already used");

        var trainer = new Trainer
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Specialty = dto.Specialty,
            Role = "TRAINER"
        };

        await _userRepo.AddTrainerAsync(trainer);
        return new AdminTrainerDto(trainer.Id, trainer.FullName, trainer.Email, trainer.Specialty ?? "General fitness", trainer.Role);
    }

    public async Task<AdminTrainerDto> UpdateTrainerAsync(Guid id, UpdateTrainerDto dto)
    {
        var trainer = await _userRepo.GetTrainerByIdAsync(id) ?? throw new Exception("Trainer not found");
        trainer.FullName = dto.FullName;
        trainer.Email = dto.Email;
        trainer.Specialty = dto.Specialty;
        trainer.Role = dto.Role;

        await _userRepo.UpdateTrainerAsync(trainer);
        return new AdminTrainerDto(trainer.Id, trainer.FullName, trainer.Email, trainer.Specialty ?? "General fitness", trainer.Role);
    }

    public async Task<IEnumerable<AdminSubscriptionDto>> GetSubscriptionsAsync()
    {
        return await (
            from subscription in _db.Subscriptions
            join member in _db.Members on subscription.MemberId equals member.Id
            join plan in _db.MembershipPlans on subscription.PlanId equals plan.Id
            orderby subscription.EndDate descending
            select new AdminSubscriptionDto(
                subscription.Id,
                member.FullName,
                plan.PlanName,
                subscription.Status,
                subscription.RemainingSessions,
                subscription.StartDate,
                subscription.EndDate)
        ).ToListAsync();
    }

    public async Task<IEnumerable<AdminPaymentDto>> GetPaymentsAsync()
    {
        return await _db.Payments
            .Join(_db.Members,
                payment => payment.MemberId,
                member => member.Id,
                (payment, member) => new AdminPaymentDto(
                    payment.Id,
                    member.FullName,
                    payment is CreditCardPayment ? "CREDIT_CARD" : "PROMPTPAY",
                    payment.Amount,
                    payment.DiscountAmount,
                    payment.FinalAmount,
                    payment.Status,
                    payment.CreatedAt))
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
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
        var totalTrainers = await _db.Trainers.CountAsync();
        var totalPlans = await _db.MembershipPlans.CountAsync();
        var totalSubscriptions = await _db.Subscriptions.CountAsync();
        var totalRevenue = await _db.Payments.SumAsync(x => (decimal?)x.FinalAmount) ?? 0m;

        return new[]
        {
            new { label = "Members", value = totalMembers },
            new { label = "Trainers", value = totalTrainers },
            new { label = "Plans", value = totalPlans },
            new { label = "Subscriptions", value = totalSubscriptions },
            new { label = "Revenue", value = totalRevenue }
        };
    }
}
