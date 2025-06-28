using System.ComponentModel.DataAnnotations;
using AirportTerminal;

namespace Tests;

[TestFixture]
public class FlightTests
{
    [Test]
    public void Flight_WithValidData_ShouldBeValid()
    {
        var flight = new Flight
        {
            DepartureDateTime = DateTime.Now.AddHours(1),
            ArrivalDateTime = DateTime.Now.AddHours(3),
            DepartureAirport = "Moscow",
            DestinationAirport = "Saint Petersburg",
            AircraftModel = "Boeing 737",
            Airline = "Aeroflot",
            FlightNumber = "SU1234"
        };
            
        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(flight);
        
        var isValid = Validator.TryValidateObject(flight, validationContext, validationResults, true);
        Assert.Multiple(() =>
        {
            Assert.That(isValid, Is.True);
            Assert.That(validationResults, Is.Empty);
        });
    }
}