import { useProfile } from "nostr-react";
import { useOutletContext } from "react-router-dom";
import PropTypes from "prop-types";
import {
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

// the entries for rsvps, show who is coming
// @todo: separate file is better
function RsvpEntry({ message }) {
  const { user, username } = useOutletContext();
  // get profile data
  const { data: userData } = useProfile({
    pubkey: message.pubkey,
  });

  // get +1s in the tags (joined by)
  const numberOfPlusOnes = message?.tags?.filter(
    (tag) => tag[0] === "joined_by"
  );

  return (
    <li
      className={`rounded-full bg-slate-100 flex items-center ${message?.content}-status p-1 pr-2`}>
      {message.content === "yes" && (
        <CheckCircleIcon className="h-6 w-6 icon mr-1" />
      )}
      {message.content === "maybe" && (
        <QuestionMarkCircleIcon className="h-6 w-6 icon mr-1" />
      )}
      {message.content === "no" && (
        <XCircleIcon className="h-6 w-6 icon mr-1" />
      )}
      {user.publicKey !== message.pubkey ? (
        <span>{userData?.name}</span>
      ) : (
        <>
          <span>{username}</span>
          <small className="ml-1">(You)</small>
        </>
      )}
      {numberOfPlusOnes.length > 0 && parseInt(numberOfPlusOnes[0][1]) > 0 && (
        <span className="ml-1">+{numberOfPlusOnes[0][1]}</span>
      )}
    </li>
  );
}

RsvpEntry.propTypes = {
  message: PropTypes.shape({
    pubkey: PropTypes.string.isRequired,
    created_at: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

export default RsvpEntry;
