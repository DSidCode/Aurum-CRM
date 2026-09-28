using Aurum.Domain.Exceptions;
using Aurum.Domain.ValueObjects;

namespace Aurum.Domain.Tests;

public class MoneyTests
{
    [Fact]
    public void Negative_amount_is_rejected()
    {
        Assert.Throws<DomainException>(() => new Money(-1));
    }

    [Fact]
    public void Currency_is_normalized_and_defaults_to_EUR()
    {
        Assert.Equal("USD", new Money(5, " usd ").Currency);
        Assert.Equal("EUR", new Money(5, "").Currency);
    }

    [Fact]
    public void Money_is_compared_by_value()
    {
        Assert.Equal(new Money(100, "EUR"), new Money(100, "eur"));
        Assert.NotEqual(new Money(100, "EUR"), new Money(100, "USD"));
    }
}
