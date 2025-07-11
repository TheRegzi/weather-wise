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

type HourlyWeather = {
  time: string[];
  temperature_2m: number[];
  wind_speed_10m: number[];
  weathercode: number[];
  rain: number[];
  snowfall: number[];
};

type PeriodWeather = {
  degrees: number;
  windSpeed: number;
  weathercode: number | undefined;
  rain: number;
  snowfall: number;
};

type RawPeriodWeather = {
  temp: number;
  wind: number;
  weathercode: number;
  rain: number;
  snowfall: number;
};

type DayWeather = {
  date: string;
  weekday: string;
  night: PeriodWeather | null;
  day: PeriodWeather | null;
  evening: PeriodWeather | null;
  tempMin: string;
  tempMax: string;
  totalRain: number;
  totalSnowfall: number;
};

type WeatherAPIData = {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
  hourly: HourlyWeather;
} | null;

async function fetchWeatherData(
  latitude: string | number,
  longitude: string | number,
): Promise<WeatherAPIData> {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,wind_speed_10m,weathercode,rain,snowfall&forecast_days=10&timezone=auto&windspeed_unit=ms`;
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

type PeriodKey = 'night' | 'day' | 'evening';

function getPeriod(hour: number): PeriodKey {
  if (hour >= 0 && hour < 6) return 'night';
  if (hour >= 6 && hour < 18) return 'day';
  return 'evening';
}

function build10DayPeriods(hourly: HourlyWeather): DayWeather[] {
  const result: DayWeather[] = [];
  const byDate: Record<string, Record<PeriodKey, RawPeriodWeather[]>> = {};

  for (let i = 0; i < hourly.time.length; i++) {
    const dateStr = hourly.time[i].slice(0, 10);
    const hour = parseInt(hourly.time[i].slice(11, 13), 10);
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
    const dayObj: Partial<DayWeather> = { date, weekday };

    for (const period of ['night', 'day', 'evening'] as PeriodKey[]) {
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

    const allTemps = ([] as number[]).concat(
      ...Object.values(byDate[date]).map((arr) => arr.map((x) => x.temp)),
    );
    dayObj.tempMin = Math.min(...allTemps).toFixed(1);
    dayObj.tempMax = Math.max(...allTemps).toFixed(1);

    const allRains = ([] as number[]).concat(
      ...Object.values(byDate[date]).map((arr) => arr.map((x) => x.rain)),
    );
    dayObj.totalRain = Math.round(allRains.reduce((sum, n) => sum + n, 0));

    const allSnowfalls = ([] as number[]).concat(
      ...Object.values(byDate[date]).map((arr) => arr.map((x) => x.snowfall)),
    );
    dayObj.totalSnowfall = Math.round(allSnowfalls.reduce((sum, n) => sum + n, 0));

    result.push(dayObj as DayWeather);
  }
  return result;
}

export default function SinglePlaceWeather() {
  const params = useParams() as { lat: string; lon: string };
  const searchParams = useSearchParams();
  const lat = params.lat;
  const lon = params.lon;
  const name = searchParams.get('name');

  const [weatherData, setWeatherData] = useState<WeatherAPIData>(null);
  const [forecast, setForecast] = useState<DayWeather[]>([]);

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
    return (
      <div className="text-center font-display font-semibold text-lg my-10">
        Loading weather data...
      </div>
    );
  }

  const hourlyData = weatherData.hourly || {};
  const currentTime = new Date().toISOString();
  const currentHourString = currentTime.slice(0, 13) + ':00';
  const timeIndex = hourlyData.time.findIndex((time) => time === currentHourString);

  const currentTemperature = weatherData?.current_weather?.temperature ?? 'N/A';

  const windSpeed =
    timeIndex !== -1 && hourlyData.wind_speed_10m ? hourlyData.wind_speed_10m[timeIndex] : 'N/A';

  const rain = timeIndex !== -1 && hourlyData.rain ? hourlyData.rain[timeIndex] : 'N/A';

  const snowfall = timeIndex !== -1 && hourlyData.snowfall ? hourlyData.snowfall[timeIndex] : 'N/A';

  const todayDate = new Date().toISOString().slice(0, 10);
  const todayIdx = forecast.findIndex((day) => day.date === todayDate);
  const daysToShow = todayIdx === -1 ? forecast : forecast.slice(todayIdx);
  const daysToShow10 = daysToShow.slice(0, 10);

  return (
    <div className="p-4 md:p-8 flex flex-col mx-auto w-full lg:w-[1000px]">
      <h1 className="text-4xl font-inter font-bold mb-4 text-shadow mt-10">
        <FontAwesomeIcon icon={faLocationDot} className="text-footer w-5 h-5 mr-2" />
        {name ? name : `${lat}, ${lon}`}
      </h1>
      <div className="flex flex-row gap-2 justify-between items-center mt-4">
        <h2 className="font-display font-semibold text-lg text-shadow hidden md:block">
          The weather now
        </h2>
        <p className="text-3xl font-semibold text-shadow">
          <FontAwesomeIcon className="text-3xl" icon={faTemperatureHigh} /> {currentTemperature}°
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
        <div className="flex flex-row gap-6 md:gap-12 flex-1 justify-end pr-2 md:pr-7">
          {['night', 'day', 'evening'].map((per) => (
            <div key={per} className="flex flex-col items-center">
              <div className="text-lg font-roboto font-normal capitalize text-search text-shadow">
                {per}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4 bg-background-secondary p-3 md:p-7">
        {daysToShow10.map((day) => (
          <div key={day.date} className="flex flex-row border-b pb-2 gap-4 md:gap-8 items-center">
            {/* LEFT: Date and numbers */}
            <div className="w-32 md:w-48">
              <div className="font-bold font-display text-lg">
                {day.date === todayDate ? 'Today' : day.weekday}
              </div>
              <div className="text-md text-gray-500">{day.date}</div>
              <div className="mt-2 font-display text-lg">
                <div>
                  {day.tempMax}°C / {day.tempMin}°C
                </div>
                <div>
                  {(() => {
                    const winds = [
                      day.night?.windSpeed,
                      day.day?.windSpeed,
                      day.evening?.windSpeed,
                    ].filter((x): x is number => x !== undefined && x !== null);
                    const avg = winds.length
                      ? Math.round(winds.reduce((sum, n) => sum + n, 0) / winds.length)
                      : 'N/A';
                    return `${avg} m/s`;
                  })()}
                </div>
                <div>
                  {day.totalSnowfall > 0 ? (
                    <div>
                      <FontAwesomeIcon icon={faSnowflake} className="" /> {day.totalSnowfall} mm
                    </div>
                  ) : (
                    <div>
                      <FontAwesomeIcon icon={faUmbrella} className="" /> {day.totalRain} mm
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* RIGHT: Weather icons for night, day, evening */}
            <div className="flex flex-row gap-5 md:gap-10 flex-1 justify-end">
              {(['night', 'day', 'evening'] as PeriodKey[]).map((per) =>
                day[per] ? (
                  <div key={per} className="flex flex-col items-center">
                    {(() => {
                      const weatherCode = day[per]?.weathercode;
                      const weatherIcon =
                        weatherCode !== undefined && weatherCode !== null
                          ? weatherCodeMap[weatherCode]
                          : undefined;
                      return (
                        <Image
                          src={weatherIcon?.image || '/fallback.png'}
                          alt={weatherIcon?.description || ''}
                          width={55}
                          height={55}
                          className="w-12 h-12 md:w-[55px] md:h-[55px] object-contain"
                        />
                      );
                    })()}
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
