namespace Aurum.Domain.Exceptions;

// Violación de una regla de negocio. La API la traduce a un 400 (ProblemDetails).
public class DomainException : Exception
{
    public DomainException(string message) : base(message) { }
}
