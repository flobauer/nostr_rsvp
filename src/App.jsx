import { useState } from "react";

function App() {
  return (
    <main className="md:w-1/2 md:flex gap-4">
      <div className="text-3xl py-4">🗓️</div>
      <form className="flex-1 bg-white rounded-2xl shadow-lg px-6 py-4 text-lg font-mono">
        <h1 className="font-bold">🔥Grillen bei Engage Technology</h1>
        <p className="text-gray-500">14.07.2023 ab 15:00 (Freitag)</p>
        <hr className="my-4" />
        <a
          className="block text-gray-500"
          href="https://goo.gl/maps/LjxNPGPgVmzvPhFa6"
          target="_blank"
          rel="noopener noreferrer">
          📍Weyringergasse 34/2, 1040 Wien
        </a>

        <div className="md:flex mt-4 gap-2">
          <p className="py-1">Your name?</p>
          <input
            id="name"
            type="text"
            className="rounded-full border border-gray-200 py-1 px-4 ml-auto"
            required
          />
        </div>
        <div className="md:flex mt-2 gap-2">
          <p className="py-1">Is somebody joining you?</p>
          <input
            type="number"
            className="rounded-full border border-gray-200 py-1 px-4 ml-auto"
            value="0"
          />
        </div>
        <div className="md:flex mt-2 gap-2">
          <p className="py-1">Are you coming by?</p>
          <button
            onclick="this.form.submitted=1;"
            className="rounded-full border border-gray-200 py-1 px-4 hover:bg-sky-800 hover:text-white transition ml-auto">
            Yes
          </button>
          <button
            onclick="this.form.submitted=2;"
            className="rounded-full border border-gray-200 py-1 px-4 hover:bg-sky-800 hover:text-white transition">
            Maybe
          </button>
          <button
            onclick="this.form.submitted=0;"
            className="rounded-full border border-gray-200 py-1 px-4 hover:bg-sky-800 hover:text-white transition">
            No
          </button>
        </div>
      </form>
    </main>
  );
}

export default App;
