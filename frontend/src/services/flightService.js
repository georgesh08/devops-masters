let API_HOST, API_PORT, API_URL;

const initConfig = async () => {
    try {
        const response = await fetch('/frontend_config.json');
        const config = await response.json();

        API_HOST = config.API_HOST;
        API_PORT = config.API_PORT;
        API_URL = `http://${API_HOST}:${API_PORT}`;
        console.log(`API URL: ${API_URL}`);

    } catch (error) {
        console.error('Error:', error);
        // Fallback значения
        API_HOST = 'localhost';
        API_PORT = '5126';
        API_URL = `http://${API_HOST}:${API_PORT}`;
    }
};

const configPromise = initConfig();

const fetchWithErrorHandling = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            console.error('Не удалось подключиться к серверу API. Проверьте, запущен ли сервер и доступен ли URL:', url);
            throw new Error('Сервер недоступен. Пожалуйста, проверьте соединение и убедитесь, что API запущен.');
        }

        console.error('Ошибка API:', error);
        throw error;
    }
};

export const getAllFlights = async () => {
    await configPromise; // ждем инициализации
    return fetchWithErrorHandling(`${API_URL}/flights`);
};

export const getFlightById = async (id) => {
    await configPromise;
    return fetchWithErrorHandling(`${API_URL}/flights/${id}`);
};

export const createFlight = async (flightData) => {
    await configPromise;
    return fetchWithErrorHandling(`${API_URL}/flights`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(flightData),
    });
};

export const updateFlight = async (id, flightData) => {
    await configPromise;
    return fetchWithErrorHandling(`${API_URL}/flights/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(flightData),
    });
};

export const deleteFlight = async (id) => {
    await configPromise;
    await fetchWithErrorHandling(`${API_URL}/flights/${id}`, {
        method: 'DELETE',
    });
    return true;
};