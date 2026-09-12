using FitnessCenter.Api.DTOs;
using FitnessCenter.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/sessions")]
[Authorize(Roles = "MEMBER")]
public class SessionController : ControllerBase
{
    private readonly BookingService _service;
    public SessionController(BookingService service) => _service = service;

    [HttpGet("trainers")]
    public async Task<IActionResult> Trainers()
        => Ok(await _service.GetTrainerCatalogAsync());

    [HttpPost("book")]
    public async Task<IActionResult> Book([FromBody] BookSessionDto dto)
    {
        var access = ResolveMemberId(dto.MemberId);
        if (access.failure is not null) return access.failure;

        return Ok(await _service.BookAsync(dto with { MemberId = access.memberId }));
    }

    [HttpGet("me")]
    public async Task<IActionResult> MySessions([FromQuery] Guid memberId)
    {
        var access = ResolveMemberId(memberId);
        if (access.failure is not null) return access.failure;

        return Ok(await _service.GetByMemberAsync(access.memberId));
    }

    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        var access = ResolveMemberId(Guid.Empty);
        if (access.failure is not null) return access.failure;

        await _service.CancelAsync(id, access.memberId);
        return Ok(new { message = "Cancelled" });
    }

    [HttpPut("{id}/reschedule")]
    public async Task<IActionResult> Reschedule(Guid id, [FromBody] RescheduleDto dto)
    {
        var access = ResolveMemberId(Guid.Empty);
        if (access.failure is not null) return access.failure;

        await _service.RescheduleAsync(id, access.memberId, dto);
        return Ok(new { message = "Rescheduled" });
    }

    private (Guid memberId, IActionResult? failure) ResolveMemberId(Guid requestedMemberId)
    {
        var claimValue = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
        if (!Guid.TryParse(claimValue, out var authenticatedMemberId))
        {
            return (Guid.Empty, Unauthorized(new { message = "Invalid member identity" }));
        }

        if (requestedMemberId != Guid.Empty && requestedMemberId != authenticatedMemberId)
        {
            return (Guid.Empty, Forbid());
        }

        return (authenticatedMemberId, null);
    }
}

public record RescheduleDto(DateOnly SessionDate, TimeOnly StartTime, TimeOnly EndTime);
