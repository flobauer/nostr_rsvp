import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";

import { getPublicKey, generatePrivateKey } from "nostr-tools";

import { useLocalStorage } from "helpers/hooks";

export default function Container() {
  // we store user info + events in local storage
  const [events, setEvents] = useLocalStorage("events", []);
  const [user, setUser] = useLocalStorage("user", null);
  const [username, setUsername] = useLocalStorage("username", "");

  // if somebody wants to use their nostr user, we give the possibility
  const [showNostrSettings, setShowNostrSettings] = useState(false);

  // @todo:
  // when a user visits an event, we should add it to their list of events

  // if there is no user, we automatically generate a new one
  useEffect(() => {
    if (!user || user.privateKey === "" || user.publicKey === "") {
      const privateKey = generatePrivateKey();
      const publicKey = getPublicKey(privateKey);

      setUser({
        name: username,
        publicKey,
        privateKey,
      });
    }
  }, [user, username, setUser]);

  return (
    <div className="grid grid-cols-3 w-full max-w-6xl">
      <nav>
        <h3>Your Events</h3>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <Link className="text-blue-600 underline" to={`/${event.id}`}>
                {JSON.parse(event.content).name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 border-t">
          <button
            className="text-left"
            onClick={() => setShowNostrSettings((prev) => !prev)}>
            Already a Nostr User?
          </button>
          {showNostrSettings && (
            <>
              <label>Public Key</label>
              <input
                value={user.publicKey}
                onChange={(e) =>
                  setUser({ ...user, publicKey: e.target.value })
                }
              />
              <label>Private Key</label>
              <input
                value={user.privateKey}
                onChange={(e) =>
                  setUser({ ...user, privateKey: e.target.value })
                }
              />
            </>
          )}
        </div>
      </nav>

      <main className="col-span-2">
        <div className="">
          <Outlet
            context={{
              events,
              setEvents,
              user,
              setUser,
              username,
              setUsername,
            }}
          />
        </div>
      </main>
    </div>
  );
}
