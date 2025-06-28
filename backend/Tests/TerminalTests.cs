using AirportTerminal;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace Tests;

[TestFixture]
public class Tests
{
    private static Mock<DbSet<T>> CreateMockDbSet<T>(IQueryable<T> data) where T : class
    {
        var mockSet = new Mock<DbSet<T>>();
        mockSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(data.Provider);
        mockSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(data.Expression);
        mockSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(data.ElementType);
        mockSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());
        return mockSet;
    }

    [Test]
    public void GetAllFlights_ReturnsAllFlights()
    {
        var testFlights = new List<Flight>
        {
            new()
            {
                Id = 1,
                DepartureDateTime = DateTime.Now.AddHours(1),
                ArrivalDateTime = DateTime.Now.AddHours(3),
                DepartureAirport = "Moscow",
                DestinationAirport = "Saint Petersburg",
                AircraftModel = "Boeing 737",
                Airline = "Aeroflot",
                FlightNumber = "SU1234"
            },
            new()
            {
                Id = 2,
                DepartureDateTime = DateTime.Now.AddHours(2),
                ArrivalDateTime = DateTime.Now.AddHours(5),
                DepartureAirport = "Moscow",
                DestinationAirport = "Kazan",
                AircraftModel = "Airbus A320",
                Airline = "S7",
                FlightNumber = "S71234"
            }
        }.AsQueryable();

        var mockFlightsDbSet = CreateMockDbSet(testFlights);
            
        var mockContext = new Mock<ApplicationDbContext>(new DbContextOptions<ApplicationDbContext>());
        mockContext.Setup(c => c.Flights).Returns(mockFlightsDbSet.Object);
        
        var result = mockContext.Object.Flights.ToList();
        
        Assert.That(result, Has.Count.EqualTo(2));
        Assert.Multiple(() =>
        {
            Assert.That(result[0].DepartureAirport, Is.EqualTo("Moscow"));
            Assert.That(result[0].DestinationAirport, Is.EqualTo("Saint Petersburg"));
            Assert.That(result[1].DestinationAirport, Is.EqualTo("Kazan"));
        });
    }
    
    [Test]
    public void GetFlightById_ReturnsCorrectFlight()
    {
        var testFlight = new Flight
        {
            Id = 1,
            DepartureDateTime = DateTime.Now.AddHours(1),
            ArrivalDateTime = DateTime.Now.AddHours(3),
            DepartureAirport = "Moscow",
            DestinationAirport = "Saint Petersburg",
            AircraftModel = "Boeing 737",
            Airline = "Aeroflot",
            FlightNumber = "SU1234"
        };

        var mockContext = new Mock<ApplicationDbContext>(new DbContextOptions<ApplicationDbContext>());
        mockContext.Setup(c => c.Flights.Find(1)).Returns(testFlight);
        
        var result = mockContext.Object.Flights.Find(1);
        
        Assert.That(result, Is.Not.Null);
        Assert.Multiple(() =>
        {
            Assert.That(result.Id, Is.EqualTo(1));
            Assert.That(result.DepartureAirport, Is.EqualTo("Moscow"));
            Assert.That(result.DestinationAirport, Is.EqualTo("Saint Petersburg"));
        });
    }
}