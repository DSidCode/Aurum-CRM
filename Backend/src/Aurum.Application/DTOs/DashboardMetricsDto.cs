namespace Aurum.Application.DTOs;

public record DashboardMetricsDto(
    decimal TotalPipelineValue,
    decimal TotalWonValue,
    int TotalCustomersCount,
    int ActiveDealsCount,
    int WonDealsCount,
    double ConversionRatePercentage,
    IReadOnlyList<DealsByStageDto> DealsByStage
);

public record DealsByStageDto(
    string Stage,
    int Count,
    decimal TotalValue
);
