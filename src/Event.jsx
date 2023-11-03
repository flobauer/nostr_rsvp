import { useState, useEffect } from "react";
import { useNostr, useNostrEvents, useProfile } from "nostr-react";
import { useParams } from "react-router-dom";
import MessageBoard from "./components/MessageBoard";
import RsvpForm from "./components/RsvpForm";
import {
  getEvent,
  rsvpToEvent,
  postMessageToEvent,
  updateUserProfile,
} from "./helpers/actions";
import { useLocalStorage } from "./helpers/hooks";

function Event() {
  const { eventId } = useParams();

  const [user, setUser] = useLocalStorage("user", {});

  const [event, setEvent] = useState({});

  const { connectedRelays, publish } = useNostr();

  const { events } = useNostrEvents({
    filter: {
      since: 0, // all channel creation events
      kinds: [42],
      "#e": [eventId],
    },
  });

  const rsvpHandler = async () => {
    // make sure user has a profile on nostr
    await updateUserProfile({
      user,
      publish,
    });

    await rsvpToEvent({
      rsvp: "Yes",
      publish,
      publicKey: user.publicKey,
      privateKey: user.privateKey,
      createdEventId: eventId,
    });
  };

  const messageHandler = async (message) => {
    await updateUserProfile({
      user,
      publish,
    });

    await postMessageToEvent({
      content: message,
      publish,
      publicKey: user.publicKey,
      privateKey: user.privateKey,
      createdEventId: eventId,
    });
  };

  useEffect(() => {
    getEvent(connectedRelays, eventId, setEvent);
  }, [connectedRelays, eventId]);

  // rsvps
  const rsvp = events.filter((event) => event.content === "Yes");
  const messages = events.filter((event) => event.content !== "Yes");

  return (
    <div className="flex flex-col gap-10">
      <RsvpForm
        event={event}
        rsvpHandler={rsvpHandler}
        user={user}
        setUser={setUser}
      />

      <ul className="flex">
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

function Entry({ message }) {
  // get profile data
  const { data: userData } = useProfile({
    pubkey: message.pubkey,
  });

  console.log(userData);
  return (
    <li className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center border border-blue-900">
      {userData?.name}
    </li>
  );
}

export default Event;
