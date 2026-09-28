using Aurum.Domain.Enums;
using Aurum.Domain.Exceptions;

namespace Aurum.Domain.Entities;

public class Customer
{
    public Guid Id { get; private set; }
    public string FullName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Company { get; private set; } = string.Empty;
    public string Phone { get; private set; } = string.Empty;
    public CustomerTier Tier { get; private set; }
    public DateTime CreatedAt { get; private set; }

    // Navigation property
    public List<Deal> Deals { get; private set; } = new();

    private Customer() { } // EF Core

    public Customer(string fullName, string email, string company, string phone = "", CustomerTier tier = CustomerTier.Standard)
    {
        if (string.IsNullOrWhiteSpace(fullName))
            throw new DomainException("El nombre del cliente no puede estar vacío.");
        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@'))
            throw new DomainException("Formato de email inválido.");

        Id = Guid.NewGuid();
        FullName = fullName.Trim();
        Email = email.Trim().ToLowerInvariant();
        Company = company.Trim();
        Phone = phone.Trim();
        Tier = tier;
        CreatedAt = DateTime.UtcNow;
    }

    public void UpdateContactInfo(string fullName, string email, string company, string phone)
    {
        if (string.IsNullOrWhiteSpace(fullName)) throw new DomainException("Nombre inválido.");
        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@')) throw new DomainException("Email inválido.");

        FullName = fullName.Trim();
        Email = email.Trim().ToLowerInvariant();
        Company = company.Trim();
        Phone = phone.Trim();
    }

    public void UpgradeTier(CustomerTier newTier)
    {
        Tier = newTier;
    }
}
