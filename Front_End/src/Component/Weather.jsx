import React, { useEffect, useState, useCallback } from 'react'; 
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Weather = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [unit, setUnit] = useState('metric');
    const [notation, setNotation] = useState('C');
    const [avgTemp, setAvgTemp] = useState(0);
    const [dominantCondition, setDominantCondition] = useState('');
    const [alert, setAlert] = useState([]);
    const [previousTemp, setPreviousTemp] = useState({});
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [temperatureData, setTemperatureData] = useState([]);
    const [labels, setLabels] = useState([]);

    const checkForAlert = useCallback((data) => {
        const newAlert = [];
        const updatedTemps = { ...previousTemp };

        data.forEach(city => {
            const cityName = city.city;  
            const currentTemp = city.max_temp;

            if (updatedTemps[cityName]) {
                if (updatedTemps[cityName].previousTemp >= 35 && currentTemp >= 35) {
                    newAlert.push(`${cityName} has been above 35°C for two consecutive updates!`);
                }
            }
            updatedTemps[cityName] = { previousTemp: currentTemp };
        });

        setPreviousTemp(updatedTemps);
        setAlert(newAlert);
    }, [previousTemp]);  

    const fetchWeather = useCallback(async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/weather');
            const data = response.data;
            setWeatherData(data);
            calculateStats(data);
            checkForAlert(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }, [checkForAlert]); 

    const calculateStats = (data) => {
        const total_Temp = data.reduce((sum, city) => sum + city.max_temp, 0);
        const avg_Temp = total_Temp / data.length;
        setAvgTemp(avg_Temp);

        const ConditionCounts = data.reduce((counts, city) => {
            const condition = city.condition;  
            if (condition) {
                counts[condition] = (counts[condition] || 0) + 1;
            }
            return counts;
        }, {});

        const dominant = Object.keys(ConditionCounts).reduce((a, b) => 
            ConditionCounts[a] > ConditionCounts[b] ? a : b, " "
        );

        setDominantCondition(dominant || "No Dominant Condition Found!");

        const temps = data.map(city => {
            return {
                city: city.city,
                max_temp: unit === 'metric' ? city.max_temp : (city.max_temp * 9/5) + 32,
            };
        });

        setTemperatureData(temps);
        setLabels(temps.map(item => item.city));
    };

    const getBarChartData = () => {
        return {
            labels: labels,
            datasets: [{
                label: `Max Temperature (${notation})`,
                data: temperatureData.map(item => item.max_temp),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }]
        };
    };

    const getLineChartData = () => {
        return {
            labels: labels,
            datasets: [{
                label: `Max Temperature (${notation})`,
                data: temperatureData.map(item => item.max_temp),
                fill: false,
                backgroundColor: 'rgba(153, 102, 255, 1)',
                borderColor: 'rgba(153, 102, 255, 1)',
                tension: 0.1,
            }]
        };
    };

    useEffect(() => {
        fetchWeather();
        const interval = setInterval(() => {
            fetchWeather(); 
        }, 300000);
        return () => clearInterval(interval); 
    }, [fetchWeather]); 

    const getCityBackground = (city) => {
        switch (city) {
            case 'Hyderabad':
                return 'bg-hyderabad bg-cover bg-center';
            case 'Chennai':
                return 'bg-chennai bg-cover bg-center';
            case 'Mumbai':
                return 'bg-mumbai bg-cover bg-center';
            case 'Delhi':
                return 'bg-delhi bg-cover bg-center';
            case 'Bangalore':
                return 'bg-bangalore bg-cover bg-center';
            case 'Kolkata':
                return 'bg-kolkata bg-cover bg-center';
            default:
                return 'bg-default bg-cover bg-center';
        }
    }

    return (
        <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-violet-800 via-blue-900 to-purple-600 text-white'}`}>
            <h1 className="text-5xl font-extrabold text-center mb-8 drop-shadow-lg">Weather Conditions</h1>
            <button 
                onClick={() => setIsDarkMode(prev => !prev)}
                className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-400 transition"
            >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <div className='flex justify-center mb-8'>
                <label className={`p-4 border rounded-lg shadow-lg cursor-pointer transition-transform duration-300 ${unit === 'metric' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}>
                    <input
                        type="radio"
                        value="metric"
                        checked={unit === 'metric'}
                        onChange={() => {setUnit('metric'); setNotation("C")}}
                        className='hidden'
                    />
                    <span className='text-lg font-semibold'>Celsius</span>
                </label>
                <label className={`ml-6 p-4 border rounded-lg shadow-lg cursor-pointer transition-transform duration-300 ${unit === 'imperial' ? 'bg-red-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}>
                    <input
                        type="radio"
                        value="imperial"
                        checked={unit === 'imperial'}
                        onChange={() => {setUnit('imperial'); setNotation("F");}}
                        className='hidden'
                    />
                    <span className='text-lg font-semibold'>Fahrenheit</span>
                </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                {weatherData.map((data, index) => {
                    const maxTemp = unit === 'metric' ? data.max_temp : (data.max_temp * 9/5) + 32;
                    const minTemp = unit === 'metric' ? data.min_temp : (data.min_temp * 9/5) + 32;
                    const feelsLike = unit === 'metric' ? data.feels_like : (data.feels_like * 9/5) + 32;
                    const currentTemp = unit === 'metric' ? data.current_temp : (data.current_temp * 9/5) + 32;

                    return (
                        <div key={index} className={`p-6 rounded-lg shadow-xl transition-shadow duration-300 ease-in-out hover:shadow-2xl hover:bg-gray-800 cursor-pointer ${getCityBackground(data.city)}`}>
                            <h2 className="text-3xl font-semibold text-center mb-4" style={{ textShadow: '1px 1px 3px rgba(255, 255, 255, 0.2)' }}>{data.city}</h2>
                            <p className="text-xl text-white font-semibold mb-1" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.9)' }}>Date & Time: {new Date().toLocaleString()}</p>
                            <p className="text-6xl text-white font-bold absolute bottom-12 right-4 p-2">{currentTemp.toFixed(0)}°{notation}</p>
                            <p className="text-xl text-white font-semibold mb-1" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.9)' }}>Condition: {data.condition}</p>
                            <p className="text-xl text-white font-semibold mb-1" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.9)' }}>Max Temp: {maxTemp.toFixed(2)}°{notation}</p>
                            <p className="text-xl text-white font-semibold mb-1" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.9)' }}>Min Temp: {minTemp.toFixed(2)}°{notation}</p>
                            <p className="text-xl text-white font-semibold mb-1" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.9)' }}>Feels Like: {feelsLike.toFixed(2)}°{notation}</p>
                            <p className="text-xl text-white font-semibold mb-1" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.9)' }}>Humidity: {data.humidity} %</p>
                            <p className="text-xl text-white font-semibold mb-1" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.9)' }}>Wind Speed: {data.wind_speed} Km/H</p>
                        </div>
                    );
                })}
            </div>
            <div className="mt-12">
                <h1 className="text-3xl font-bold mb-4">Statistics</h1>
                <p className="text-lg font-semibold">Average Temperature: {avgTemp.toFixed(2)}°{notation}</p>
                <p className="text-lg font-semibold">Dominant Weather Condition: {dominantCondition}</p>
            </div>
            <div className="mt-12">
                <h2 className="text-3xl font-bold mb-4">Temperature Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <Bar data={getBarChartData()} options={{ responsive: true }} />
                    </div>
                    <div>
                        <Line data={getLineChartData()} options={{ responsive: true }} />
                    </div>
                </div>
            </div>
            <div className="mt-12">
                <h2 className="text-3xl font-bold mb-4">Triggered Alerts</h2>
                {alert.length > 0 ? (
                    alert.map((a, index) => <p key={index} className="text-red-800 text-lg">{a}</p>)
                ) : (
                    <p className="font-bold text-lg">No alerts triggered.</p>
                )}
            </div>
        </div>
    );
};

export default Weather;