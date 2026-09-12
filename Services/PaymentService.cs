using FitnessCenter.Api.Data;
using FitnessCenter.Api.Domain.Entities;
using FitnessCenter.Api.DTOs;
using FitnessCenter.Api.Factories;
using FitnessCenter.Api.Repositories;
using Microsoft.EntityFrameworkCore;

namespace FitnessCenter.Api.Services;

public class PaymentService
{
    private readonly AppDbContext _db;
    private readonly IPaymentRepository _paymentRepo;

    public PaymentService(AppDbContext db, IPaymentRepository paymentRepo)
    {
        _db = db;
        _paymentRepo = paymentRepo;
    }

    public async Task<Payment> ProcessAsync(ProcessPaymentDto dto)
    {
        decimal baseAmount = dto.Amount;

        if (dto.SubscriptionId is Guid subscriptionId)
        {
            var subscription = await _db.Subscriptions.FirstOrDefaultAsync(x => x.Id == subscriptionId)
                ?? throw new Exception("Subscription not found");

            if (subscription.MemberId != dto.MemberId)
                throw new Exception("Subscription does not belong to this member");

            var plan = await _db.MembershipPlans.FirstOrDefaultAsync(x => x.Id == subscription.PlanId)
                ?? throw new Exception("Plan not found");

            baseAmount = plan.Price;
        }

        if (baseAmount <= 0)
            throw new Exception("Payment amount must be greater than 0");

        var discountStrategy = DiscountStrategyResolver.Resolve(dto.DiscountType);
        var discount = discountStrategy.GetDiscount(baseAmount);
        var finalAmount = baseAmount - discount;

        var payment = PaymentFactory.Create(dto.Method);
        payment.MemberId = dto.MemberId;
        payment.SubscriptionId = dto.SubscriptionId;
        payment.Amount = baseAmount;
        payment.DiscountAmount = discount;
        payment.FinalAmount = finalAmount;

        var ok = payment.ProcessPayment();
        if (!ok) throw new Exception("Payment failed");

        await _paymentRepo.AddAsync(payment);
        return payment;
    }

    public async Task<List<PaymentSummaryDto>> GetByMemberAsync(Guid memberId)
    {
        return await _db.Payments
            .Where(x => x.MemberId == memberId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new PaymentSummaryDto(
                x.Id,
                x.MemberId,
                x.SubscriptionId,
                x.Amount,
                x.DiscountAmount,
                x.FinalAmount,
                x.Status,
                x is CreditCardPayment ? "CREDIT_CARD" : "PROMPTPAY",
                x.CreatedAt))
            .ToListAsync();
    }
}
