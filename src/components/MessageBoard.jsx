import { useState } from "react";
import { useProfile } from "nostr-react";
import dayjs from "dayjs";

function MessageBoard({ messages, messageHandler, user, setUser }) {
  const [newMessage, setNewMessage] = useState("");

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleNewMessage = (event) => {
    event.preventDefault();

    messageHandler(newMessage);
    setNewMessage("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-lg font-mono">
      <div className="overflow-y-auto h-64 mb-4">
        <h1 className="font-bold mb-4">💬 Message Board</h1>
        {messages.map((message, index) => (
          <Entry key={index} message={message} />
        ))}
      </div>
      <div className="border-t border-gray-200 my-4"></div>
      <form className="flex flex-col gap-2" onSubmit={handleNewMessage}>
        <input
          type="text"
          value={user.name}
          onChange={(e) =>
            setUser((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-1/3 rounded-full border border-gray-200 py-1 px-4 mb-2"
          placeholder="Name:"
          required
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleNewMessageChange}
            className="flex-1 rounded-full border border-gray-200 py-1 px-4"
            placeholder="Type your message..."
            required
          />
          <button
            type="submit"
            className="rounded-full border border-gray-200 py-1 px-4 hover:bg-sky-800 hover:text-white transition">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

function Entry({ message }) {
  // get profile data
  const { data: userData } = useProfile({
    pubkey: message.pubkey,
  });

  console.log(userData);
  return (
    <div className="border-b border-gray-200 py-2">
      <div className="flex items-end">
        <strong>{userData?.name}</strong>
        <span className="text-gray-500 text-sm ml-auto">
          {dayjs.unix(message.created_at).format("DD.MM.YYYY HH:mm")}
        </span>
      </div>
      <p>{message?.content}</p>
    </div>
  );
}

export default MessageBoard;
