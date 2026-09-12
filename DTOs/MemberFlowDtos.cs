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
    string Method,
    DateTime CreatedAt);

public record AdminSubscriptionDto(
    Guid Id,
    string MemberName,
    string PlanName,
    string Status,
    int RemainingSessions,
    DateOnly StartDate,
    DateOnly EndDate);

public record AdminPaymentDto(
    Guid Id,
    string MemberName,
    string Method,
    decimal Amount,
    decimal DiscountAmount,
    decimal FinalAmount,
    string Status,
    DateTime CreatedAt);

public record TrainerSessionItemDto(
    Guid Id,
    string MemberName,
    string PlanName,
    DateOnly SessionDate,
    TimeOnly StartTime,
    TimeOnly EndTime,
    string Status);

public record TrainerMemberProgressDto(
    string MemberName,
    string PlanName,
    int RemainingSessions,
    string SubscriptionStatus);

public record TrainerDashboardDto(
    string TrainerName,
    string Specialty,
    int TodaySessions,
    int UpcomingSessions,
    int ActiveMembers,
    double WeeklyHours,
    List<TrainerSessionItemDto> UpcomingSchedule,
    List<TrainerMemberProgressDto> MemberProgress);
