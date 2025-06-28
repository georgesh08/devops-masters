import { useState } from 'react';
import { getFlightById } from '../services/flightService';

function FlightSearchPage() {
    const [flightId, setFlightId] = useState('');
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!flightId.trim()) {
            setError('Укажите ID вылета');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await getFlightById(flightId);
            setFlight(data);
        } catch (err) {
            setFlight(null);
            setError(`Не удалось найти вылет с ID ${flightId}`);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        return new Intl.DateTimeFormat('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="container">
            <h2 className="mb-4">Поиск вылета по ID</h2>

            <form onSubmit={handleSearch} className="mb-5">
                <label htmlFor="flightId" className="form-label">ID вылета</label>
                <div className="flex gap-2">
                    <input
                        id="flightId"
                        type="number"
                        value={flightId}
                        onChange={(e) => setFlightId(e.target.value)}
                        className={`form-control ${error ? 'is-invalid' : ''}`}
                        placeholder="Введите ID вылета"
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Поиск...' : 'Найти'}
                    </button>
                </div>
                {error && <div className="form-error mt-2">{error}</div>}
            </form>

            {flight && (
                <div className="card fade-in">
                    <h3 className="mb-4">Информация о вылете</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="form-label">ID</p>
                            <p>{flight.id}</p>
                        </div>
                        <div>
                            <p className="form-label">Номер рейса</p>
                            <p>{flight.flightNumber}</p>
                        </div>
                        <div>
                            <p className="form-label">Дата и время вылета</p>
                            <p>{formatDateTime(flight.departureDateTime)}</p>
                        </div>
                        <div>
                            <p className="form-label">Дата и время прибытия</p>
                            <p>{formatDateTime(flight.arrivalDateTime)}</p>
                        </div>
                        <div>
                            <p className="form-label">Аэропорт вылета</p>
                            <p>{flight.departureAirport}</p>
                        </div>
                        <div>
                            <p className="form-label">Аэропорт прибытия</p>
                            <p>{flight.destinationAirport}</p>
                        </div>
                        <div>
                            <p className="form-label">Модель самолета</p>
                            <p>{flight.aircraftModel}</p>
                        </div>
                        <div>
                            <p className="form-label">Авиакомпания</p>
                            <p>{flight.airline}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FlightSearchPage;