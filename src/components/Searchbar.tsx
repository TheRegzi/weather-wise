'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type SearchInputProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

function SearchInput({ value, onChange, onSubmit }: SearchInputProps) {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative">
        <input
          type="search"
          id="search"
          name="search"
          value={value}
          onChange={onChange}
          placeholder="Search for a place..."
          className="block w-full rounded-3xl border border-gray-300
            bg-searchbar py-4 pl-10 pr-4 placeholder-color-search
            focus:border-blue-700 focus:ring-1 focus:ring-blue-700
            focus:outline-none
            transition shadow-xl mt-4 bg-searchbar font-roboto text-xl font-light"
          autoComplete="off"
        />
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
      </div>
    </form>
  );
}

export default function SearchWeather() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/searchresults?page=${encodeURIComponent(search)}`);
  };

  return <SearchInput value={search} onChange={handleChange} onSubmit={handleSubmit} />;
}
