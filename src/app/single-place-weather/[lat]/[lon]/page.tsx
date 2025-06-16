'use client';

import { useParams, useSearchParams } from 'next/navigation';

export default function SinglePlaceWeather() {
  const params = useParams() as { lat: string; lon: string };
  const searchParams = useSearchParams();

  const lat = params.lat;
  const lon = params.lon;
  const name = searchParams.get('name');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Weather for {name ? name : `${lat}, ${lon}`}</h1>
    </div>
  );
}
