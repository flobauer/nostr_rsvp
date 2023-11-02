import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

import { useLocalStorage } from "./helpers/hooks";
import { useProfile, useNostrEvents, useNostr } from "nostr-react";
import { createEvent } from "./helpers/actions";

export default function CreateEvent() {
  // function to create an event
  const { publish } = useNostr();

  // we store the events the user is subscribed to in local storage
  const { storedEvents, setStoredEvents } = useOutletContext();
  const [name, setName] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    const createdEvent = await createEvent({
      name,
      publish,
    });

    setStoredEvents((prev) => [...prev, createdEvent]);
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={submitHandler}>
      <input
        type="text"
        name="name"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <div>
        <button className="text-left bg-emerald-800 text-white p-1 rounded">
          Create Event
        </button>
      </div>
    </form>
  );
}
