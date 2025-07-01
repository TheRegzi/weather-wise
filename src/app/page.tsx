'use client';

import { useEffect, useState } from 'react';
import SearchInput from '@/components/Searchbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { weatherCodeMap } from '@/utils/weatherCodeMap';
import Image from 'next/image';
import Link from 'next/link';

const OSLO = {
  name: 'Oslo',
  admin1: 'Oslo',
  country: 'Norway',
  latitude: 59.9127,
  longitude: 10.7461,
};

interface CurrentWeather {
  temperature: number;
  weathercode: number;
}

interface DailyWeather {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

interface WeatherCodeMapItem {
  description: string;
  image: string;
}

type Weather = {
  current?: CurrentWeather;
  daily?: DailyWeather;
};

interface DayWeatherSummary {
  name: string;
  tempMin: string;
  tempMax: string;
  weatherData?: WeatherCodeMapItem;
}

export default function HomePage() {
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${OSLO.latitude}&longitude=${OSLO.longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Europe/Oslo`;
      try {
        const resp = await fetch(apiUrl);
        const data = await resp.json();
        setWeather({
          current: data.current_weather,
          daily: data.daily,
        });
      } catch (error) {
        console.error('Failed to fetch weather:', error);
        setWeather(null);
      }
    }
    fetchWeather();
  }, []);

  const today = weather?.current;
  const daily = weather?.daily;

  const todayWeatherCode = today?.weathercode;
  const todayWeatherData: WeatherCodeMapItem | undefined =
    todayWeatherCode !== undefined ? weatherCodeMap[todayWeatherCode] : undefined;

  const daySummaries: DayWeatherSummary[] = [];

  if (daily && daily.time?.length >= 4) {
    for (let i = 1; i <= 3; i++) {
      const date = new Date(daily.time[i]);
      daySummaries.push({
        name: date.toLocaleDateString('en-US', { weekday: 'long' }),
        tempMin: Math.round(daily.temperature_2m_min[i]).toString(),
        tempMax: Math.round(daily.temperature_2m_max[i]).toString(),
        weatherData: weatherCodeMap[daily.weathercode[i]],
      });
    }
  }

  return (
    <main className="flex flex-col md:justify-center w-full xl:w-[1200px] h-[800px] mx-auto p-8">
      <h1 className="font-inter font-semibold text-center text-2xl md:text-3xl mt-12 md:mt-0 text-shadow">
        Welcome to WeatherWise!
      </h1>
      <SearchInput />
      <div className="flex flex-col justify-center items-center mt-8 bg-background-secondary bg-opacity-90 p-2 md:p-7">
        <div className="flex w-full md:w-[700px] justify-center">
          <div className="flex flex-row justify-between items-center w-[700px] gap-2">
            <Link
              href={`/single-place-weather/${OSLO.latitude}/${OSLO.longitude}?name=${encodeURIComponent(OSLO.name)}`}
              className="font-display text-shadow text-3xl font-semibold text-left flex items-center"
            >
              <FontAwesomeIcon icon={faLocationDot} className="text-footer w-4 h-4 mr-2" />
              {OSLO.name}
            </Link>
            <p className="text-search font-display text-xl">
              Now{' '}
              <span className="text-4xl font-bold text-shadow text-black">
                {today?.temperature}°
              </span>
            </p>
          </div>
        </div>
        <div className="mt-6 text-xl font-display text-shadow text-left w-full md:w-[700px]">
          {weather && today && daily ? (
            <div>
              {/* Today */}
              <div className="flex flex-row gap-8 justify-between items-center border-b border-[#939393] pb-1">
                <p className="w-12">Today</p>
                <p className="flex-1 text-center">{today.temperature}°C</p>
                {todayWeatherData && (
                  <Image
                    src={todayWeatherData.image}
                    alt={todayWeatherData.description || 'Weather icon'}
                    width={48}
                    height={48}
                    className="w-12 h-12"
                  />
                )}
              </div>
              {/* Next 3 days */}
              {daySummaries.map((summary, index) => (
                <div
                  key={`${summary.name}-${index}`}
                  className="flex flex-row gap-8 justify-between items-center border-b border-[#939393] pb-1 mt-4"
                >
                  <p className="w-12">{summary.name}</p>
                  <p className="flex-1 text-center">{summary.tempMax}°C</p>
                  {summary.weatherData && (
                    <Image
                      src={summary.weatherData.image}
                      alt={summary.weatherData.description || 'Weather icon'}
                      width={48}
                      height={48}
                      className="w-12 h-12"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span>Loading weather...</span>
          )}
        </div>
      </div>
    </main>
  );
}
