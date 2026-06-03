import React, { useState } from 'react';
import { DateRange } from '../types';
import { SatelliteIcon } from './icons';

interface GeeControlPanelProps {
    onFetch: (dateRange: DateRange) => void;
}

// Function to get today's date in YYYY-MM-DD format
const getToday = () => new Date().toISOString().split('T')[0];

// Function to get date one year ago in YYYY-MM-DD format
const getOneYearAgo = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().split('T')[0];
};

export const GeeControlPanel: React.FC<GeeControlPanelProps> = ({ onFetch }) => {
    const [dateRange, setDateRange] = useState<DateRange>({
        start: getOneYearAgo(),
        end: getToday(),
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (new Date(dateRange.start) > new Date(dateRange.end)) {
            setError("Start date cannot be after end date.");
            return;
        }
        setError(null);
        onFetch(dateRange);
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-200 mb-2 flex items-center gap-3">
                <SatelliteIcon />
                Google Earth Engine
            </h2>
            <p className="text-sm text-gray-400 mb-6">
                Pan the map to your area of interest, select a date range, and fetch the latest satellite imagery.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="start-date" className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                        <input
                            type="date"
                            id="start-date"
                            name="start"
                            value={dateRange.start}
                            onChange={handleInputChange}
                            max={getToday()}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                        <input
                            type="date"
                            id="end-date"
                            name="end"
                            value={dateRange.end}
                            onChange={handleInputChange}
                            max={getToday()}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            required
                        />
                    </div>
                </div>
                 {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 transition-all duration-300 transform hover:scale-105"
                >
                    Fetch Imagery
                </button>
            </form>
        </div>
    );
};