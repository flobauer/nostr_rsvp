import { useState } from 'react';

function MessageBoard() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleNewMessage = (event) => {
    event.preventDefault();
    setMessages([...messages, newMessage]);
    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-lg font-mono">
      <div className="overflow-y-auto h-64 mb-4">
      <h1 className="font-bold">💬 Message Board</h1>
        {messages.map((message, index) => (
          <Entry key={index} text={message} />
        ))}
      </div>
      <form className="flex gap-2" onSubmit={handleNewMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={handleNewMessageChange}
          className="flex-1 rounded-full border border-gray-200 py-1 px-4"
          placeholder="Type your message..."
          required
        />
        <button type="submit" className="rounded-full border border-gray-200 py-1 px-4 hover:bg-sky-800 hover:text-white transition">Send</button>
      </form>
    </div>
  );
}

function Entry({ text }) {
  return (
    <p className="border-b border-gray-200 py-2">{text}</p>
  );
}

export default MessageBoard;