import Image from 'next/image';

export default function About() {
  return (
    <main className="w-full md:w-[800px] mx-auto flex flex-col px-2">
      <Image
        src="/assets/logo.png"
        alt="Logo"
        width={150}
        height={150}
        className="w-[150px] h-[150px] justify-center mx-auto mt-10 mb-5 hidden sm:block"
      />
      <Image
        src="/assets/logo-small.png"
        alt="Logo"
        width={200}
        height={200}
        className="w-full h-full justify-center mx-auto mt-10 mb-5 block sm:hidden"
      />
      <h1 className="font-inter font-semibold text-3xl text-shadow">About us</h1>
      <div className="flex flex-col items-center justify-center mt-3 mb-5 gap-4 bg-background-secondary py-10 px-5 font-display text-shadow">
        <p>
          Welcome to WeatherWise, your go-to source for accurate and up-to-date weather information.
          At WeatherWise, we are committed to providing you with the most reliable and comprehensive
          weather forecasts to help you plan your day with confidence.
        </p>
        <p>
          Our team continuously monitors and analyzes weather patterns from around the globe to
          bring you the most up-to-date information. We use a blend of traditional meteorological
          techniques and cutting-edge technology, including AI and machine learning, to predict
          weather conditions with high accuracy.
        </p>
        <p>
          Thank you for choosing WeatherWise. We are excited to be your trusted partner in weather
          forecasting, helping you make informed decisions every day.
        </p>
      </div>
      <Image
        src="/assets/closeup-shot-thermometer-beach-sand.jpg"
        alt="Thermometer on the beach"
        width={800}
        height={300}
        className="w-full h-[150px] md:h-[220px] object-cover mb-10"
      />
    </main>
  );
}
