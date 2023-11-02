import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useNostr } from "nostr-react";
import { createEvent, updateUserProfile } from "./helpers/actions";
import { useLocalStorage } from "./helpers/hooks";

export default function CreateEvent() {
  // function to create an event
  const { publish } = useNostr();
  const [user, setUser] = useLocalStorage("user", {});

  // we store the events the user is subscribed to in local storage
  const { setEvents } = useOutletContext();

  const [event, setEvent] = useState({
    name: "",
    description: "",
    start: "",
    end: "",
    location: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    await updateUserProfile({
      user,
      publish,
    });

    const createdEvent = await createEvent({
      data: event,
      publish,
      publicKey: user.publicKey,
      privateKey: user.privateKey,
    });

    setEvents((prev) => [...prev, createdEvent]);
  };

  const handleDateChange = (e, type) => {
    if (!e.target["validity"].valid) return;

    setEvent((prev) => ({
      ...prev,
      [type]: e.target.value,
    }));
  };

  return (
    <form className="grid grid-cols-2 gap-2" onSubmit={submitHandler}>
      <label>Event Name:</label>
      <input
        onChange={(e) =>
          setEvent((prev) => ({ ...prev, name: e.target.value }))
        }
        value={event.name}
      />
      <label>Event Description:</label>
      <input
        onChange={(e) =>
          setEvent((prev) => ({ ...prev, description: e.target.value }))
        }
        value={event.description}
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
          setEvent((prev) => ({ ...prev, location: e.target.value }))
        }
        value={event.location}
      />
      <div>
        <button className="text-left bg-emerald-800 text-white p-1 rounded">
          Create Event
        </button>
      </div>
    </form>
  );
}
