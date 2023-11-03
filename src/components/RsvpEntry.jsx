import { useProfile } from "nostr-react";
import PropTypes from "prop-types";
import {
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

// the entries for rsvps, show who is coming
// @todo: separate file is better
function RsvpEntry({ message }) {
  // get profile data
  const { data: userData } = useProfile({
    pubkey: message.pubkey,
  });
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
      {userData?.name}
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
