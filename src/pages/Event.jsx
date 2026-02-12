import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useNostr, useNostrEvents } from "nostr-react";
import { useParams } from "react-router-dom";
import MessageBoard from "components/MessageBoard";
import RsvpForm from "components/RsvpForm";
import RsvpEntries from "components/RsvpEntries";
import LoadingEvent from "components/LoadingEvent";
import {
  getEvent,
  rsvpToEvent,
  postMessageToEvent,
  updateUserProfileIfNameChanged,
} from "helpers/actions";

function Event() {
  const { eventId } = useParams();

  // get user and username from context
  const {
    user,
    setUser,
    username,
    events: eventList,
    setEvents,
  } = useOutletContext();
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
    getEvent(connectedRelays, eventId, setEvent).then((event) => {
      if (!event) return;

      const isInEventList = eventList?.find((e) => e.id === event.id);
      if (!isInEventList) {
        setEvents([...eventList, event]);
      }
    });
  }, [connectedRelays, eventId, eventList, setEvents]);

  // the RSVP action
  const rsvpHandler = async (rsvp) => {
    // make sure user has a profile on nostr
    await updateUserProfileIfNameChanged({
      name: username,
      user,
      setUser,
      publish,
    });
    // send an rsvp to the event
    // @todo: we should only do this, if the user hasn't sent an rsvp yet
    // or maybe we should allow it and see it as an updated rsvp (change from yes to no f.e.)
    await rsvpToEvent({
      rsvp,
      publish,
      publicKey: user.publicKey,
      privateKey: user.privateKey,
      createdEventId: eventId,
    });
  };

  // the comment action
  const messageHandler = async (message) => {
    // make sure the user has a profile on nostr
    await updateUserProfileIfNameChanged({
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
  // @todo: filtering could be better (we filter first on subject tag, then if the message is about this event as switching between events doesn't reload the events variable)
  // @todo: differentiate between yesses, maybes and nos - different lists, how do other pages do that.
  // @todo: i don't understand how timezones work here...
  const rsvpAll = events
    .filter((event) =>
      event.tags.some((tag) => tag[0] === "subject" && tag[1] === "RSVP")
    )
    .filter((event) =>
      event.tags.some((tag) => tag[0] === "e" && tag[1] === eventId)
    );

  // the rsvps of the event
  const rsvps = Object.values(
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
  if (!event || !event.name) {
    return <LoadingEvent />;
  }

  return (
    <div className="flex flex-col gap-10">
      <RsvpForm event={event} rsvpHandler={rsvpHandler} myRsvp={myRsvp} />
      <RsvpEntries rsvps={rsvps} />
      <MessageBoard
        messageHandler={messageHandler}
        messages={messages}
        user={user}
      />
    </div>
  );
}

export default Event;
