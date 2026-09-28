using Aurum.Application.Common.Interfaces;
using Aurum.Application.DTOs;
using MediatR;

namespace Aurum.Application.Deals.Queries.GetDeals;

public record GetDealsQuery : IRequest<IReadOnlyList<DealDto>>;

public class GetDealsQueryHandler : IRequestHandler<GetDealsQuery, IReadOnlyList<DealDto>>
{
    private readonly IDealRepository _dealRepository;

    public GetDealsQueryHandler(IDealRepository dealRepository)
    {
        _dealRepository = dealRepository;
    }

    public async Task<IReadOnlyList<DealDto>> Handle(GetDealsQuery request, CancellationToken cancellationToken)
    {
        var deals = await _dealRepository.GetAllAsync(cancellationToken);
        return deals.Select(d => new DealDto(
            d.Id,
            d.Title,
            d.Value.Amount,
            d.Value.Currency,
            d.Stage,
            d.Stage.ToString(),
            d.CustomerId,
            d.Customer?.FullName ?? "Cliente no asignado",
            d.Customer?.Company ?? "",
            d.CreatedAt,
            d.ClosedAt
        )).ToList();
    }
}
