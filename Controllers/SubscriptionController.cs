using FitnessCenter.Api.DTOs;
using FitnessCenter.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        => Ok(await _service.GetSubscriptionsByMemberAsync(memberId));

    [HttpPost]
    [Authorize(Roles = "MEMBER,ADMIN")]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeDto dto)
    {
        var result = await _service.SubscribeAsync(dto);
        return Ok(result);
    }
}
