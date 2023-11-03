import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";

import { getPublicKey, generatePrivateKey } from "nostr-tools";

import { useLocalStorage } from "helpers/hooks";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import DropDown from "./components/DropDown";
import Modal from "./components/Modal";

export default function Container() {
  // we store user info + events in local storage
  const [events, setEvents] = useLocalStorage("events", []);
  const [user, setUser] = useLocalStorage("user", null);
  const [username, setUsername] = useLocalStorage("username", "");

  // if somebody wants to use their nostr user, we give the possibility
  const [showNostrSettings, setShowNostrSettings] = useState(false);

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

  const updateProfileHandler = (e) => {
    e.preventDefault();

    // @todo: check if the keys are valid

    setShowNostrSettings(false);
  };

  return (
    <div className="w-full max-w-6xl">
      <nav className="flex mt-4 gap-2 items-center">
        <h1 className="font-mono font-bold text-lg pl-4">Ripidipi</h1>
        <DropDown events={events} setNostrOpen={setShowNostrSettings} />
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
      <Modal open={showNostrSettings} setOpen={setShowNostrSettings}>
        <form className="flex flex-col gap-2" onSubmit={updateProfileHandler}>
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
          <button>Login</button>
        </form>
      </Modal>
    </div>
  );
}
