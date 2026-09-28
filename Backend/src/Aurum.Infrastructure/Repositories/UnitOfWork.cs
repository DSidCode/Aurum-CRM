using Aurum.Application.Common.Interfaces;
using Aurum.Infrastructure.Data;

namespace Aurum.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AurumDbContext _context;

    public UnitOfWork(AurumDbContext context)
    {
        _context = context;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
}
