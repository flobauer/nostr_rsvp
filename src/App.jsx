import { NostrProvider } from "nostr-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Container from "./Container";
import CreateEvent from "pages/CreateEvent";
import Event from "pages/Event";

// this might make sense to make configurable
const relayUrls = [
  "wss://nostr-pub.wellorder.net",
  "wss://nostr.heavyrubberslave.com",
  "wss://nostr01.counterclockwise.io",
  "wss://nostr.gleeze.com",
  "wss://relay.spacetomatoes.net",
  "wss://community.nostrdvm.com",
  "wss://onlynostr.club",
];

function App() {
  return (
    <NostrProvider relayUrls={relayUrls} debug={true}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Container />}>
            <Route index element={<CreateEvent />} />
            <Route path=":eventId" element={<Event />} />
            <Route path="*" element={<div>404</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NostrProvider>
  );
}

export default App;
