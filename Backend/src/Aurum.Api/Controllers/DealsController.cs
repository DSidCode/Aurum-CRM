using Aurum.Application.Deals.Commands.CreateDeal;
using Aurum.Application.Deals.Commands.UpdateDealStage;
using Aurum.Application.Deals.Queries.GetDeals;
using Aurum.Application.DTOs;
using Aurum.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Aurum.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DealsController : ControllerBase
{
    private readonly IMediator _mediator;

    public DealsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<DealDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetDealsQuery(), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateDealCommand command, CancellationToken cancellationToken)
    {
        var dealId = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetAll), new { id = dealId }, new { Id = dealId, Message = "Oportunidad creada exitosamente." });
    }

    [HttpPut("{id:guid}/stage")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStage(Guid id, [FromBody] UpdateStageRequest request, CancellationToken cancellationToken)
    {
        var success = await _mediator.Send(new UpdateDealStageCommand(id, request.NewStage), cancellationToken);
        if (!success)
            return NotFound(new { Message = "Oportunidad no encontrada." });

        return Ok(new { Message = $"Etapa actualizada a {request.NewStage}." });
    }
}

public record UpdateStageRequest(DealStage NewStage);
