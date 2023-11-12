import { guessContentType } from "../utils/getMessageType";

const renderMessage = (message, type) => {
  switch (type) {
    // TODO: Handle image|gif type
    case "link":
      return (
        <a
          href={message}
          target="_blank"
          className="pl-1 underline text-blue-500"
        >
          {message}
        </a>
      );
    case "text":
    default:
      return <span className="pl-1">{message}</span>;
  }
};

/**
 * Render the message component based on the type of the message
 *
 * @component
 * @example
 * <Message {...message} />
 */
const Message = ({ message, type, user, isSelfMessage, deleteChat, id }) => {
  return (
    <div className={`container ${isSelfMessage ? "me" : ""}`}>
      <p className="chatbox">
        <strong>{user.name}: </strong>
        {renderMessage(message, type || guessContentType(message))}
        {isSelfMessage ? <span onClick={() => deleteChat(id)}>🗑️</span> : null}
      </p>
    </div>
  );
};

export default Message;
