import { useRef } from "react";
import { useNostrEvents, dateToUnix } from "nostr-react";

export default function Channel() {
  // yesterday
  const now = useRef(new Date(Date.now() - 0.5 * 60 * 60 * 1000));

  const { events } = useNostrEvents({
    filter: {
      since: dateToUnix(now.current), // all new events from now
      kinds: [1],
    },
  });

  return (
    <>
      {events
        .sort((a, b) => a.created_at - b.created_at)
        .map((event, index) => (
          <li key={event.pubKey}>{JSON.stringify(event)}</li>
        ))}
    </>
  );
}
