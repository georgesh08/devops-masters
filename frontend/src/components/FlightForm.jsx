import { useState, useEffect } from 'react';

function FlightForm({ initialData, onSubmit, onCancel }) {
    const emptyForm = {
        departureDateTime: '',
        arrivalDateTime: '',
        departureAirport: '',
        destinationAirport: '',
        aircraftModel: '',
        airline: '',
        flightNumber: ''
    };

    const [formData, setFormData] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            const formatDateTime = (dateTimeString) => {
                if (!dateTimeString) return '';
                const date = new Date(dateTimeString);
                return date.toISOString().slice(0, 16);
            };

            setFormData({
                ...initialData,
                departureDateTime: formatDateTime(initialData.departureDateTime),
                arrivalDateTime: formatDateTime(initialData.arrivalDateTime)
            });
        } else {
            setFormData(emptyForm);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.departureDateTime) {
            newErrors.departureDateTime = 'Укажите дату и время вылета';
        }

        if (!formData.arrivalDateTime) {
            newErrors.arrivalDateTime = 'Укажите дату и время прибытия';
        } else if (formData.departureDateTime && new Date(formData.arrivalDateTime) <= new Date(formData.departureDateTime)) {
            newErrors.arrivalDateTime = 'Время прибытия должно быть позже времени вылета';
        }

        if (!formData.departureAirport) {
            newErrors.departureAirport = 'Укажите аэропорт вылета';
        }

        if (!formData.destinationAirport) {
            newErrors.destinationAirport = 'Укажите аэропорт прибытия';
        } else if (formData.departureAirport && formData.departureAirport === formData.destinationAirport) {
            newErrors.destinationAirport = 'Аэропорты вылета и прибытия не могут совпадать';
        }

        if (!formData.aircraftModel) {
            newErrors.aircraftModel = 'Укажите модель самолета';
        }

        if (!formData.airline) {
            newErrors.airline = 'Укажите авиакомпанию';
        }

        if (!formData.flightNumber) {
            newErrors.flightNumber = 'Укажите номер рейса';
        } else if (!/^[A-Z0-9]{2,8}$/.test(formData.flightNumber)) {
            newErrors.flightNumber = 'Номер рейса должен состоять из 2-8 букв и цифр';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            setIsSubmitting(true);
            try {
                const submitData = {
                    ...formData,
                    departureDateTime: new Date(formData.departureDateTime).toISOString(),
                    arrivalDateTime: new Date(formData.arrivalDateTime).toISOString()
                };

                await onSubmit(submitData);

                if (!initialData) {
                    setFormData(emptyForm);
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="form-label">Дата и время вылета</label>
                    <input
                        type="datetime-local"
                        name="departureDateTime"
                        value={formData.departureDateTime}
                        onChange={handleChange}
                        className={`form-control ${errors.departureDateTime ? 'is-invalid' : ''}`}
                    />
                    {errors.departureDateTime && <p className="form-error">{errors.departureDateTime}</p>}
                </div>

                <div>
                    <label className="form-label">Дата и время прибытия</label>
                    <input
                        type="datetime-local"
                        name="arrivalDateTime"
                        value={formData.arrivalDateTime}
                        onChange={handleChange}
                        className={`form-control ${errors.arrivalDateTime ? 'is-invalid' : ''}`}
                    />
                    {errors.arrivalDateTime && <p className="form-error">{errors.arrivalDateTime}</p>}
                </div>

                <div>
                    <label className="form-label">Аэропорт вылета</label>
                    <input
                        type="text"
                        name="departureAirport"
                        value={formData.departureAirport}
                        onChange={handleChange}
                        className={`form-control ${errors.departureAirport ? 'is-invalid' : ''}`}
                        placeholder="Например: SVO, DME"
                    />
                    {errors.departureAirport && <p className="form-error">{errors.departureAirport}</p>}
                </div>

                <div>
                    <label className="form-label">Аэропорт прибытия</label>
                    <input
                        type="text"
                        name="destinationAirport"
                        value={formData.destinationAirport}
                        onChange={handleChange}
                        className={`form-control ${errors.destinationAirport ? 'is-invalid' : ''}`}
                        placeholder="Например: LED, KZN"
                    />
                    {errors.destinationAirport && <p className="form-error">{errors.destinationAirport}</p>}
                </div>

                <div>
                    <label className="form-label">Модель самолета</label>
                    <input
                        type="text"
                        name="aircraftModel"
                        value={formData.aircraftModel}
                        onChange={handleChange}
                        className={`form-control ${errors.aircraftModel ? 'is-invalid' : ''}`}
                        placeholder="Например: Boeing 737, Airbus A320"
                    />
                    {errors.aircraftModel && <p className="form-error">{errors.aircraftModel}</p>}
                </div>

                <div>
                    <label className="form-label">Авиакомпания</label>
                    <input
                        type="text"
                        name="airline"
                        value={formData.airline}
                        onChange={handleChange}
                        className={`form-control ${errors.airline ? 'is-invalid' : ''}`}
                        placeholder="Например: Аэрофлот, S7"
                    />
                    {errors.airline && <p className="form-error">{errors.airline}</p>}
                </div>

                <div>
                    <label className="form-label">Номер рейса</label>
                    <input
                        type="text"
                        name="flightNumber"
                        value={formData.flightNumber}
                        onChange={handleChange}
                        className={`form-control ${errors.flightNumber ? 'is-invalid' : ''}`}
                        placeholder="Например: SU1234"
                    />
                    {errors.flightNumber && <p className="form-error">{errors.flightNumber}</p>}
                </div>
            </div>

            <div className="mt-4 flex">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner mr-2"></span>
                            {initialData ? 'Сохранение...' : 'Добавление...'}
                        </>
                    ) : (
                        initialData ? 'Сохранить изменения' : 'Добавить вылет'
                    )}
                </button>

                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-secondary ml-2"
                        disabled={isSubmitting}
                    >
                        Отменить
                    </button>
                )}
            </div>
        </form>
    );
}

export default FlightForm;