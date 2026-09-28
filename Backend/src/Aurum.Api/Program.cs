using Aurum.Api.Infrastructure;
using Aurum.Application;
using Aurum.Infrastructure;
using Aurum.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Agregar Servicios de Capas (Clean Architecture)
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices();

// 2. Controladores & Explorador de API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 3. Errores en formato estándar RFC 7807 (ProblemDetails)
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<DomainExceptionHandler>();

// 4. CORS para conexión transparente con el Frontend de React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// 5. Seeder de Datos de Prueba en memoria
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AurumDbContext>();
    await AurumDbSeeder.SeedSampleDataAsync(context);
}

// 6. Configurar Pipeline HTTP
app.UseExceptionHandler();

// Swagger se publica también fuera de Development: es una API de demostración
// y la documentación interactiva forma parte de lo que se quiere enseñar.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Aurum CRM API v1 (Clean Architecture & CQRS)");
    c.RoutePrefix = string.Empty; // Swagger en la raíz
});

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
