using Aurum.Application.Common.Interfaces;
using Aurum.Domain.Entities;
using Aurum.Domain.Enums;

namespace Aurum.Application.Tests;

// Dobles de prueba en memoria: los handlers solo conocen las interfaces,
// así que no hace falta base de datos ni librería de mocks.
internal class FakeCustomerRepository : ICustomerRepository
{
    public List<Customer> Items { get; } = new();

    public Task<Customer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        Task.FromResult(Items.FirstOrDefault(c => c.Id == id));
    public Task<IReadOnlyList<Customer>> GetAllAsync(CancellationToken cancellationToken = default) =>
        Task.FromResult<IReadOnlyList<Customer>>(Items);
    public Task AddAsync(Customer customer, CancellationToken cancellationToken = default)
    {
        Items.Add(customer);
        return Task.CompletedTask;
    }
    public void Update(Customer customer) { }
    public void Delete(Customer customer) => Items.Remove(customer);
}

internal class FakeDealRepository : IDealRepository
{
    public List<Deal> Items { get; } = new();

    public Task<Deal?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        Task.FromResult(Items.FirstOrDefault(d => d.Id == id));
    public Task<IReadOnlyList<Deal>> GetAllAsync(CancellationToken cancellationToken = default) =>
        Task.FromResult<IReadOnlyList<Deal>>(Items);
    public Task<IReadOnlyList<Deal>> GetByStageAsync(DealStage stage, CancellationToken cancellationToken = default) =>
        Task.FromResult<IReadOnlyList<Deal>>(Items.Where(d => d.Stage == stage).ToList());
    public Task AddAsync(Deal deal, CancellationToken cancellationToken = default)
    {
        Items.Add(deal);
        return Task.CompletedTask;
    }
    public void Update(Deal deal) { }
    public void Delete(Deal deal) => Items.Remove(deal);
}

internal class FakeUnitOfWork : IUnitOfWork
{
    public int SaveCount { get; private set; }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        SaveCount++;
        return Task.FromResult(1);
    }
}
