using Aurum.Application.Customers.Commands.CreateCustomer;
using Aurum.Application.Dashboard.Queries.GetDashboardMetrics;
using Aurum.Application.Deals.Commands.CreateDeal;
using Aurum.Application.Deals.Commands.UpdateDealStage;
using Aurum.Domain.Entities;
using Aurum.Domain.Enums;
using Aurum.Domain.Exceptions;
using Aurum.Domain.ValueObjects;

namespace Aurum.Application.Tests;

public class HandlerTests
{
    private readonly FakeCustomerRepository _customers = new();
    private readonly FakeDealRepository _deals = new();
    private readonly FakeUnitOfWork _unitOfWork = new();

    [Fact]
    public async Task CreateCustomer_persists_and_saves()
    {
        var handler = new CreateCustomerCommandHandler(_customers, _unitOfWork);

        var id = await handler.Handle(new CreateCustomerCommand("Elena Rostova", "elena@luxury.ch", "Maison Rostova"), default);

        Assert.Single(_customers.Items, c => c.Id == id);
        Assert.Equal(1, _unitOfWork.SaveCount);
    }

    [Fact]
    public async Task CreateCustomer_with_invalid_email_saves_nothing()
    {
        var handler = new CreateCustomerCommandHandler(_customers, _unitOfWork);

        await Assert.ThrowsAsync<DomainException>(() =>
            handler.Handle(new CreateCustomerCommand("Elena", "no-es-un-email", "Maison"), default));

        Assert.Empty(_customers.Items);
        Assert.Equal(0, _unitOfWork.SaveCount);
    }

    [Fact]
    public async Task CreateDeal_for_unknown_customer_throws_not_found()
    {
        var handler = new CreateDealCommandHandler(_deals, _customers, _unitOfWork);

        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            handler.Handle(new CreateDealCommand("Auditoría", 1000, "EUR", Guid.NewGuid()), default));
    }

    [Fact]
    public async Task UpdateDealStage_advances_existing_deal()
    {
        var deal = new Deal("Auditoría", new Money(1000), Guid.NewGuid());
        _deals.Items.Add(deal);
        var handler = new UpdateDealStageCommandHandler(_deals, _unitOfWork);

        var updated = await handler.Handle(new UpdateDealStageCommand(deal.Id, DealStage.Contacted), default);

        Assert.True(updated);
        Assert.Equal(DealStage.Contacted, deal.Stage);
        Assert.Equal(1, _unitOfWork.SaveCount);
    }

    [Fact]
    public async Task UpdateDealStage_returns_false_for_unknown_deal()
    {
        var handler = new UpdateDealStageCommandHandler(_deals, _unitOfWork);

        var updated = await handler.Handle(new UpdateDealStageCommand(Guid.NewGuid(), DealStage.Won), default);

        Assert.False(updated);
        Assert.Equal(0, _unitOfWork.SaveCount);
    }

    [Fact]
    public async Task DashboardMetrics_are_calculated_from_deals()
    {
        var customer = new Customer("Elena", "elena@luxury.ch", "Maison");
        _customers.Items.Add(customer);
        _deals.Items.Add(new Deal("Abierta", new Money(30_000), customer.Id, DealStage.ProposalSent));
        _deals.Items.Add(new Deal("Ganada", new Money(10_000), customer.Id, DealStage.Won));
        _deals.Items.Add(new Deal("Perdida", new Money(5_000), customer.Id, DealStage.Lost));
        var handler = new GetDashboardMetricsQueryHandler(_deals, _customers);

        var metrics = await handler.Handle(new GetDashboardMetricsQuery(), default);

        Assert.Equal(30_000, metrics.TotalPipelineValue);
        Assert.Equal(10_000, metrics.TotalWonValue);
        Assert.Equal(1, metrics.TotalCustomersCount);
        Assert.Equal(1, metrics.ActiveDealsCount);
        Assert.Equal(1, metrics.WonDealsCount);
        Assert.Equal(33.3, metrics.ConversionRatePercentage);
    }
}
