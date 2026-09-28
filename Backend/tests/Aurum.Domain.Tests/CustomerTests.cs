using Aurum.Domain.Entities;
using Aurum.Domain.Enums;
using Aurum.Domain.Exceptions;

namespace Aurum.Domain.Tests;

public class CustomerTests
{
    [Fact]
    public void Constructor_normalizes_input()
    {
        var customer = new Customer("  Elena Rostova ", " Elena@Luxury.CH ", " Maison Rostova ", tier: CustomerTier.VIP);

        Assert.Equal("Elena Rostova", customer.FullName);
        Assert.Equal("elena@luxury.ch", customer.Email);
        Assert.Equal("Maison Rostova", customer.Company);
        Assert.Equal(CustomerTier.VIP, customer.Tier);
    }

    [Theory]
    [InlineData("", "a@b.com")]
    [InlineData("Elena", "sin-arroba")]
    [InlineData("Elena", "")]
    public void Constructor_rejects_invalid_data(string fullName, string email)
    {
        Assert.Throws<DomainException>(() => new Customer(fullName, email, "Empresa"));
    }
}
