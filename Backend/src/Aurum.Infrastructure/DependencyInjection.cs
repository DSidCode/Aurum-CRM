using Aurum.Application.Common.Interfaces;
using Aurum.Infrastructure.Data;
using Aurum.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Aurum.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        services.AddDbContext<AurumDbContext>(options =>
            options.UseInMemoryDatabase("AurumCrmDb"));

        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IDealRepository, DealRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}
