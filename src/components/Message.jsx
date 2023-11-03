import PropTypes from "prop-types";
import { useOutletContext } from "react-router-dom";
import { useProfile } from "nostr-react";
import dayjs from "dayjs";

function Message({ message }) {
  const { user, username } = useOutletContext();
  // get profile data
  const { data: userData } = useProfile({
    pubkey: message.pubkey,
  });

  // @todo: reactions to messages would be cool i think

  return (
    <div className="border-b border-gray-200 py-2">
      <div className="flex items-end">
        <strong>
          {user.publicKey !== message.pubkey ? (
            <span>{userData?.name}</span>
          ) : (
            <>
              <span>{username}</span>
              <small>(You)</small>
            </>
          )}
        </strong>
        <span className="text-gray-500 text-sm ml-auto">
          {dayjs.unix(message.created_at).format("DD.MM.YYYY HH:mm")}
        </span>
      </div>
      <p>{message?.content}</p>
    </div>
  );
}

Message.propTypes = {
  message: PropTypes.shape({
    pubkey: PropTypes.string.isRequired,
    created_at: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

export default Message;
