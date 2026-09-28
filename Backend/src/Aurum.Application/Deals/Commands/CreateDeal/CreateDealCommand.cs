using Aurum.Application.Common.Interfaces;
using Aurum.Domain.Entities;
using Aurum.Domain.Enums;
using Aurum.Domain.ValueObjects;
using MediatR;

namespace Aurum.Application.Deals.Commands.CreateDeal;

public record CreateDealCommand(
    string Title,
    decimal Amount,
    string Currency,
    Guid CustomerId,
    DealStage Stage = DealStage.Lead
) : IRequest<Guid>;

public class CreateDealCommandHandler : IRequestHandler<CreateDealCommand, Guid>
{
    private readonly IDealRepository _dealRepository;
    private readonly ICustomerRepository _customerRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateDealCommandHandler(
        IDealRepository dealRepository,
        ICustomerRepository customerRepository,
        IUnitOfWork unitOfWork)
    {
        _dealRepository = dealRepository;
        _customerRepository = customerRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateDealCommand request, CancellationToken cancellationToken)
    {
        var customer = await _customerRepository.GetByIdAsync(request.CustomerId, cancellationToken);
        if (customer == null)
            throw new KeyNotFoundException($"Cliente con ID '{request.CustomerId}' no encontrado.");

        var money = new Money(request.Amount, request.Currency);
        var deal = new Deal(request.Title, money, request.CustomerId, request.Stage);

        await _dealRepository.AddAsync(deal, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return deal.Id;
    }
}
