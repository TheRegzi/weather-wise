'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

type Place = {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
};

async function fetchAPI(searchTerm: string): Promise<{ results?: Place[] }> {
  const apiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    searchTerm,
  )}&count=10&language=en&format=json`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get('page');
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    if (!search) return;
    fetchAPI(search).then((data) => setPlaces(data?.results ?? []));
  }, [search]);

  if (!search) return <div>No search term</div>;

  return (
    <div className="flex flex-col justify-center mx-auto p-8 w-[1000px]">
      <h1 className="text-left font-semibold text-4xl font-inter mt-5">Search results</h1>
      <p className="font-roboto italic font-light text-xl my-2">
        Showing results for &quot;{search}&quot;:
      </p>
      <div className="bg-background-secondary py-1 px-10 mt-3">
        {places.length > 0 ? (
          <ul className="list-disc mt-3">
            {places.map((place) => (
              <li
                key={place.id || `${place.name}-${place.latitude}-${place.longitude}`}
                className="text-lg flex items-center gap-2 border-b my-4 text-xl font-display"
              >
                <FontAwesomeIcon icon={faLocationDot} className="text-footer mr-2" />
                <Link
                  href={`/weather?lat=${place.latitude}&lon=${place.longitude}&name=${encodeURIComponent(place.name)}`}
                  className="font-semibold hover:underline transition"
                >
                  {place.name}
                </Link>
                {place.admin1 && <> ({place.admin1})</>}
                {place.country && <> – {place.country}</>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-gray-500">No places found.</p>
        )}
      </div>
    </div>
  );
}
