namespace FitnessCenter.Api.DTOs;

public record RegisterDto(string FullName, string Email, string Password, string? Phone);
public record LoginDto(string Email, string Password);
public record AuthResponseDto(string AccessToken, string FullName, string Email);
public record AdminMemberDto(Guid Id, string FullName, string Email, string Phone, string Role);
public record UpdateMemberDto(string FullName, string Email, string? Phone, string Role);
public record MembershipPlanDto(Guid Id, string PlanName, int DurationDays, decimal Price, int MaxSessionsPerMonth);
public record UpdatePlanDto(string PlanName, int DurationDays, decimal Price, int MaxSessionsPerMonth);
public record CreatePlanDto(string PlanName, int DurationDays, decimal Price, int MaxSessionsPerMonth);
public record AdminTrainerDto(Guid Id, string FullName, string Email, string Specialty, string Role);
public record UpdateTrainerDto(string FullName, string Email, string Specialty, string Role);
public record CreateTrainerDto(string FullName, string Email, string Password, string Specialty);
