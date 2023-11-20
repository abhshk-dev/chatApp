import { guessContentType } from "../utils/getMessageType";
import { useState } from "react";
import Menu from "./Menu";

const renderMessage = (message, type) => {
  switch (type) {
    // TODO: Handle image|gif type
    case "image":
      
      return <div className="max-w-[200px] max-h-[200px] bg-text flex mt-4 rounded-md"><img className="w-full object-contain  rounded-lg " src={message}  /></div>  
    case "link":
      return (
        <a
          href={message}
          target="_blank"
          className="pl-1 underline text-blue-600"
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
  const [showMenu, setShowMenu] = useState(false);

  const handleEnter = (e) => {
    e.stopPropagation();
    setShowMenu(true);
  };

  const handleLeave = (e) => {
    e.stopPropagation();
    setShowMenu(false);
  };
  return (
    <div className={`container ${isSelfMessage ? "me" : ""}`}>
      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="chatbox "
      >
        <strong className="text-[#11090d] font-semibold">{user.name}: </strong>
        {renderMessage(message, type || guessContentType(message))}

        {/* {isSelfMessage ? (
          <span className="cursor-pointer" onClick={() => deleteChat(id)}>
            🗑️
          </span>
          ) : null} */}

        {showMenu ? (
          <Menu deleteChat={deleteChat} id={id} isSelfMessage={isSelfMessage} showMenu={showMenu} />
        ) : null}
      </div>
    </div>
  );
};

export default Message;
