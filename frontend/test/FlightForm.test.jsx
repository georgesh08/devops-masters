import { describe, it, expect } from 'vitest';
import { validateFlightForm, FlightFormData } from '../src/flightFrom.js';

const validData = {
    departureDateTime: '2025-07-01T12:00',
    arrivalDateTime: '2025-07-01T15:00',
    departureAirport: 'SVO',
    destinationAirport: 'JFK',
    aircraftModel: 'Boeing 737',
    airline: 'Aeroflot',
    flightNumber: 'SU100'
};

describe('validateFlightForm', () => {
    it('should return no errors for valid data', () => {
        const errors = validateFlightForm(validData);
        expect(errors).toEqual({});
    });

    it('should return error if departureDateTime is missing', () => {
        const errors = validateFlightForm({ ...validData, departureDateTime: undefined });
        expect(errors).toHaveProperty('departureDateTime');
    });

    it('should return error if arrivalDateTime is missing', () => {
        const errors = validateFlightForm({ ...validData, arrivalDateTime: undefined });
        expect(errors).toHaveProperty('arrivalDateTime');
    });

    it('should return error if arrival is before departure', () => {
        const errors = validateFlightForm({
            ...validData,
            arrivalDateTime: '2025-07-01T10:00',
        });
        expect(errors).toHaveProperty('arrivalDateTime');
    });

    it('should return error if departureAirport is missing', () => {
        const errors = validateFlightForm({ ...validData, departureAirport: '' });
        expect(errors).toHaveProperty('departureAirport');
    });

    it('should return error if destinationAirport is missing', () => {
        const errors = validateFlightForm({ ...validData, destinationAirport: '' });
        expect(errors).toHaveProperty('destinationAirport');
    });

    it('should return error if departure and destination airports are the same', () => {
        const errors = validateFlightForm({
            ...validData,
            departureAirport: 'SVO',
            destinationAirport: 'SVO',
        });
        expect(errors).toHaveProperty('destinationAirport');
    });

    it('should return error if aircraftModel is missing', () => {
        const errors = validateFlightForm({ ...validData, aircraftModel: '' });
        expect(errors).toHaveProperty('aircraftModel');
    });

    it('should return error if airline is missing', () => {
        const errors = validateFlightForm({ ...validData, airline: '' });
        expect(errors).toHaveProperty('airline');
    });

    it('should return error if flightNumber is missing', () => {
        const errors = validateFlightForm({ ...validData, flightNumber: '' });
        expect(errors).toHaveProperty('flightNumber');
    });

    it('should return error if flightNumber is invalid', () => {
        const errors = validateFlightForm({ ...validData, flightNumber: 'A*' });
        expect(errors).toHaveProperty('flightNumber');
    });
});
