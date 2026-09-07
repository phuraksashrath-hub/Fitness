using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/sessions")]
[Authorize(Roles = "MEMBER")]
public class SessionController : ControllerBase
{
    private readonly BookingService _service;
    public SessionController(BookingService service) => _service = service;

    [HttpPost("book")]
    public async Task<IActionResult> Book([FromBody] BookSessionDto dto)
        => Ok(await _service.BookAsync(dto));

    [HttpGet("me")]
    public async Task<IActionResult> MySessions([FromQuery] Guid memberId)
        => Ok(await _service.GetByMemberAsync(memberId));

    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        await _service.CancelAsync(id);
        return Ok(new { message = "Cancelled" });
    }

    [HttpPut("{id}/reschedule")]
    public async Task<IActionResult> Reschedule(Guid id, [FromBody] RescheduleDto dto)
    {
        await _service.RescheduleAsync(id, dto);
        return Ok(new { message = "Rescheduled" });
    }
}

public record RescheduleDto(DateOnly SessionDate, TimeOnly StartTime, TimeOnly EndTime);