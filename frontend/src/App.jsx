import { useState } from 'react';
import FlightsPage from './components/FlightsPage';
import FlightSearchPage from './components/FlightSearchPage';
import './App.css';

function App() {
    const [currentPage, setCurrentPage] = useState('flights');

    return (
        <div className="container">
            <h1 className="text-center mb-6">Управление вылетами самолетов</h1>

            <div className="card mb-4">
                <div className="flex justify-between">
                    <div>
                        <button
                            className={`nav-button ${currentPage === 'flights' ? 'active' : ''}`}
                            onClick={() => setCurrentPage('flights')}
                        >
                            Список вылетов
                        </button>
                        <button
                            className={`nav-button ${currentPage === 'search' ? 'active' : ''}`}
                            onClick={() => setCurrentPage('search')}
                        >
                            Поиск по ID
                        </button>
                    </div>
                    <div className="text-right">
                        <span className="text-gray-500">Flight Management System</span>
                    </div>
                </div>
            </div>

            <div className="fade-in">
                {currentPage === 'flights' ? (
                    <FlightsPage />
                ) : (
                    <FlightSearchPage />
                )}
            </div>
        </div>
    );
}

export default App;