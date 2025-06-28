import { useState, useEffect } from 'react';
import { getAllFlights, createFlight, updateFlight, deleteFlight } from '../services/flightService';
import FlightForm from './FlightForm';
import FlightsList from './FlightsList';

function FlightsPage() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingFlight, setEditingFlight] = useState(null);

    useEffect(() => {
        loadFlights();
    }, []);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const loadFlights = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllFlights();
            setFlights(data);
        } catch (err) {
            console.error('Ошибка при загрузке вылетов:', err);
            setError(err.message || 'Не удалось загрузить данные о вылетах');
            setFlights([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (flightData) => {
        try {
            setError(null);
            await createFlight(flightData);
            await loadFlights();
            setSuccess('Вылет успешно добавлен');
        } catch (err) {
            console.error('Ошибка при создании вылета:', err);
            setError(err.message || 'Не удалось создать вылет');
        }
    };

    const handleUpdate = async (id, flightData) => {
        try {
            setError(null);
            await updateFlight(id, flightData);
            setEditingFlight(null);
            await loadFlights();
            setSuccess('Вылет успешно обновлен');
        } catch (err) {
            console.error('Ошибка при обновлении вылета:', err);
            setError(err.message || 'Не удалось обновить вылет');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот вылет?')) {
            try {
                setError(null);
                await deleteFlight(id);
                await loadFlights();
                setSuccess('Вылет успешно удален');
            } catch (err) {
                console.error('Ошибка при удалении вылета:', err);
                setError(err.message || 'Не удалось удалить вылет');
            }
        }
    };

    const handleEdit = (flight) => {
        setEditingFlight(flight);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingFlight(null);
    };

    const handleRetry = () => {
        loadFlights();
    };

    return (
        <div>
            <div className="card">
                <h2 className="mb-4">
                    {editingFlight ? 'Редактировать вылет' : 'Добавить новый вылет'}
                </h2>

                {error && (
                    <div className="alert alert-danger">
                        <p>{error}</p>
                        <button
                            onClick={handleRetry}
                            className="btn btn-sm btn-danger mt-2"
                        >
                            Повторить загрузку
                        </button>
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                <FlightForm
                    initialData={editingFlight}
                    onSubmit={editingFlight ?
                        (data) => handleUpdate(editingFlight.id, data) :
                        handleCreate
                    }
                    onCancel={editingFlight ? handleCancelEdit : null}
                />
            </div>

            <div className="card mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="mb-0">Список вылетов</h2>
                    <button
                        onClick={loadFlights}
                        className="btn btn-sm btn-secondary"
                        title="Обновить список"
                    >
                        🔄 Обновить
                    </button>
                </div>

                {loading ? (
                    <div className="text-center p-4">
                        <div className="spinner"></div>
                        <p className="mt-2">Загрузка данных...</p>
                    </div>
                ) : (
                    <FlightsList
                        flights={flights}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
}

export default FlightsPage;