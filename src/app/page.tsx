'use client';

import { useState } from 'react';
import SearchInput from '@/components/Searchbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

export default function HomePage() {
  const [query, setQuery] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert(`Searching for: ${query}`);
  }

  return (
    <main className="flex flex-col justify-center w-full h-full lg:w-[1200px] lg:h-[800px] mx-auto p-8">
      <h1 className="font-inter font-semibold text-3xl text-shadow">Welcome to WeatherWise!</h1>
      <SearchInput value={query} onChange={handleChange} onSubmit={handleSubmit} />
      <div className="flex flex-col justify-center items-center mt-8 bg-background-secondary bg-opacity-90 p-7">
        <div className="flex w-[700px] justify-center">
          <div className="flex flex-row justify-between items-center w-[700px]">
            <p className="font-display text-3xl font-semibold text-left">
              <FontAwesomeIcon icon={faLocationDot} className="text-footer w-4 h-4" /> Place here
            </p>
            <p className="text-search font-display text-xl">Now</p>
          </div>
        </div>
      </div>
    </main>
  );
}
