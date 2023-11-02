import React from "react";
import { NostrProvider } from "nostr-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Layout";
import CreateEvent from "./CreateEvent";

const relayUrls = ["wss://nostr-pub.wellorder.net"];

function App() {
  return (
    <NostrProvider relayUrls={relayUrls} debug={true}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<CreateEvent />} />
            {/* <Route path=":eventId" element={<Event />} /> */}
            <Route path="*" element={<div>404</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NostrProvider>
  );
}

export default App;
