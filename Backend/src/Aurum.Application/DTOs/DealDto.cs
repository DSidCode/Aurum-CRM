using Aurum.Domain.Enums;

namespace Aurum.Application.DTOs;

public record DealDto(
    Guid Id,
    string Title,
    decimal ValueAmount,
    string Currency,
    DealStage Stage,
    string StageName,
    Guid CustomerId,
    string CustomerName,
    string Company,
    DateTime CreatedAt,
    DateTime? ClosedAt
);
