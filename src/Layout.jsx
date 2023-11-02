import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";

import { useLocalStorage } from "./helpers/hooks";
import { useProfile, useNostrEvents, useNostr } from "nostr-react";

export default function Layout() {
  // we store the events the user is subscribed to in local storage
  const [storedEvents, setStoredEvents] = useLocalStorage("stored_events", []);

  return (
    <div className="grid grid-cols-2 w-full max-w-6xl">
      <nav className="">
        <h3>Your Events</h3>
        <ul>
          {storedEvents.map((storedEvent) => (
            <li
              key={storedEvent.pubkey}
              className="rounded-2xl border w-12 h-12 border-stone-700 bg-stone-600 flex items-center justify-center">
              <Link to={`/${storedEvent.pubkey}`}>{storedEvent.name}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <main className="">
        <div className="">
          <Outlet context={{ storedEvents, setStoredEvents }} />
        </div>
      </main>
    </div>
  );
}
