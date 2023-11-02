import React, { useState, useEffect } from "react";
import { useNostr, useNostrEvents } from "nostr-react";
import { getEvent } from "../helpers/actions";

function RsvpForm({ eventId }) {
  const [myEvent, setMyEvent] = useState({});

  const { connectedRelays } = useNostr();

  useEffect(() => {
    getEvent(connectedRelays, eventId, setMyEvent);
  }, [connectedRelays, eventId]);

  return (
    <div className="md:w-1/2 md:flex gap-4">
      <div className="text-3xl py-4">🗓️</div>
      <form className="flex-1 bg-white rounded-2xl shadow-lg px-6 py-4 text-lg font-mono">
        <h1 className="font-bold">{myEvent.name}</h1>
        <p className="text-gray-500">
          {myEvent.start?.format("DD.MM.YYYY")} ab{" "}
          {myEvent.start?.format("H:m")} ({myEvent.start?.format("dddd")})
        </p>
        <hr className="my-4" />
        <span className="block text-gray-500">📍{myEvent.location}</span>

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
          <button className="rounded-full border border-gray-200 py-1 px-4 hover:bg-sky-800 hover:text-white transition ml-auto">
            Yes
          </button>
          <button className="rounded-full border border-gray-200 py-1 px-4 hover:bg-sky-800 hover:text-white transition">
            Maybe
          </button>
          <button className="rounded-full border border-gray-200 py-1 px-4 hover:bg-sky-800 hover:text-white transition">
            No
          </button>
        </div>
      </form>
    </div>
  );
}
export default RsvpForm;
