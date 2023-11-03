import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";

import { getPublicKey, generatePrivateKey } from "nostr-tools";

import { useLocalStorage } from "helpers/hooks";

import {
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";

export default function Container() {
  // we store user info + events in local storage
  const [events, setEvents] = useLocalStorage("events", []);
  const [user, setUser] = useLocalStorage("user", null);
  const [username, setUsername] = useLocalStorage("username", "");

  // if somebody wants to use their nostr user, we give the possibility
  const [showNostrSettings, setShowNostrSettings] = useState(false);

  const [showEventsDropdown, setShowEventsDropdown] = useState(false);

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
    <div className="w-full max-w-6xl">
      <nav className="md:flex mt-4 gap-2 items-center">
        <div className="flex justify-end">
          <button
            onClick={() => setShowNostrSettings(!showNostrSettings)}
            className="text-xl font-semibold mb-4 cursor-pointer"
          >
            Already a Nostr User?{" "}
            {showNostrSettings ? (
              <ChevronUpIcon className="h-4 w-4 icon inline" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 icon inline" />
            )}
          </button>
        </div>
        {showNostrSettings && (
          <div className="flex flex-col gap-2 border-t md:mt-0 card">
            <label>Public Key</label>
            <input
              value={user.publicKey}
              onChange={(e) => setUser({ ...user, publicKey: e.target.value })}
            />
            <label>Private Key</label>
            <input
              value={user.privateKey}
              onChange={(e) => setUser({ ...user, privateKey: e.target.value })}
            />
          </div>
        )}
        <div className="flex-grow">
          <div className="flex justify-end items-center">
            <div
              className="text-xl font-semibold mb-4 cursor-pointer"
              onClick={() => setShowEventsDropdown(!showEventsDropdown)}
            >
              Your Events{" "}
              {showEventsDropdown ? (
                <ChevronUpIcon className="h-4 w-4 icon inline" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 icon inline" />
              )}
            </div>
          </div>
          {showEventsDropdown && (
            <ul className="flex justify-end card">
              {events.map((event) => (
                <li key={event.id} className="mb-2">
                  <Link
                    className="text-blue-600 hover:text-blue-800"
                    to={`/${event.id}`}
                  >
                    {JSON.parse(event.content).name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-end">
            {" "}
            <Link to="/" className="text-xl font-semibold mb-4 cursor-pointer">
              Create Event <ChevronDownIcon className="h-4 w-4 icon inline" />
            </Link>
          </div>
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
