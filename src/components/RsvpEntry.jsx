import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import PropTypes from "prop-types";
import { useNostr, useNostrEvents, useProfile } from "nostr-react";
import { useParams } from "react-router-dom";
import MessageBoard from "components/MessageBoard";
import RsvpForm from "components/RsvpForm";
import {
  getEvent,
  rsvpToEvent,
  postMessageToEvent,
  updateUserProfileIfNameChanged,
} from "helpers/actions";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

// the entries for rsvps, show who is coming
// @todo: separate file is better
function RsvpEntry({ message }) {
  // get profile data
  const { data: userData } = useProfile({
    pubkey: message.pubkey,
  });
  return (
    <li
      className={`text-xs rounded-full bg-slate-100 flex items-center ${message?.content}-status p-1`}>
      <CheckCircleIcon className="h-4 w-4 icon mr-1" />
      {userData?.name} ({message?.content})
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
