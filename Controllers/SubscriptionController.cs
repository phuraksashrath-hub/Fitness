using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/subscriptions")]
public class SubscriptionController : ControllerBase
{
    private readonly SubscriptionService _service;
    public SubscriptionController(SubscriptionService service) => _service = service;

    [HttpPost]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeDto dto)
    {
        var result = await _service.SubscribeAsync(dto);
        return Ok(result);
    }
}