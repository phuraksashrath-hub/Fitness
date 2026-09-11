using FitnessCenter.Api.Domain.Entities;
using FitnessCenter.Api.DTOs;
using FitnessCenter.Api.Factories;
using FitnessCenter.Api.Repositories;
using FitnessCenter.Api.Strategies;

public class PaymentService
{
    private readonly IPaymentRepository _paymentRepo;

    public PaymentService(IPaymentRepository paymentRepo)
    {
        _paymentRepo = paymentRepo;
    }

    public async Task<Payment> ProcessAsync(ProcessPaymentDto dto)
    {
        var discountStrategy = DiscountStrategyResolver.Resolve(dto.DiscountType);
        var discount = discountStrategy.GetDiscount(dto.Amount);
        var finalAmount = dto.Amount - discount;

        var payment = PaymentFactory.Create(dto.Method);
        payment.MemberId = dto.MemberId;
        payment.SubscriptionId = dto.SubscriptionId;
        payment.Amount = dto.Amount;
        payment.DiscountAmount = discount;
        payment.FinalAmount = finalAmount;

        var ok = payment.ProcessPayment();
        if (!ok) throw new Exception("Payment failed");

        await _paymentRepo.AddAsync(payment);
        return payment;
    }
}