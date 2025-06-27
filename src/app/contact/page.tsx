import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileScreenButton, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function Contact(): JSX.Element {
  return (
    <main className="w-full lg:w-[1000px] flex flex-col mx-auto justify-center my-16 px-4">
      <h1 className="font-inter font-semibold text-4xl text-shadow">Contact us</h1>
      <div className="flex flex-col sm:flex-row gap-4 text-center color-black">
        <div className="bg-background-secondary p-10 mt-6 justify-center flex-1">
          <FontAwesomeIcon className="text-7xl mt-5 mb-2" icon={faMobileScreenButton} />
          <h2 className="font-display text-shadow font-semibold text-2xl my-2">Phone</h2>
          <p className="font-display text-shadow text-md">Our phone number: + 49 01 3238 92021</p>
          <p className="font-display text-shadow text-md">10:00-11:30 | 12:00-14:00</p>
        </div>
        <div className="bg-background-secondary p-10 sm:mt-6 flex-1">
          <FontAwesomeIcon className="text-7xl mt-5 mb-2" icon={faEnvelope} />
          <h2 className="font-display text-shadow font-semibold text-2xl my-2">E-mail</h2>
          <p className="font-display text-shadow text-md">Our e-mail address:</p>
          <p className="font-display text-shadow text-md">weatherwise@gmail.com</p>
        </div>
      </div>
      <div className="bg-background-secondary justify-center w-full p-5 md:p-10 mt-4 flex-1">
        <h2 className="font-display text-shadow font-semibold text-2xl mt-2 mb-4 text-center">
          Give us feedback!
        </h2>
        <p className="font-display text-shadow text-sm w-full sm:w-lg justify-center mx-auto">
          We appreciate your interest in WeatherWise. Please use this form to get in touch with us.
          Fill in the required information, and we will do our best to respond to you as quickly as
          possible.
        </p>
        <h3 className="font-display text-shadow font-semibold text-xl my-5 text-center">
          Contact form
        </h3>
        <form action="#" className="flex flex-col gap-4 w-full max-w-lg mx-auto font-display">
          <input
            type="text"
            placeholder="Full name*"
            className="p-2 border-2 border-gray-300 rounded-lg bg-form text-shadow"
            required
          />
          <input
            type="email"
            placeholder="Email*"
            className="p-2 border-2 border-gray-300 rounded-lg bg-form text-shadow"
            required
          />
          <textarea
            placeholder="What can we help you with?*"
            className="p-2 border-2 border-gray-300 rounded-lg bg-form h-32 text-shadow"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-submit w-[150px] shadow-lg mx-auto font-display font-medium text-lg text-white p-2 rounded hover:bg-blue-600 transition-colors text-shadow"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
