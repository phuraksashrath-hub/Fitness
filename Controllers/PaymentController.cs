using FitnessCenter.Api.DTOs;
using FitnessCenter.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/payments")]
[Authorize(Roles = "MEMBER,ADMIN")]
public class PaymentController : ControllerBase
{
    private readonly PaymentService _service;
    public PaymentController(PaymentService service) => _service = service;

    [HttpGet("me")]
    public async Task<IActionResult> Mine([FromQuery] Guid memberId)
        => Ok(await _service.GetByMemberAsync(memberId));

    [HttpPost("process")]
    public async Task<IActionResult> Process([FromBody] ProcessPaymentDto dto)
    {
        var result = await _service.ProcessAsync(dto);
        return Ok(result);
    }
}
