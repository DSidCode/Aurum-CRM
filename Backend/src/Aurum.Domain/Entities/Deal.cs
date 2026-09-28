using Aurum.Domain.Enums;
using Aurum.Domain.ValueObjects;

namespace Aurum.Domain.Entities;

public class Deal
{
    public Guid Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public Money Value { get; private set; } = new(0);
    public DealStage Stage { get; private set; }
    public Guid CustomerId { get; private set; }
    public Customer? Customer { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? ClosedAt { get; private set; }

    private Deal() { } // EF Core

    public Deal(string title, Money value, Guid customerId, DealStage stage = DealStage.Lead)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("El título de la oportunidad no puede estar vacío.");

        Id = Guid.NewGuid();
        Title = title.Trim();
        Value = value ?? throw new ArgumentNullException(nameof(value));
        CustomerId = customerId;
        Stage = stage;
        CreatedAt = DateTime.UtcNow;
    }

    public void AdvanceStage(DealStage newStage)
    {
        Stage = newStage;
        if (newStage == DealStage.Won || newStage == DealStage.Lost)
        {
            ClosedAt = DateTime.UtcNow;
        }
    }

    public void UpdateValue(Money newValue)
    {
        Value = newValue ?? throw new ArgumentNullException(nameof(newValue));
    }
}
