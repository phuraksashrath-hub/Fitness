using FitnessCenter.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/trainers")]
[Authorize(Roles = "TRAINER")]
public class TrainerController : ControllerBase
{
    private readonly TrainerService _service;

    public TrainerController(TrainerService service)
    {
        _service = service;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        var claimValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(claimValue, out var trainerId))
        {
            return Unauthorized(new { message = "Invalid trainer identity" });
        }

        return Ok(await _service.GetDashboardAsync(trainerId));
    }
}
