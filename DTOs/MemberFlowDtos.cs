namespace FitnessCenter.Api.DTOs;

public record SubscriptionSummaryDto(
    Guid Id,
    Guid MemberId,
    Guid PlanId,
    string PlanName,
    DateOnly StartDate,
    DateOnly EndDate,
    string Status,
    int RemainingSessions,
    decimal Price,
    int DurationDays);

public record TrainerSummaryDto(Guid Id, string FullName, string Specialty);

public record SessionSummaryDto(
    Guid Id,
    Guid MemberId,
    Guid TrainerId,
    Guid SubscriptionId,
    string TrainerName,
    DateOnly SessionDate,
    TimeOnly StartTime,
    TimeOnly EndTime,
    string Status);

public record PaymentSummaryDto(
    Guid Id,
    Guid MemberId,
    Guid? SubscriptionId,
    decimal Amount,
    decimal DiscountAmount,
    decimal FinalAmount,
    string Status,
    string Method);
