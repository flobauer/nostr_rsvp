import { dateToUnix } from "nostr-react";
import { SimplePool } from "nostr-tools";

import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import { getEventHash, getSignature } from "nostr-tools";

export async function updateUserProfileIfNameChanged({
  name,
  user,
  setUser,
  publish,
}) {
  // if nothing changed, we do not need to update
  if (name === user.name) {
    return;
  }

  // name changed, we update the users profile
  const event = {
    content: JSON.stringify({
      name,
    }),
    kind: 0,
    tags: [],
    created_at: dateToUnix(),
    pubkey: user.publicKey,
  };

  event.id = getEventHash(event);
  event.sig = getSignature(event, user.privateKey);

  publish(event);

  // name changed, we update the user
  setUser((prev) => ({ ...prev, name }));

  return event;
}

export async function createEvent({ data, publish, publicKey, privateKey }) {
  // there is a NIP draft for calendar entries that we could use
  // https://github.com/nostr-protocol/nips/blob/master/52.md
  // for content we use the kind 40 (channels) and their recommended structure.
  // we use channel format for now
  const event = {
    content: JSON.stringify({
      name: data.name,
      about: data.description,
    }),
    kind: 40,
    tags: [
      ["d", uuidv4()],
      ["name", data.name],
      // Timestamps
      ["start", `${dayjs(data.start).unix()}`],
      ["end", `${dayjs(data.end).unix()}`],

      ["start_tzid", "Europe/Berlin"], // I am uncertain what that actually does
      ["end_tzid", "Europe/Berlin"], // I am uncertain what that actually does

      // Location
      ["location", data.location], // @todo: we could add geocache here
      // ["g", "<geohash>"],

      // Add Admin as participant
      ["p", publicKey, "", "admin"],

      // Hashtags
      // ["t", "<tag>"],
      // ["t", "<tag>"],

      // Reference links
      // ["r", "<url>"],
      // ["r", "<url>"],
    ],
    created_at: dateToUnix(),
    pubkey: publicKey,
  };

  event.id = getEventHash(event);
  event.sig = getSignature(event, privateKey);

  await publish(event);

  return event;
}

export async function getEvent(relays, id, setEvent) {
  const pool = new SimplePool();

  let event = await pool.get(
    relays.map((r) => r.url),
    {
      ids: [id],
    }
  );

  if (!event) {
    return;
  }

  const parts = JSON.parse(event.content);
  const tempEvent = { name: parts.name, description: parts.about };

  event.tags.forEach((tag) => {
    if (tag[0] === "name") {
      tempEvent.name = tag[1];
    }

    if (tag[0] === "start") {
      tempEvent.start = dayjs.unix(tag[1]);
    }

    if (tag[0] === "end") {
      tempEvent.end = dayjs.unix(tag[1]);
    }

    if (tag[0] === "location") {
      tempEvent.location = tag[1];
    }
  });

  setEvent(tempEvent);

  return event;
}

export async function rsvpToEvent({
  rsvp,
  publish,
  publicKey,
  privateKey,
  createdEventId,
}) {
  const tags = [];

  // we use subject tag for RSVP (@todo - check that, feels wrong)
  tags.push(["subject", "RSVP"]);

  // this is not in the standard, but we use it to indicate the number of guests
  if (rsvp.guests > 0) {
    tags.push(["joined_by", rsvp.guests]);
  }

  // we add the channel/event
  tags.push(["e", createdEventId, "", "root"]);

  const event = {
    content: rsvp.attending,
    kind: 42,
    tags,
    created_at: dateToUnix(),
    pubkey: publicKey,
  };

  event.id = getEventHash(event);
  event.sig = getSignature(event, privateKey);

  await publish(event);

  return event;
}

export async function postMessageToEvent({
  content,
  publish,
  publicKey,
  privateKey,
  createdEventId,
  respondToPersonId = null,
  respondToMessageId = null,
}) {
  const tags = [];

  // we add the channel/event
  tags.push(["e", createdEventId, "", "root"]);

  // we check if it is a reply
  if (respondToMessageId) {
    tags.push(["e", respondToMessageId, "", "reply"]);
  }
  // we check if a person is given (could be answers to messages then)
  if (respondToPersonId) {
    tags.push(["p", respondToPersonId, ""]);
  }

  const event = {
    content,
    kind: 42,
    tags,
    created_at: dateToUnix(),
    pubkey: publicKey,
  };

  event.id = getEventHash(event);
  event.sig = getSignature(event, privateKey);

  await publish(event);

  return event;
}

export async function reactToMessage({
  reaction,
  publish,
  personPublicKey,
  personPrivateKey,
  messageId,
  respondToPersonId,
}) {
  const tags = [
    ["e", messageId, ""],
    ["p", respondToPersonId],
  ];

  const event = {
    content: reaction,
    kind: 7,
    tags,
    created_at: dateToUnix(),
    pubkey: personPublicKey,
  };

  event.id = getEventHash(event);
  event.sig = getSignature(event, personPrivateKey);

  await publish(event);

  return event;
}
