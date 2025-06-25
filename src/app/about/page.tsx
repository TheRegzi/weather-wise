import Image from 'next/image';

export default function About() {
  return (
    <main className="w-[800px] mx-auto flex flex-col">
      <Image
        src="/assets/logo.png"
        alt="Logo"
        width={150}
        height={150}
        className="w-[150px] h-[150px] justify-center mx-auto my-10"
      />
      <h1 className="font-inter font-semibold text-3xl text-shadow">About us</h1>
      <div className="flex flex-col items-center justify-center mt-5 mb-10 gap-4 bg-background-secondary py-10 px-5 font-display">
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
    </main>
  );
}
