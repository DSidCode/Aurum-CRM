using Aurum.Domain.Enums;

namespace Aurum.Application.DTOs;

public record CustomerDto(
    Guid Id,
    string FullName,
    string Email,
    string Company,
    string Phone,
    CustomerTier Tier,
    DateTime CreatedAt,
    int ActiveDealsCount
);
