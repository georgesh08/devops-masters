import { render, screen, fireEvent } from '@testing-library/react';
import FlightSearchPage from '../src/components/FlightSearchPage.jsx';
import { getFlightById } from '../src/services/flightService';


vi.mock('../src/services/flightService', () => ({
    getFlightById: vi.fn(),
}));

describe('FlightSearchPage', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('показывает ошибку, если ID не введен', async () => {
        render(<FlightSearchPage />);

        const searchButton = screen.getByRole('button', { name: /найти/i });
        fireEvent.click(searchButton);

        expect(await screen.findByText(/укажите id вылета/i)).toBeInTheDocument();
    });

    it('отображает найденный рейс при успешном поиске', async () => {
        getFlightById.mockResolvedValue({
            id: 1,
            flightNumber: 'SU101',
            departureDateTime: '2025-04-28T08:00:00Z',
            arrivalDateTime: '2025-04-28T11:00:00Z',
            departureAirport: 'DME',
            destinationAirport: 'SVO',
            aircraftModel: 'Boeing 737',
            airline: 'Aeroflot',
        });

        render(<FlightSearchPage />);

        fireEvent.change(screen.getByLabelText(/id вылета/i), {
            target: { value: '1' },
        });

        fireEvent.click(screen.getByRole('button', { name: /найти/i }));

        expect(await screen.findByText(/информация о вылете/i)).toBeInTheDocument();
        expect(screen.getByText(/su101/i)).toBeInTheDocument();
        expect(screen.getByText(/dme/i)).toBeInTheDocument();
        expect(screen.getByText(/svo/i)).toBeInTheDocument();
        expect(screen.getByText(/boeing 737/i)).toBeInTheDocument();
    });

    it('показывает сообщение об ошибке, если рейс не найден', async () => {
        getFlightById.mockRejectedValue(new Error('Not Found'));

        render(<FlightSearchPage />);

        fireEvent.change(screen.getByLabelText(/id вылета/i), {
            target: { value: '12345' },
        });

        fireEvent.click(screen.getByRole('button', { name: /найти/i }));

        expect(await screen.findByText(/не удалось найти вылет с id 12345/i)).toBeInTheDocument();
    });
});
