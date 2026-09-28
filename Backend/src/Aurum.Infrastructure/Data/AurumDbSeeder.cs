using Aurum.Domain.Entities;
using Aurum.Domain.Enums;
using Aurum.Domain.ValueObjects;

namespace Aurum.Infrastructure.Data;

public static class AurumDbSeeder
{
    public static async Task SeedSampleDataAsync(AurumDbContext context)
    {
        if (context.Customers.Any()) return;

        var c1 = new Customer("Elena Rostova", "elena@luxurycouture.ch", "Maison Rostova Ginebra", "+41 22 731 00 22", CustomerTier.VIP);
        var c2 = new Customer("Carlos Benítez", "cbenitez@ibericaholdings.es", "Ibérica Capital Partners", "+34 91 555 43 21", CustomerTier.Premium);
        var c3 = new Customer("Alexander Vance", "vance@quantumhorizons.co.uk", "Vance Global Logistics", "+44 20 7946 0912", CustomerTier.VIP);
        var c4 = new Customer("Sofía Alarcón", "s.alarcon@artatelier.paris", "Alarcón Haute Horlogerie", "+33 1 42 68 55 00", CustomerTier.Standard);

        await context.Customers.AddRangeAsync(c1, c2, c3, c4);

        var d1 = new Deal("Implementación CRM Global y Clúster Privado", new Money(48500, "EUR"), c1.Id, DealStage.InNegotiation);
        var d2 = new Deal("Auditoría de Seguridad e Infraestructura de Nodos", new Money(18000, "EUR"), c2.Id, DealStage.Won);
        var d3 = new Deal("Despliegue E-Commerce Luxury High-Concurrency", new Money(32500, "EUR"), c3.Id, DealStage.ProposalSent);
        var d4 = new Deal("Consultoría UI/UX y Plataforma Exclusiva", new Money(9200, "EUR"), c4.Id, DealStage.Contacted);
        var d5 = new Deal("Soporte Anual VIP & Monitoreo 24/7", new Money(14000, "EUR"), c1.Id, DealStage.Lead);

        await context.Deals.AddRangeAsync(d1, d2, d3, d4, d5);
        await context.SaveChangesAsync();
    }
}
