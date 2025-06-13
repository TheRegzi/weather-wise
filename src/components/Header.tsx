import Link from "next/link";
import logo from "../../public/assets/logo.png";
import Image from 'next/image'

export default function Header() {
    return (
      <header className='flex justify-between bg-background items-center space-x-4 flex-row'>
        <Image 
          src={logo} 
          alt='WW Logo' 
          className='my-4 ml-7 h-[80px] sm:w-[100px] w-[80px] sm:h-[100px] rounded-full'
          priority
        />
        <nav>
          <ul className='flex gap-10 text-decoration-none text-black font-roboto text-xl font-medium'>
            <li><Link href="/" className="hover:text-blue-700">Home</Link></li>
            <li><Link href="/about" className="hover:text-blue-700">About us</Link></li>
            <li><Link href="/contact" className="pr-10 hover:text-blue-700">Contact us</Link></li>
          </ul>
        </nav>
      </header>
    )
  }