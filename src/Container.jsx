import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { getPublicKey, generatePrivateKey } from "nostr-tools";

import { useLocalStorage } from "helpers/hooks";

import DropDown from "./components/DropDown";
import Modal from "./components/Modal";
import Features from "components/Features";

export default function Container() {
  // we store user info + events in local storage
  const [events, setEvents] = useLocalStorage("events", []);
  const [user, setUser] = useLocalStorage("user", null);
  const [username, setUsername] = useLocalStorage("username", "");

  // get location
  const location = useLocation();

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

  useEffect(() => {
    const standalone = window.navigator.standalone;
    const userAgent = window.navigator.userAgent.toLowerCase();
    const safari = /safari/.test(userAgent);
    const ios = /iphone|ipod|ipad/.test(userAgent);

    if (ios) {
      if (!standalone && safari) {
        // Safari
      } else if (!standalone && !safari) {
        // iOS webview
        if (
          confirm("For better experience please open the site in the Browser.")
        ) {
          window.open(location.href, "_blank");
        }
      }
    } else {
      if (userAgent.includes("wv")) {
        // Android webview
        alert("For better experience please open the site in the Browser.");
        window.open(location.href, "_blank");
      } else {
        // Chrome
      }
    }
  }, [location]);

  const updateProfileHandler = (e) => {
    e.preventDefault();

    // @todo: check if the keys are valid

    setShowNostrSettings(false);
  };

  const removeEventHandler = (e, event) => {
    e.preventDefault();

    if (!confirm("Are you sure you want to remove this event?")) return;

    setEvents((prev) => prev.filter((ee) => ee.id !== event.id));
  };

  const generateHandler = (e) => {
    e.preventDefault();

    if (!confirm("Are you sure you want to generate new credentials?")) return;

    const privateKey = generatePrivateKey();
    const publicKey = getPublicKey(privateKey);

    setUser({
      name: username,
      publicKey,
      privateKey,
    });
  };

  return (
    <div className="w-full">
      <nav className="flex items-center max-w-5xl gap-2 mx-auto mt-4">
        <Link
          className="flex items-center pl-4 font-mono text-lg font-bold text-gray-800"
          to="/">
          <img src="/pizza2.png" className="w-12 h-12" />
          RSVPlease
        </Link>
        <DropDown
          events={events}
          setNostrOpen={setShowNostrSettings}
          removeEventHandler={removeEventHandler}
        />
      </nav>

      <main className="max-w-5xl mx-auto">
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

      {location.pathname === "/" && <Features />}
      <footer className="max-w-5xl pb-16 mx-auto">
        <p className="px-4 pt-4 italic text-gray-600">
          This application runs on the nostr protocol, which is a decentralized
          and cencorship resistant protocol on the internet. If you want to
          learn more about nostr, check out{" "}
          <a
            href="https://nostr.com"
            className="underline"
            target="_blank"
            rel="noreferrer">
            nostr.com
          </a>
          . Just remember, what you share is public for everyone to see, so
          think before you post.
        </p>
        <p className="px-4 py-2 italic text-gray-600">
          Made by{" "}
          <a
            target="_blank"
            rel="noreferrer"
            className="underline"
            href="https://github.com/flobauer">
            flobauer
          </a>{" "}
          &{" "}
          <a
            target="_blank"
            rel="noreferrer"
            className="underline"
            href="https://github.com/mtsarah">
            mtsarah
          </a>{" "}
          in Vienna.{" "}
          <a
            target="_blank"
            rel="noreferrer"
            className="underline"
            href="https://github.com/flobauer/nostr_rsvp">
            Sourcecode on Github
          </a>
        </p>
      </footer>
      <Modal open={showNostrSettings} setOpen={setShowNostrSettings}>
        <form
          className="flex flex-col gap-2 font-mono"
          onSubmit={updateProfileHandler}>
          <h1 className="text-lg font-bold">Nostr Settings</h1>
          <p className="font-sans text-sm text-gray-800">
            The Nostr protocol, short for "Notes and Other Stuff Transmitted by
            Relays," is a digital communication system designed to be simple and
            open. This system ensures that no single company or server has
            control over the conversation, championing the freedom of speech and
            making sure that your ability to communicate isn't easily shut down
            by any one entity.
          </p>
          <p className="mb-4 font-sans text-sm text-gray-800">
            That said, it is also transparent, which means that this event and
            everybody joining it is somewhere in the protocol. If you want to
            learn more about Nostr, check out{" "}
            <a
              href="https://nostr.com"
              className="text-purple-800 underline"
              target="_blank"
              rel="noreferrer">
              nostr.com
            </a>
            .
          </p>
          <label className="font-bold">Public Key</label>
          <input
            className="input"
            value={user?.publicKey}
            onChange={(e) => setUser({ ...user, publicKey: e.target.value })}
          />
          <label className="mt-4 font-bold">Private Key</label>
          <input
            type="password"
            className="input"
            value={user?.privateKey}
            onChange={(e) => setUser({ ...user, privateKey: e.target.value })}
          />
          <button className="text-white bg-sky-600 input">
            Save Nostr Credentials
          </button>
          <button className="text-sky-600 input" onClick={generateHandler}>
            Generate new Credentials
          </button>
        </form>
      </Modal>
    </div>
  );
}
