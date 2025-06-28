function FlightsList({ flights, onEdit, onDelete }) {
    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const calculateDuration = (departure, arrival) => {
        const departureDate = new Date(departure);
        const arrivalDate = new Date(arrival);
        const diff = arrivalDate - departureDate;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}ч ${minutes}м`;
    };

    return (
        <div className="overflow-x-auto">
            {flights.length === 0 ? (
                <div className="text-center p-4 text-gray-500">
                    <p>Нет данных о вылетах</p>
                    <p className="text-sm mt-2">Добавьте новый вылет, используя форму выше</p>
                </div>
            ) : (
                <table className="table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Рейс</th>
                        <th>Маршрут</th>
                        <th>Вылет</th>
                        <th>Прибытие</th>
                        <th>Длительность</th>
                        <th>Самолет</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {flights.map((flight) => (
                        <tr key={flight.id}>
                            <td>{flight.id}</td>
                            <td>
                                <strong>{flight.flightNumber}</strong>
                                <div className="text-sm text-gray-500">{flight.airline}</div>
                            </td>
                            <td>{flight.departureAirport} → {flight.destinationAirport}</td>
                            <td>{formatDateTime(flight.departureDateTime)}</td>
                            <td>{formatDateTime(flight.arrivalDateTime)}</td>
                            <td>{calculateDuration(flight.departureDateTime, flight.arrivalDateTime)}</td>
                            <td>{flight.aircraftModel}</td>
                            <td>
                                <button
                                    onClick={() => onEdit(flight)}
                                    className="btn btn-sm btn-warning mr-1"
                                    title="Изменить"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => onDelete(flight.id)}
                                    className="btn btn-sm btn-danger"
                                    title="Удалить"
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default FlightsList;