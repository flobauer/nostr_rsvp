import PropTypes from "prop-types";
import RsvpEntry from "components/RsvpEntry";
import { UserIcon } from "@heroicons/react/24/outline";

function RsvpEntries({ rsvps }) {
  const yesRsvps = rsvps.filter((rsvp) => rsvp.content === "yes");
  const maybeRsvps = rsvps.filter((rsvp) => rsvp.content === "maybe");
  const noRsvps = rsvps.filter((rsvp) => rsvp.content === "no");

  return (
    <div className="card">
      <h1 className="mb-4">
        <span className="font-bold">🧑🏽‍🤝‍🧑🏻 Participants</span> (
        <span className="text-green-500">{yesRsvps.length}</span>/
        <span className="text-yellow-500">{maybeRsvps.length}</span>/
        <span className="text-red-500">{noRsvps.length}</span>)
      </h1>
      <hr className="my-4" />
      <div className="flex flex-col gap-2">
        <ul className="flex flex-wrap gap-2">
          {yesRsvps.map((rsvp) => (
            <RsvpEntry key={rsvp.id} message={rsvp} />
          ))}
        </ul>
        <ul className="flex flex-wrap gap-2">
          {maybeRsvps.map((rsvp) => (
            <RsvpEntry key={rsvp.id} message={rsvp} />
          ))}
        </ul>
        <ul className="flex flex-wrap gap-2">
          {noRsvps.map((rsvp) => (
            <RsvpEntry key={rsvp.id} message={rsvp} />
          ))}
        </ul>
      </div>
    </div>
  );
}

RsvpEntry.propTypes = {
  rsvps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      pubkey: PropTypes.string.isRequired,
      created_at: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RsvpEntries;
