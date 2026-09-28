using Aurum.Application.Common.Interfaces;
using Aurum.Domain.Entities;
using Aurum.Domain.Enums;
using Aurum.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Aurum.Infrastructure.Repositories;

public class DealRepository : IDealRepository
{
    private readonly AurumDbContext _context;

    public DealRepository(AurumDbContext context)
    {
        _context = context;
    }

    public async Task<Deal?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Deals
            .Include(d => d.Customer)
            .FirstOrDefaultAsync(d => d.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<Deal>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Deals
            .Include(d => d.Customer)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Deal>> GetByStageAsync(DealStage stage, CancellationToken cancellationToken = default)
    {
        return await _context.Deals
            .Include(d => d.Customer)
            .Where(d => d.Stage == stage)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Deal deal, CancellationToken cancellationToken = default)
    {
        await _context.Deals.AddAsync(deal, cancellationToken);
    }

    public void Update(Deal deal)
    {
        _context.Deals.Update(deal);
    }

    public void Delete(Deal deal)
    {
        _context.Deals.Remove(deal);
    }
}
