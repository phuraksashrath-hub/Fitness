using FitnessCenter.Api.DTOs;
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
        var trainerId = ResolveTrainerId();
        if (trainerId == Guid.Empty)
        {
            return Unauthorized(new { message = "Invalid trainer identity" });
        }

        return Ok(await _service.GetDashboardAsync(trainerId));
    }

    [HttpPut("sessions/{id:guid}/notes")]
    public async Task<IActionResult> UpdateNotes(Guid id, [FromBody] UpdateTrainerNotesDto dto)
    {
        var trainerId = ResolveTrainerId();
        if (trainerId == Guid.Empty)
        {
            return Unauthorized(new { message = "Invalid trainer identity" });
        }

        await _service.UpdateNotesAsync(trainerId, id, dto.Notes);
        return Ok(new { message = "Notes saved" });
    }

    [HttpPut("sessions/{id:guid}/complete")]
    public async Task<IActionResult> MarkCompleted(Guid id, [FromBody] MarkTrainerSessionCompletedDto dto)
    {
        var trainerId = ResolveTrainerId();
        if (trainerId == Guid.Empty)
        {
            return Unauthorized(new { message = "Invalid trainer identity" });
        }

        await _service.MarkCompletedAsync(trainerId, id, dto.Notes);
        return Ok(new { message = "Session completed" });
    }

    private Guid ResolveTrainerId()
    {
        var claimValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(claimValue, out var trainerId) ? trainerId : Guid.Empty;
    }
}
