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
    <div className="mt-8 md:mt-16">
      <h1 className="text-3xl md:text-5xl font-bold px-4 mb-4 text-sky-700">
        Receive your <br />
        Event Confirmations <br />
        with a Breeze...
      </h1>

      <form
        className="flex flex-col md:grid grid-cols-3 gap-2 font-mono card"
        onSubmit={submitHandler}>
        <label>Your Name:</label>
        <input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          className="input mb-2 col-span-2"
        />
        <label>Event Name:</label>
        <input
          onChange={(e) =>
            setEvent((prev) => ({ ...prev, name: e.target.value }))
          }
          value={event.name}
          className="input mb-2 col-span-2"
        />
        {/* <label>Event Description:</label>
        <input
          onChange={(e) =>
            setEvent((prev) => ({ ...prev, description: e.target.value }))
          }
          value={event.description}
          className="input"
        /> */}

        <label>Event Start Date:</label>
        <input
          type="datetime-local"
          onChange={(e) => handleDateChange(e, "start")}
          className="input mb-2 col-span-2"
        />

        {/* <label>Event End Date:</label>
        <input
          type="datetime-local"
          onChange={(e) => handleDateChange(e, "end")}
          className="input"
        /> */}

        <label>Event Location:</label>
        <input
          onChange={(e) =>
            setEvent((prev) => ({ ...prev, location: e.target.value }))
          }
          value={event.location}
          className="input mb-2 col-span-2"
        />
        <div className="col-span-2 ">
          <button className="text-left bg-sky-600 text-white input">
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}
