using Aurum.Application.Common.Interfaces;
using Aurum.Application.DTOs;
using MediatR;

namespace Aurum.Application.Customers.Queries.GetCustomers;

// QUERY: Operación de solo lectura (CQRS Read)
public record GetCustomersQuery : IRequest<IReadOnlyList<CustomerDto>>;

public class GetCustomersQueryHandler : IRequestHandler<GetCustomersQuery, IReadOnlyList<CustomerDto>>
{
    private readonly ICustomerRepository _customerRepository;

    public GetCustomersQueryHandler(ICustomerRepository customerRepository)
    {
        _customerRepository = customerRepository;
    }

    public async Task<IReadOnlyList<CustomerDto>> Handle(GetCustomersQuery request, CancellationToken cancellationToken)
    {
        var customers = await _customerRepository.GetAllAsync(cancellationToken);
        return customers.Select(c => new CustomerDto(
            c.Id,
            c.FullName,
            c.Email,
            c.Company,
            c.Phone,
            c.Tier,
            c.CreatedAt,
            c.Deals?.Count ?? 0
        )).ToList();
    }
}
