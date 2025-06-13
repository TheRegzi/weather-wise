"use client";

import { useState } from "react";
import SearchInput from "@/components/Searchbar";

export default function HomePage() {
  const [query, setQuery] = useState("");

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
      <div className="flex flex-col items-center justify-center mt-8 bg-background-secondary">
<h2>
  Place
</h2>
      </div>
    </main>
  );
}

