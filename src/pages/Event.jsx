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
  // @todo: filtering could be better (we filter first on subject tag, then if the message is about this event)
  // @todo: differentiate between yesses, maybes and nos
  // @todo: the timestamps of the event/messages/rsvps should probably be checked with the local timezone of user?
  // @todo: get the last RSVP from the visitor/user and show it in the form.
  const rsvpAll = events
    .filter((event) =>
      event.tags.some((tag) => tag[0] === "subject" && tag[1] === "RSVP")
    )
    .filter((event) =>
      event.tags.some((tag) => tag[0] === "e" && tag[1] === eventId)
    );

  // the rsvps of the event
  const rsvp = Object.values(
    rsvpAll.reduce((acc, event) => {
      // Assuming `event.created_at` or a similar property is the timestamp
      // and `event.pubKey` is the property you want to use to check for duplicates.
      const existingEvent = acc[event.pubkey];
      if (
        !existingEvent ||
        new Date(event.created_at) > new Date(existingEvent.created_at)
      ) {
        acc[event.pubkey] = event;
      }
      return acc;
    }, {})
  );

  // my last rsvp
  const myRsvp = rsvpAll.find((rsvp) => rsvp.pubkey === user.publicKey);

  // @todo: maybe mark your own messages?
  const messages = events
    .filter(
      (event) =>
        !event.tags.some((tag) => tag[0] === "subject" && tag[1] === "RSVP")
    )
    .filter((event) =>
      event.tags.some((tag) => tag[0] === "e" && tag[1] === eventId)
    );

  return (
    <div className="flex flex-col gap-10">
      <RsvpForm event={event} rsvpHandler={rsvpHandler} myRsvp={myRsvp} />

      <ul className="flex flex-wrap -space-x-4">
        {rsvp.map((rsvp) => (
          <Entry key={rsvp.id} message={rsvp} />
        ))}
      </ul>
      <MessageBoard
        event={event}
        messageHandler={messageHandler}
        messages={messages}
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
    <li
      className={`w-24 h-24 text-xs rounded-full bg-slate-200 flex items-center justify-center text-center border-4 border-white ${message?.content}-status`}>
      {userData?.name} ({message?.content})
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