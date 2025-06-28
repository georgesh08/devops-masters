using System.ComponentModel.DataAnnotations;

namespace AirportTerminal;

public class Flight
{
    public int Id { get; set; }
    
    [Required]
    public DateTime DepartureDateTime { get; set; }
    
    [Required]
    public DateTime ArrivalDateTime { get; set; }
    
    [Required]
    [StringLength(100)]
    public string DepartureAirport { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string DestinationAirport { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string AircraftModel { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Airline { get; set; } = string.Empty;
    
    [Required]
    [StringLength(20)]
    public string FlightNumber { get; set; } = string.Empty;
}