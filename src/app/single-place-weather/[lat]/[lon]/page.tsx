'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faTemperatureHigh,
  faUmbrella,
  faSnowflake,
  faWind,
} from '@fortawesome/free-solid-svg-icons';
import { weatherCodeMap } from '@/utils/weatherCodeMap';
import Image from 'next/image';

async function fetchWeatherData(latitude, longitude) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m,weathercode,rain,snowfall&forecast_days=10&timezone=auto&windspeed_unit=ms`;
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

function getPeriod(hour) {
  if (hour >= 0 && hour < 6) return 'night';
  if (hour >= 6 && hour < 18) return 'day';
  return 'evening';
}

function build10DayPeriods(hourly) {
  const result = [];
  const byDate = {};

  for (let i = 0; i < hourly.time.length; i++) {
    const dateTime = new Date(hourly.time[i]);
    const dateStr = dateTime.toISOString().slice(0, 10);
    const hour = dateTime.getHours();
    const period = getPeriod(hour);

    if (!byDate[dateStr]) {
      byDate[dateStr] = { night: [], day: [], evening: [] };
    }
    byDate[dateStr][period].push({
      temp: hourly.temperature_2m[i],
      wind: hourly.wind_speed_10m[i],
      weathercode: hourly.weathercode[i],
      rain: hourly.rain[i],
      snowfall: hourly.snowfall[i],
    });
  }

  for (const date of Object.keys(byDate).slice(0, 10)) {
    const weekday = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const dayObj = { date, weekday };

    for (const period of ['night', 'day', 'evening']) {
      const arr = byDate[date][period];
      dayObj[period] = arr.length
        ? {
            degrees: Math.round(arr.reduce((sum, a) => sum + a.temp, 0) / arr.length),
            windSpeed: Math.round(arr.reduce((sum, a) => sum + a.wind, 0) / arr.length),
            weathercode: arr[0]?.weathercode,
            rain: Math.round((arr.reduce((sum, a) => sum + a.rain, 0) / arr.length) * 10) / 10,
            snowfall:
              Math.round((arr.reduce((sum, a) => sum + a.snowfall, 0) / arr.length) * 10) / 10,
          }
        : null;
    }
    const allTemps = [].concat(...Object.values(byDate[date]).map((arr) => arr.map((x) => x.temp)));
    dayObj.tempMin = Math.min(...allTemps).toFixed(1);
    dayObj.tempMax = Math.max(...allTemps).toFixed(1);

    result.push(dayObj);
  }
  return result;
}

export default function SinglePlaceWeather() {
  const params = useParams() as { lat: string; lon: string };
  const searchParams = useSearchParams();
  const lat = params.lat;
  const lon = params.lon;
  const name = searchParams.get('name');

  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    if (lat && lon) {
      fetchWeatherData(lat, lon).then((data) => {
        setWeatherData(data);
        if (data?.hourly) {
          setForecast(build10DayPeriods(data.hourly));
        }
      });
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
      <h1 className="text-4xl font-inter font-bold mb-4 text-shadow mt-10">
        <FontAwesomeIcon icon={faLocationDot} className="text-footer w-5 h-5 mr-2" />
        {name ? name : `${lat}, ${lon}`}
      </h1>
      <div className="flex flex-row gap-4 justify-between items-center mt-4">
        <h2 className="font-display font-semibold text-lg text-shadow">The weather now</h2>
        <p className="text-3xl font-semibold text-shadow">
          <FontAwesomeIcon className="text-3xl" icon={faTemperatureHigh} /> {currentTemperature}°C
        </p>
        {snowfall ? (
          <p className="text-xl font-semibold text-shadow">
            <FontAwesomeIcon className="text-3xl" icon={faSnowflake} /> {snowfall} mm
          </p>
        ) : (
          <p className="text-xl font-semibold text-shadow">
            <FontAwesomeIcon className="text-3xl" icon={faUmbrella} /> {rain} mm
          </p>
        )}
        <p className="text-xl font-semibold text-shadow">
          <FontAwesomeIcon className="text-3xl" icon={faWind} /> {windSpeed} m/s
        </p>
      </div>
      <div className="flex flex-row pb-2 gap-8 items-center font-bold text-sm mt-8">
        <div className="w-48" />
        <div className="flex flex-row gap-12 flex-1 justify-end pr-7">
          {['night', 'day', 'evening'].map((per) => (
            <div key={per} className="flex flex-col items-center">
              <div className="text-lg font-roboto font-normal capitalize text-search text-shadow">
                {per}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4 bg-background-secondary p-7">
        {forecast.map((day, i) => (
          <div key={day.date} className="flex flex-row border-b pb-2 gap-8 items-center">
            {/* LEFT: Date and numbers */}
            <div className="w-48">
              <div className="font-bold">{i === 0 ? 'Today' : day.weekday}</div>
              <div className="text-sm text-gray-500">{day.date}</div>
              <div className="mt-2">
                <div>
                  {' '}
                  {day.tempMax}°C / {day.tempMin}°C
                </div>
                <div>
                  {(() => {
                    const winds = [
                      day.night?.windSpeed,
                      day.day?.windSpeed,
                      day.evening?.windSpeed,
                    ].filter(Boolean);
                    const avg = Math.round(winds.reduce((sum, n) => sum + n, 0) / winds.length);
                    return `${avg} m/s`;
                  })()}
                </div>
                <div>
                  {snowfall ? (
                    <div>
                      {(() => {
                        const snows = [
                          day.night?.snowfall,
                          day.day?.snowfall,
                          day.evening?.snowfall,
                        ].filter((x) => x !== undefined && x !== null);
                        const totalSnow = Math.round(snows.reduce((sum, n) => sum + n, 0));
                        return (
                          <div>
                            <FontAwesomeIcon icon={faSnowflake} className="" /> {totalSnow} mm
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div>
                      {' '}
                      {(() => {
                        const rains = [day.night?.rain, day.day?.rain, day.evening?.rain].filter(
                          (x) => x !== undefined && x !== null,
                        );
                        const totalRain = Math.round(rains.reduce((sum, n) => sum + n, 0));
                        return (
                          <div>
                            <FontAwesomeIcon icon={faUmbrella} className="" /> {totalRain} mm
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* RIGHT: Weather icons for night, day, evening */}
            <div className="flex flex-row gap-10 flex-1 justify-end">
              {['night', 'day', 'evening'].map((per) =>
                day[per] ? (
                  <div key={per} className="flex flex-col items-center">
                    <Image
                      src={weatherCodeMap[day[per].weathercode]?.image || '/fallback.png'}
                      alt={weatherCodeMap[day[per].weathercode]?.description || ''}
                      width={55}
                      height={55}
                    />
                  </div>
                ) : null,
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
