import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import PropTypes from "prop-types";
import Message from "./Message";

function MessageBoard({ messages, messageHandler }) {
  const [newMessage, setNewMessage] = useState("");

  const { username, setUsername } = useOutletContext();

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleNewMessage = (e) => {
    e.preventDefault();
    messageHandler(newMessage);
    setNewMessage("");
  };

  // @todo: we could add a "loading" state here (suspense)
  // @todo: maybe do answer to messages, we have that functionality in messagehandler

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-lg font-mono">
      <div className="overflow-y-auto h-64 mb-4">
        <h1 className="font-bold mb-4">💬 Message Board</h1>
        <hr className="my-2" />
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
      <div className="border-t border-gray-200 my-4"></div>
      <form className="flex flex-col gap-2" onSubmit={handleNewMessage}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

MessageBoard.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string,
      created: PropTypes.string,
      pubkey: PropTypes.string,
    })
  ),
  messageHandler: PropTypes.func,
};

export default MessageBoard;
