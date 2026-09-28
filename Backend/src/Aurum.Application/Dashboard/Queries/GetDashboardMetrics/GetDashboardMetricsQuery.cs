using Aurum.Application.Common.Interfaces;
using Aurum.Application.DTOs;
using Aurum.Domain.Enums;
using MediatR;

namespace Aurum.Application.Dashboard.Queries.GetDashboardMetrics;

public record GetDashboardMetricsQuery : IRequest<DashboardMetricsDto>;

public class GetDashboardMetricsQueryHandler : IRequestHandler<GetDashboardMetricsQuery, DashboardMetricsDto>
{
    private readonly IDealRepository _dealRepository;
    private readonly ICustomerRepository _customerRepository;

    public GetDashboardMetricsQueryHandler(IDealRepository dealRepository, ICustomerRepository customerRepository)
    {
        _dealRepository = dealRepository;
        _customerRepository = customerRepository;
    }

    public async Task<DashboardMetricsDto> Handle(GetDashboardMetricsQuery request, CancellationToken cancellationToken)
    {
        var deals = await _dealRepository.GetAllAsync(cancellationToken);
        var customers = await _customerRepository.GetAllAsync(cancellationToken);

        var activeDeals = deals.Where(d => d.Stage != DealStage.Won && d.Stage != DealStage.Lost).ToList();
        var wonDeals = deals.Where(d => d.Stage == DealStage.Won).ToList();

        decimal pipelineTotal = activeDeals.Sum(d => d.Value.Amount);
        decimal wonTotal = wonDeals.Sum(d => d.Value.Amount);

        int totalDeals = deals.Count;
        double conversionRate = totalDeals > 0 ? ((double)wonDeals.Count / totalDeals) * 100 : 0;

        var byStage = Enum.GetValues<DealStage>().Select(stage =>
        {
            var stageDeals = deals.Where(d => d.Stage == stage).ToList();
            return new DealsByStageDto(
                stage.ToString(),
                stageDeals.Count,
                stageDeals.Sum(d => d.Value.Amount)
            );
        }).ToList();

        return new DashboardMetricsDto(
            pipelineTotal,
            wonTotal,
            customers.Count,
            activeDeals.Count,
            wonDeals.Count,
            Math.Round(conversionRate, 1),
            byStage
        );
    }
}
