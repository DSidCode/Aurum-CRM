using Aurum.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Aurum.Infrastructure.Data;

public class AurumDbContext : DbContext
{
    public AurumDbContext(DbContextOptions<AurumDbContext> options) : base(options) { }

    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Deal> Deals => Set<Deal>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuration Customer
        modelBuilder.Entity<Customer>(builder =>
        {
            builder.HasKey(c => c.Id);
            builder.Property(c => c.FullName).IsRequired().HasMaxLength(150);
            builder.Property(c => c.Email).IsRequired().HasMaxLength(150);
            builder.Property(c => c.Company).HasMaxLength(150);
            builder.Property(c => c.Phone).HasMaxLength(50);
            builder.HasMany(c => c.Deals)
                   .WithOne(d => d.Customer)
                   .HasForeignKey(d => d.CustomerId)
                   .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuration Deal & Money Value Object (Owned Entity)
        modelBuilder.Entity<Deal>(builder =>
        {
            builder.HasKey(d => d.Id);
            builder.Property(d => d.Title).IsRequired().HasMaxLength(200);
            builder.OwnsOne(d => d.Value);
        });
    }
}
