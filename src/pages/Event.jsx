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

function Event() {
  const { eventId } = useParams();

  // get user and username from context
  const { user, setUser, username } = useOutletContext();
  const { connectedRelays, publish } = useNostr();

  const [event, setEvent] = useState({});

  // @todo: currently events is not rereloaded when the eventId changes
  const { events } = useNostrEvents({
    filter: {
      since: 0, // all channel/event message events (rsvp + messages)
      kinds: [42],
      "#e": [eventId],
    },
  });

  // get the Event data
  useEffect(() => {
    getEvent(connectedRelays, eventId, setEvent);
  }, [connectedRelays, eventId]);

  // the RSVP action
  const rsvpHandler = async (rsvp) => {
    // make sure user has a profile on nostr
    updateUserProfileIfNameChanged({
      name: username,
      user,
      setUser,
      publish,
    });

    // send an rsvp to the event
    // @todo: we should only do this, if the user hasn't sent an rsvp yet
    // or maybe we should allow it and see it as an updated rsvp (change from yes to no f.e.)
    await rsvpToEvent({
      rsvp: rsvp.attending,
      publish,
      publicKey: user.publicKey,
      privateKey: user.privateKey,
      createdEventId: eventId,
    });
  };

  // the comment action
  const messageHandler = async (message) => {
    // make sure the user has a profile on nostr
    updateUserProfileIfNameChanged({
      name: username,
      user,
      setUser,
      publish,
    });

    // send message to the message board
    await postMessageToEvent({
      content: message,
      publish,
      publicKey: user.publicKey,
      privateKey: user.privateKey,
      createdEventId: eventId,
    });
  };

  // rsvps + messages
  // @todo: filtering could be better
  // @todo: only show the last RSVP of a user
  // @todo: differentiate between yesses, maybes and nos
  // @todo: the timestamps of the event/messages/rsvps should probably be checked with the local timezone of user?
  // @todo: get the last RSVP from the visitor/user and show it in the form.
  const RSVP_TAG = ["subject", "RSVP"];

  const rsvp = events.filter((event) =>
    event.tags.some((tag) => tag[0] === RSVP_TAG[0] && tag[1] === RSVP_TAG[1])
  );

  // @todo: maybe mark your own messages?
  const messages = events.filter(
    (event) =>
      !event.tags.some(
        (tag) => tag[0] === RSVP_TAG[0] && tag[1] === RSVP_TAG[1]
      )
  );

  return (
    <div className="flex flex-col gap-10">
      <RsvpForm
        event={event}
        rsvpHandler={rsvpHandler}
        user={user}
        setUser={setUser}
      />

      <ul className="flex flex-wrap gap-2">
        {rsvp.map((rsvp) => (
          <Entry key={rsvp.id} message={rsvp} />
        ))}
      </ul>
      <MessageBoard
        event={event}
        messageHandler={messageHandler}
        messages={messages}
        user={user}
        setUser={setUser}
      />
    </div>
  );
}

// the entries for rsvps, show who is coming
// @todo: separate file is better
function Entry({ message }) {
  // get profile data
  const { data: userData } = useProfile({
    pubkey: message.pubkey,
  });
  return (
    <li className="w-16 h-16 text-xs rounded-full bg-slate-200 flex items-center justify-center border border-blue-900">
      {userData?.name}
    </li>
  );
}

Entry.propTypes = {
  message: PropTypes.shape({
    pubkey: PropTypes.string.isRequired,
    created_at: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

export default Event;
