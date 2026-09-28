using Aurum.Application.Common.Interfaces;
using Aurum.Domain.Entities;
using Aurum.Domain.Enums;
using MediatR;

namespace Aurum.Application.Customers.Commands.CreateCustomer;

// COMMAND: Intención de cambio de estado (CQRS Write)
public record CreateCustomerCommand(
    string FullName,
    string Email,
    string Company,
    string Phone = "",
    CustomerTier Tier = CustomerTier.Standard
) : IRequest<Guid>;

public class CreateCustomerCommandHandler : IRequestHandler<CreateCustomerCommand, Guid>
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateCustomerCommandHandler(ICustomerRepository customerRepository, IUnitOfWork unitOfWork)
    {
        _customerRepository = customerRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
    {
        var customer = new Customer(request.FullName, request.Email, request.Company, request.Phone, request.Tier);
        await _customerRepository.AddAsync(customer, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return customer.Id;
    }
}
