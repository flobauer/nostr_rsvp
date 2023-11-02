import { dateToUnix } from "nostr-react";
import { SimplePool } from "nostr-tools";

import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import {
  getEventHash,
  getPublicKey,
  getSignature,
  generatePrivateKey,
} from "nostr-tools";

export async function createEvent({ newEvent, publish }) {
  const privateKey = generatePrivateKey();
  const publicKey = getPublicKey(privateKey);

  const event = {
    content: newEvent.description,
    kind: 1,
    tags: [
      ["d", uuidv4()],
      ["name", newEvent.name],
      // Timestamps
      ["start", `${dayjs(newEvent.start).unix()}`],
      ["end", `${dayjs(newEvent.end).unix()}`],

      ["start_tzid", "Europe/Berlin"],
      ["end_tzid", "Europe/Berlin"],

      // Location
      ["location", newEvent.location],
      // ["g", "<geohash>"],

      // Participants
      // [
      //   "p",
      //   "<32-bytes hex of a pubkey>",
      //   "<optional recommended relay URL>",
      //   "<role>",
      // ],
      // [
      //   "p",
      //   "<32-bytes hex of a pubkey>",
      //   "<optional recommended relay URL>",
      //   "<role>",
      // ],

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

  publish(event);

  return {
    ...newEvent,
    ...event,
    publicKey,
    privateKey,
  };
}

export async function getEvent(relays, id, setEvent) {
  const pool = new SimplePool();

  let event = await pool.get(
    relays.map((r) => r.url),
    {
      ids: [id],
    }
  );
  const tempEvent = { description: event.content };

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
}

export async function createChannel({
  name,
  publish,
  personPublicKey,
  personPrivateKey,
  communityPublicKey,
}) {
  const event = {
    content: JSON.stringify({
      name: name,
      about: "Channel belonging to community: " + communityPublicKey,
    }),
    kind: 40,
    tags: [["p", communityPublicKey, ""]],
    created_at: dateToUnix(),
    pubkey: personPublicKey,
  };

  event.id = getEventHash(event);
  event.sig = signEvent(event, personPrivateKey);

  publish(event);

  return event;
}

export async function postToChannel({
  content,
  publish,
  personPublicKey,
  personPrivateKey,
  createChannelEventId,
  respondToPersonId = null,
  respondToMessageId = null,
}) {
  const tags = [];

  // we add the channel
  tags.push(["e", createChannelEventId, "", "root"]);

  // we check if it is a reply
  if (respondToMessageId) {
    tags.push(["e", respondToMessageId, "", "reply"]);
  }
  // we check if a person is given
  if (respondToPersonId) {
    tags.push(["p", respondToPersonId, ""]);
  }

  const event = {
    content,
    kind: 42,
    tags,
    created_at: dateToUnix(),
    pubkey: personPublicKey,
  };

  event.id = getEventHash(event);
  event.sig = signEvent(event, personPrivateKey);

  publish(event);

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
  event.sig = signEvent(event, personPrivateKey);

  publish(event);

  return event;
}
