export interface FlightFormData {
    departureDateTime?: string;
    arrivalDateTime?: string;
    departureAirport?: string;
    destinationAirport?: string;
    aircraftModel?: string;
    airline?: string;
    flightNumber?: string;
}

export const validateFlightForm = (formData: FlightFormData): Record<string, string> => {
    const newErrors: Record<string, string> = {};

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

    return newErrors;
};
