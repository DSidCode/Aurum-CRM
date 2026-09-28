using Aurum.Domain.Entities;
using Aurum.Domain.Enums;

namespace Aurum.Application.Common.Interfaces;

public interface IDealRepository
{
    Task<Deal?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Deal>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Deal>> GetByStageAsync(DealStage stage, CancellationToken cancellationToken = default);
    Task AddAsync(Deal deal, CancellationToken cancellationToken = default);
    void Update(Deal deal);
    void Delete(Deal deal);
}
