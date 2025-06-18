'use client';

import Link from 'next/link';
import logo from '../../public/assets/logo.png';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="flex justify-between bg-background items-center flex-row">
        {/* Logo */}
        <Link href="/" className="text-decoration-none">
          <Image
            src={logo}
            alt="WW Logo"
            className="my-4 ml-7 h-[80px] sm:w-[100px] w-[80px] sm:h-[100px] rounded-full"
            priority
          />
        </Link>
        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mr-4 text-3xl md:hidden"
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-20 text-decoration-none text-black font-roboto text-xl font-medium">
            <li>
              <Link href="/" className="hover:text-blue-700">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-700">
                About us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="pr-10 hover:text-blue-700">
                Contact us
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      {/* Mobile nav */}
      {isOpen && (
        <nav className="fixed z-50 top-24 sm:top-32 left-0 right-0 md:hidden bg-background shadow-lg px-8 py-4">
          <ul className="flex flex-col gap-5 font-roboto text-xl font-medium my-7">
            <li>
              <Link href="/" className="hover:text-blue-700" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-700" onClick={() => setIsOpen(false)}>
                About us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-blue-700"
                onClick={() => setIsOpen(false)}
              >
                Contact us
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
