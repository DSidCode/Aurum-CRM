using Aurum.Domain.Exceptions;

namespace Aurum.Domain.ValueObjects;

public record Money
{
    public decimal Amount { get; private init; }
    public string Currency { get; private init; }

    private Money() { Currency = "EUR"; } // EF Core

    public Money(decimal amount, string currency = "EUR")
    {
        if (amount < 0)
            throw new DomainException("El monto monetario no puede ser negativo.");

        Amount = amount;
        Currency = string.IsNullOrWhiteSpace(currency) ? "EUR" : currency.Trim().ToUpperInvariant();
    }

    public override string ToString() => $"{Amount:N2} {Currency}";
}
