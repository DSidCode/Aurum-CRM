namespace Aurum.Domain.ValueObjects;

public record Money
{
    public decimal Amount { get; init; }
    public string Currency { get; init; }

    public Money() { Currency = "EUR"; }

    public Money(decimal amount, string currency = "EUR")
    {
        if (amount < 0)
            throw new ArgumentException("El monto monetario no puede ser negativo.");

        Amount = amount;
        Currency = string.IsNullOrWhiteSpace(currency) ? "EUR" : currency.ToUpperInvariant();
    }

    public override string ToString() => $"{Amount:N2} {Currency}";
}
