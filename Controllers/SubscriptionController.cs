using FitnessCenter.Api.DTOs;
using FitnessCenter.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/subscriptions")]
public class SubscriptionController : ControllerBase
{
    private readonly SubscriptionService _service;
    public SubscriptionController(SubscriptionService service) => _service = service;

    [HttpGet("plans")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPlans()
        => Ok(await _service.GetPlansAsync());

    [HttpGet("me")]
    [Authorize(Roles = "MEMBER,ADMIN")]
    public async Task<IActionResult> GetMine([FromQuery] Guid memberId)
    {
        var access = ResolveMemberId(memberId);
        if (access.failure is not null) return access.failure;

        return Ok(await _service.GetSubscriptionsByMemberAsync(access.memberId));
    }

    [HttpPost]
    [Authorize(Roles = "MEMBER,ADMIN")]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeDto dto)
    {
        var access = ResolveMemberId(dto.MemberId);
        if (access.failure is not null) return access.failure;

        var result = await _service.SubscribeAsync(dto with { MemberId = access.memberId });
        return Ok(result);
    }

    private (Guid memberId, IActionResult? failure) ResolveMemberId(Guid requestedMemberId)
    {
        if (User.IsInRole("ADMIN"))
        {
            return (requestedMemberId, null);
        }

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
