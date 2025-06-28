using Microsoft.EntityFrameworkCore;

namespace AirportTerminal;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public virtual  DbSet<Flight> Flights { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Flight>().HasData(
            new Flight
            {
                Id = 1,
                DepartureDateTime = new DateTime(2025, 4, 13, 12, 30, 0, DateTimeKind.Utc),
                ArrivalDateTime = new DateTime(2025, 4, 13, 14, 0, 0, DateTimeKind.Utc),
                DepartureAirport = "Москва (SVO)",
                DestinationAirport = "Санкт-Петербург (LED)",
                AircraftModel = "Boeing 737-800",
                Airline = "Аэрофлот",
                FlightNumber = "SU1234"
            },
            new Flight
            {
                Id = 2,
                DepartureDateTime = new DateTime(2025, 4, 11, 0, 15, 0, DateTimeKind.Utc),
                ArrivalDateTime = new DateTime(2025, 4, 13, 3, 50, 0, DateTimeKind.Utc),
                DepartureAirport = "Москва (SVO)",
                DestinationAirport = "Сочи (AER)",
                AircraftModel = "Airbus A320",
                Airline = "S7",
                FlightNumber = "S71234"
            }
        );
    }
}
