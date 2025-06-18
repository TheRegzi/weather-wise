'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTemperatureHigh,
  faUmbrella,
  faSnowflake,
  faWind,
} from '@fortawesome/free-solid-svg-icons';

async function fetchWeatherData(latitude, longitude) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m,rain,snowfall,weathercode`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return null;
  }
}

export default function SinglePlaceWeather() {
  const params = useParams() as { lat: string; lon: string };
  const searchParams = useSearchParams();
  const lat = params.lat;
  const lon = params.lon;
  const name = searchParams.get('name');

  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (lat && lon) {
      fetchWeatherData(lat, lon).then((data) => setWeatherData(data));
    }
  }, [lat, lon]);

  if (!weatherData) {
    return <div>Loading weather data...</div>;
  }

  console.log('Weather data:', weatherData);

  const hourlyData = weatherData.hourly || {};
  const currentTime = new Date().toISOString();
  const currentHourString = currentTime.slice(0, 13) + ':00';
  const timeIndex = hourlyData.time.findIndex((time) => time === currentHourString);

  const currentTemperature =
    timeIndex !== -1 && hourlyData.temperature_2m ? hourlyData.temperature_2m[timeIndex] : 'N/A';

  const windSpeed =
    timeIndex !== -1 && hourlyData.wind_speed_10m ? hourlyData.wind_speed_10m[timeIndex] : 'N/A';

  const rain = timeIndex !== -1 && hourlyData.rain ? hourlyData.rain[timeIndex] : 'N/A';

  const snowfall = timeIndex !== -1 && hourlyData.snowfall ? hourlyData.snowfall[timeIndex] : 'N/A';

  return (
    <div className="p-8 flex flex-col mx-auto w-[1000px]">
      <h1 className="text-3xl font-bold mb-4">Weather for {name ? name : `${lat}, ${lon}`}</h1>
      <div className="flex flex-row gap-4 justify-between">
        <h2>The weather now</h2>
        <p className="text-3xl font-semibold">
          <FontAwesomeIcon className="text-3xl" icon={faTemperatureHigh} />
          {currentTemperature}°C
        </p>
        {snowfall ? (
          <p>
            <FontAwesomeIcon className="text-3xl" icon={faSnowflake} /> {snowfall} mm
          </p>
        ) : (
          <p>
            <FontAwesomeIcon className="text-3xl" icon={faUmbrella} /> {rain} mm
          </p>
        )}
        <p>
          <FontAwesomeIcon className="text-3xl" icon={faWind} />
          {windSpeed} m/s
        </p>
      </div>
    </div>
  );
}
