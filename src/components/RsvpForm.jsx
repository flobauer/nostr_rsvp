import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import PropTypes from "prop-types";
import { classNames } from "helpers/util";

function RsvpForm({ event, myRsvp, rsvpHandler }) {
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
      <form onSubmit={submitHandler} className="card">
        <h1 className="font-bold">🗓️ {event.name}</h1>
        <p className="text-gray-500">
          {event.start?.format("DD.MM.YYYY")} ab {event.start?.format("HH:mm")}{" "}
          ({event.start?.format("dddd")})
        </p>
        <hr className="my-4" />
        <span className="block text-gray-500">📍{event.location}</span>

        <div className="md:grid grid-cols-3 mt-4 gap-2">
          <p className="py-1">Your name?</p>
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="input col-span-2"
            required
          />
        </div>
        <div className="md:grid grid-cols-3 mt-2 gap-2">
          <p className="py-1">Are you coming by?</p>
          <div className="col-span-2 flex gap-2">
            <button
              name="yes"
              className={classNames(
                "input",
                "hover:bg-sky-800 hover:text-white",
                myRsvp?.content === "yes" ? "bg-blue-600 text-white" : ""
              )}>
              Yes
            </button>
            <button
              name="maybe"
              className={classNames(
                "input",
                "hover:bg-sky-800 hover:text-white",
                myRsvp?.content === "maybe" ? "bg-blue-600 text-white" : ""
              )}>
              Maybe
            </button>
            <button
              name="no"
              className={classNames(
                "input",
                "hover:bg-sky-800 hover:text-white",
                myRsvp?.content === "no" ? "bg-blue-600 text-white" : ""
              )}>
              No
            </button>
          </div>
        </div>
        <div className="md:grid grid-cols-3 mt-2 gap-2">
          <p className="py-1">Is somebody joining you?</p>
          <input
            type="number"
            className="input col-span-2"
            onChange={(e) => setRsvp({ ...rsvp, guests: e.target.value })}
            value={rsvp.guests}
          />
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
  myRsvp: PropTypes.shape({
    content: PropTypes.string,
  }),
  rsvpHandler: PropTypes.func,
};
export default RsvpForm;
