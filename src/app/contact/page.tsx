export default function Contact() {
  return (
    <main className="w-[1000px] flex flex-col mx-auto justify-center my-16">
      <h1 className="font-inter font-semibold text-3xl text-shadow">Contact us</h1>
      <div className="flex flex-row gap-4 text-center color-black">
        <div className="bg-background-secondary p-6 mt-6 justify-center flex-1">
          <h2 className="font-display text-shadow font-semibold text-2xl my-2">Phone</h2>
          <p className="font-display text-shadow text-md">Our phone number: + 49 01 3238 92021</p>
          <p className="font-display text-shadow text-md">10:00-11:30 | 12:00-14:00</p>
        </div>
        <div className="bg-background-secondary p-6 mt-6 flex-1"></div>
      </div>
    </main>
  );
}
