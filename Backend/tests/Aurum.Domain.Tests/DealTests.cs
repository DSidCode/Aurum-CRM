using Aurum.Domain.Entities;
using Aurum.Domain.Enums;
using Aurum.Domain.Exceptions;
using Aurum.Domain.ValueObjects;

namespace Aurum.Domain.Tests;

public class DealTests
{
    private static Deal NewDeal(DealStage stage = DealStage.Lead) =>
        new("Implantación CRM", new Money(10_000), Guid.NewGuid(), stage);

    [Fact]
    public void AdvanceStage_moves_forward()
    {
        var deal = NewDeal();

        deal.AdvanceStage(DealStage.Contacted);

        Assert.Equal(DealStage.Contacted, deal.Stage);
        Assert.Null(deal.ClosedAt);
    }

    [Theory]
    [InlineData(DealStage.Won)]
    [InlineData(DealStage.Lost)]
    public void Closing_a_deal_sets_ClosedAt(DealStage closingStage)
    {
        var deal = NewDeal(DealStage.InNegotiation);

        deal.AdvanceStage(closingStage);

        Assert.True(deal.IsClosed);
        Assert.NotNull(deal.ClosedAt);
    }

    [Fact]
    public void AdvanceStage_cannot_go_backwards()
    {
        var deal = NewDeal(DealStage.ProposalSent);

        Assert.Throws<DomainException>(() => deal.AdvanceStage(DealStage.Contacted));
        Assert.Equal(DealStage.ProposalSent, deal.Stage);
    }

    [Fact]
    public void AdvanceStage_cannot_stay_in_same_stage()
    {
        var deal = NewDeal(DealStage.Contacted);

        Assert.Throws<DomainException>(() => deal.AdvanceStage(DealStage.Contacted));
    }

    [Fact]
    public void Closed_deal_cannot_change_stage()
    {
        var deal = NewDeal(DealStage.Won);

        Assert.Throws<DomainException>(() => deal.AdvanceStage(DealStage.Lost));
    }

    [Fact]
    public void Deal_created_as_won_is_already_closed()
    {
        var deal = NewDeal(DealStage.Won);

        Assert.NotNull(deal.ClosedAt);
    }

    [Fact]
    public void AdvanceStage_rejects_unknown_stage()
    {
        var deal = NewDeal();

        Assert.Throws<DomainException>(() => deal.AdvanceStage((DealStage)99));
    }

    [Fact]
    public void Deal_requires_a_title()
    {
        Assert.Throws<DomainException>(() => new Deal("  ", new Money(1), Guid.NewGuid()));
    }
}
