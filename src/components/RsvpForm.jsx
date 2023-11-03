import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import PropTypes from "prop-types";

function RsvpForm({ event, rsvpHandler }) {
  const { username, setUsername } = useOutletContext();
  const [rsvp, setRsvp] = useState({
    guests: 0,
    attending: null,
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    rsvp.attending = e.nativeEvent.submitter.name;
    rsvpHandler(rsvp);
  };

  return (
    <div className="md:flex gap-4">
      <div className="text-3xl py-4">🗓️</div>
      <form
        onSubmit={submitHandler}
        className="flex-1 bg-white rounded-2xl shadow-lg px-6 py-4 text-lg font-mono">
        <h1 className="font-bold">{event.name}</h1>
        <p className="text-gray-500">
          {event.start?.format("DD.MM.YYYY")} ab {event.start?.format("HH:mm")}{" "}
          ({event.start?.format("dddd")})
        </p>
        <hr className="my-4" />
        <span className="block text-gray-500">📍{event.location}</span>

        <div className="md:flex mt-4 gap-2">
          <p className="py-1">Your name?</p>
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="rounded-full border border-gray-200 py-1 px-4 ml-auto"
            required
          />
        </div>
        <div className="md:flex mt-2 gap-2">
          <p className="py-1">Is somebody joining you?</p>
          <input
            type="number"
            className="rounded-full border border-gray-200 py-1 px-4 ml-auto"
            onChange={(e) => setRsvp({ ...rsvp, guests: e.target.value })}
            value={rsvp.guests}
          />
        </div>
        <div className="md:flex mt-2 gap-2">
          <p className="py-1">Are you coming by?</p>
          <button
            name="yes"
            className="rounded-full border border-gray-200 py-1 px-4 hover:bg-sky-800 hover:text-white transition ml-auto">
            Yes
          </button>
          <button
            name="maybe"
            className="rounded-full border border-gray-200 py-1 px-4 hover:bg-sky-800 hover:text-white transition">
            Maybe
          </button>
          <button
            name="no"
            className="rounded-full border border-gray-200 py-1 px-4 hover:bg-sky-800 hover:text-white transition">
            No
          </button>
        </div>
      </form>
    </div>
  );
}

RsvpForm.propTypes = {
  event: PropTypes.shape({
    name: PropTypes.string,
    start: PropTypes.object,
    location: PropTypes.string,
  }),
  rsvpHandler: PropTypes.func,
};
export default RsvpForm;
