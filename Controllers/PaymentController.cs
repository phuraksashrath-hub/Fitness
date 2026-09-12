using FitnessCenter.Api.DTOs;
using FitnessCenter.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/payments")]
[Authorize(Roles = "MEMBER,ADMIN")]
public class PaymentController : ControllerBase
{
    private readonly PaymentService _service;
    public PaymentController(PaymentService service) => _service = service;

    [HttpGet("me")]
    public async Task<IActionResult> Mine([FromQuery] Guid memberId)
    {
        var access = ResolveMemberId(memberId);
        if (access.failure is not null) return access.failure;

        return Ok(await _service.GetByMemberAsync(access.memberId));
    }

    [HttpPost("process")]
    public async Task<IActionResult> Process([FromBody] ProcessPaymentDto dto)
    {
        var access = ResolveMemberId(dto.MemberId);
        if (access.failure is not null) return access.failure;

        var result = await _service.ProcessAsync(dto with { MemberId = access.memberId });
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
