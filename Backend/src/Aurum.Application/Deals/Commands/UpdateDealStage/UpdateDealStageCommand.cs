using Aurum.Application.Common.Interfaces;
using Aurum.Domain.Enums;
using MediatR;

namespace Aurum.Application.Deals.Commands.UpdateDealStage;

public record UpdateDealStageCommand(Guid DealId, DealStage NewStage) : IRequest<bool>;

public class UpdateDealStageCommandHandler : IRequestHandler<UpdateDealStageCommand, bool>
{
    private readonly IDealRepository _dealRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateDealStageCommandHandler(IDealRepository dealRepository, IUnitOfWork unitOfWork)
    {
        _dealRepository = dealRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(UpdateDealStageCommand request, CancellationToken cancellationToken)
    {
        var deal = await _dealRepository.GetByIdAsync(request.DealId, cancellationToken);
        if (deal == null)
            return false;

        deal.AdvanceStage(request.NewStage);
        _dealRepository.Update(deal);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
