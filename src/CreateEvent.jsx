import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useNostr } from "nostr-react";
import { createEvent } from "./helpers/actions";

export default function CreateEvent() {
  // function to create an event
  const { publish } = useNostr();

  // we store the events the user is subscribed to in local storage
  const { storedEvents, setStoredEvents } = useOutletContext();

  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    start: "",
    end: "",
    location: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    const createdEvent = await createEvent({
      newEvent,
      publish,
    });

    setStoredEvents((prev) => [...prev, createdEvent]);
  };

  const handleDateChange = (e, type) => {
    if (!e.target["validity"].valid) return;

    console.log(e.target.value);

    setNewEvent((prev) => ({
      ...prev,
      [type]: e.target.value,
    }));
  };

  return (
    <form className="grid grid-cols-2 gap-2" onSubmit={submitHandler}>
      <label>Event Name:</label>
      <input
        onChange={(e) =>
          setNewEvent((prev) => ({ ...prev, name: e.target.value }))
        }
        value={newEvent.name}
      />
      <label>Event Description:</label>
      <input
        onChange={(e) =>
          setNewEvent((prev) => ({ ...prev, description: e.target.value }))
        }
        value={newEvent.description}
      />

      <label>Event Start Date:</label>
      <input
        type="datetime-local"
        onChange={(e) => handleDateChange(e, "start")}
      />

      <label>Event End Date:</label>
      <input
        type="datetime-local"
        onChange={(e) => handleDateChange(e, "end")}
      />

      <label>Event Location:</label>
      <input
        onChange={(e) =>
          setNewEvent((prev) => ({ ...prev, location: e.target.value }))
        }
        value={newEvent.location}
      />
      <div>
        <button className="text-left bg-emerald-800 text-white p-1 rounded">
          Create Event
        </button>
      </div>
    </form>
  );
}
