namespace AirportTerminal;

public interface INotificationService
{
    void SendFlightCreatedNotification(Flight flight);
}