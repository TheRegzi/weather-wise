import Image from 'next/image';

export default function About() {
  return (
    <main className="w-[1000px] mx-auto flex flex-col">
      <Image
        src="/assets/logo.png"
        alt="Logo"
        width={150}
        height={150}
        className="w-[150px] h-[150px]"
      />
      <h1 className="font-inter font-semibold">About us</h1>
    </main>
  );
}
