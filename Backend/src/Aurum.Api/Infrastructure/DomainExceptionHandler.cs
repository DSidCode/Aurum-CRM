using Aurum.Domain.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Aurum.Api.Infrastructure;

// Traduce las excepciones conocidas a respuestas RFC 7807 (ProblemDetails).
// Cualquier otra excepción la gestiona el handler por defecto como 500.
public class DomainExceptionHandler : IExceptionHandler
{
    private readonly IProblemDetailsService _problemDetailsService;

    public DomainExceptionHandler(IProblemDetailsService problemDetailsService)
    {
        _problemDetailsService = problemDetailsService;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var (status, title) = exception switch
        {
            DomainException => (StatusCodes.Status400BadRequest, "Regla de negocio incumplida"),
            KeyNotFoundException => (StatusCodes.Status404NotFound, "Recurso no encontrado"),
            _ => (0, string.Empty)
        };

        if (status == 0)
            return false;

        httpContext.Response.StatusCode = status;
        return await _problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = new ProblemDetails
            {
                Status = status,
                Title = title,
                Detail = exception.Message
            }
        });
    }
}
