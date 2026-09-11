using FitnessCenter.Api.Domain.Enums;

namespace FitnessCenter.Api.DTOs;

public record ProcessPaymentDto(Guid MemberId, Guid? SubscriptionId, decimal Amount, PaymentMethod Method, string DiscountType);