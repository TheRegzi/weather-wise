import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileScreenButton, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function Contact() {
  return (
    <main className="w-[1000px] flex flex-col mx-auto justify-center my-16">
      <h1 className="font-inter font-semibold text-3xl text-shadow">Contact us</h1>
      <div className="flex flex-row gap-4 text-center color-black">
        <div className="bg-background-secondary p-10 mt-6 justify-center flex-1">
          <FontAwesomeIcon className="text-7xl mt-5 mb-2" icon={faMobileScreenButton} />
          <h2 className="font-display text-shadow font-semibold text-2xl my-2">Phone</h2>
          <p className="font-display text-shadow text-md">Our phone number: + 49 01 3238 92021</p>
          <p className="font-display text-shadow text-md">10:00-11:30 | 12:00-14:00</p>
        </div>
        <div className="bg-background-secondary p-10 mt-6 flex-1">
          <FontAwesomeIcon className="text-7xl mt-5 mb-2" icon={faEnvelope} />
          <h2 className="font-display text-shadow font-semibold text-2xl my-2">E-mail</h2>
          <p className="font-display text-shadow text-md">Our e-mail address:</p>
          <p className="font-display text-shadow text-md">weatherwise@gmail.com</p>
        </div>
      </div>
      <div className="bg-background-secondary justify-center w-full p-10 mt-6 flex-1">
        <h2 className="font-display text-shadow font-semibold text-2xl my-2 text-center">
          Give us feedback!
        </h2>
        <p className="font-display text-shadow text-md w-lg justify-center mx-auto">
          We appreciate your interest in WeatherWise. Please use this form to get in touch with us.
          Fill in the required information, and we will do our best to respond to you as quickly as
          possible.
        </p>
      </div>
    </main>
  );
}
