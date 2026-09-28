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

// 3. CORS para conexión transparente con el Frontend de React
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

// 4. Seeder de Datos de Prueba en memoria
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AurumDbContext>();
    await AurumDbSeeder.SeedSampleDataAsync(context);
}

// 5. Configurar Pipeline HTTP
if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Aurum CRM API v1 (Clean Architecture & CQRS)");
        c.RoutePrefix = string.Empty; // Swagger en la raíz
    });
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
