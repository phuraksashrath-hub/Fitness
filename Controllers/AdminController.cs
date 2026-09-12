using FitnessCenter.Api.DTOs;
using FitnessCenter.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "ADMIN")]
public class AdminController : ControllerBase
{
    private readonly AdminService _service;

    public AdminController(AdminService service)
    {
        _service = service;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
        => Ok(await _service.GetDashboardSummaryAsync());

    [HttpGet("members")]
    public async Task<IActionResult> GetMembers()
        => Ok(await _service.GetMembersAsync());

    [HttpPut("members/{id:guid}")]
    public async Task<IActionResult> UpdateMember(Guid id, [FromBody] UpdateMemberDto dto)
        => Ok(await _service.UpdateMemberAsync(id, dto));

    [HttpDelete("members/{id:guid}")]
    public async Task<IActionResult> DeleteMember(Guid id)
    {
        await _service.DeleteMemberAsync(id);
        return Ok(new { message = "Member deleted" });
    }

    [HttpGet("plans")]
    public async Task<IActionResult> GetPlans()
        => Ok(await _service.GetPlansAsync());

    [HttpPost("plans")]
    public async Task<IActionResult> CreatePlan([FromBody] CreatePlanDto dto)
        => Ok(await _service.CreatePlanAsync(dto));

    [HttpPut("plans/{id:guid}")]
    public async Task<IActionResult> UpdatePlan(Guid id, [FromBody] UpdatePlanDto dto)
        => Ok(await _service.UpdatePlanAsync(id, dto));

    [HttpGet("trainers")]
    public async Task<IActionResult> GetTrainers()
        => Ok(await _service.GetTrainersAsync());

    [HttpPost("trainers")]
    public async Task<IActionResult> CreateTrainer([FromBody] CreateTrainerDto dto)
        => Ok(await _service.CreateTrainerAsync(dto));

    [HttpPut("trainers/{id:guid}")]
    public async Task<IActionResult> UpdateTrainer(Guid id, [FromBody] UpdateTrainerDto dto)
        => Ok(await _service.UpdateTrainerAsync(id, dto));

    [HttpGet("subscriptions")]
    public async Task<IActionResult> GetSubscriptions()
        => Ok(await _service.GetSubscriptionsAsync());

    [HttpGet("payments")]
    public async Task<IActionResult> GetPayments()
        => Ok(await _service.GetPaymentsAsync());
}
