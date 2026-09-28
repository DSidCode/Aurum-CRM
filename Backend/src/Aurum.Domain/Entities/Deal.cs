using Aurum.Domain.Enums;
using Aurum.Domain.Exceptions;
using Aurum.Domain.ValueObjects;

namespace Aurum.Domain.Entities;

public class Deal
{
    public Guid Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public Money Value { get; private set; } = new(0);

    public bool IsClosed => Stage is DealStage.Won or DealStage.Lost;
    public DealStage Stage { get; private set; }
    public Guid CustomerId { get; private set; }
    public Customer? Customer { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? ClosedAt { get; private set; }

    private Deal() { } // EF Core

    public Deal(string title, Money value, Guid customerId, DealStage stage = DealStage.Lead)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("El título de la oportunidad no puede estar vacío.");

        Id = Guid.NewGuid();
        Title = title.Trim();
        Value = value ?? throw new ArgumentNullException(nameof(value));
        CustomerId = customerId;
        Stage = stage;
        CreatedAt = DateTime.UtcNow;
        if (IsClosed)
            ClosedAt = CreatedAt;
    }

    // Una oportunidad solo avanza hacia delante (o se marca como perdida)
    // y, una vez cerrada, ya no puede cambiar de fase.
    public void AdvanceStage(DealStage newStage)
    {
        if (!Enum.IsDefined(newStage))
            throw new DomainException($"La fase '{(int)newStage}' no existe.");
        if (IsClosed)
            throw new DomainException("La oportunidad ya está cerrada y no puede cambiar de fase.");
        if (newStage != DealStage.Lost && newStage <= Stage)
            throw new DomainException($"No se puede retroceder de '{Stage}' a '{newStage}'.");

        Stage = newStage;
        if (IsClosed)
            ClosedAt = DateTime.UtcNow;
    }

    public void UpdateValue(Money newValue)
    {
        Value = newValue ?? throw new ArgumentNullException(nameof(newValue));
    }
}
