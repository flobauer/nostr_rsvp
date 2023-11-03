import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useNostr } from "nostr-react";
import { createEvent, updateUserProfileIfNameChanged } from "helpers/actions";

export default function CreateEvent() {
  const { publish } = useNostr();
  const navigate = useNavigate();

  const { setEvents, user, setUser, username, setUsername } =
    useOutletContext();

  const [event, setEvent] = useState({
    name: "",
    description: "",
    start: "",
    end: "",
    location: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    // make sure that user profile is up to date
    updateUserProfileIfNameChanged({
      name: username,
      user,
      setUser,
      publish,
    });

    // we add the event on nostr
    const createdEvent = await createEvent({
      data: event,
      publish,
      publicKey: user.publicKey,
      privateKey: user.privateKey,
    });

    setEvents((prev) => [...prev, createdEvent]);

    navigate(`/${createdEvent.id}`);
  };

  // only update the react date when its valid
  const handleDateChange = (e, type) => {
    if (!e.target["validity"].valid) return;

    setEvent((prev) => ({
      ...prev,
      [type]: e.target.value,
    }));
  };

  return (
    <div className="mt-16">
      <h1 className="text-2xl font-bold px-4 mb-4">A very Simple RSVP App</h1>

      <form
        className="grid grid-cols-2 gap-2 font-mono card"
        onSubmit={submitHandler}>
        <label>Your Name:</label>
        <input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className="input"
        />
        <label>Event Name:</label>
        <input
          onChange={(e) =>
            setEvent((prev) => ({ ...prev, name: e.target.value }))
          }
          value={event.name}
          className="input"
        />
        <label>Event Description:</label>
        <input
          onChange={(e) =>
            setEvent((prev) => ({ ...prev, description: e.target.value }))
          }
          value={event.description}
          className="input"
        />

        <label>Event Start Date:</label>
        <input
          type="datetime-local"
          onChange={(e) => handleDateChange(e, "start")}
          className="input"
        />

        <label>Event End Date:</label>
        <input
          type="datetime-local"
          onChange={(e) => handleDateChange(e, "end")}
          className="input"
        />

        <label>Event Location:</label>
        <input
          onChange={(e) =>
            setEvent((prev) => ({ ...prev, location: e.target.value }))
          }
          value={event.location}
          className="input"
        />
        <div>
          <button className="text-left bg-emerald-800 text-white input">
            Create Event
          </button>
        </div>
      </form>
      <p className="italic text-gray-600 p-4">
        This application has no backend - it runs on the nostr protocol, which
        is a decentralized and cencorship resistant protocol. If you want to
        learn more about nostr, check out{" "}
        <a
          href="https://nostr.com"
          className="text-purple-800 underline"
          target="_blank"
          rel="noreferrer">
          nostr.com
        </a>
      </p>
    </div>
  );
}
