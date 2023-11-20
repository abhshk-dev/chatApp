import { guessContentType } from "../utils/getMessageType";
import { useState } from "react";
import Menu from "./Menu";

const renderMessage = (message, type, repliedMessage = false) => {
  switch (type) {
    // TODO: Handle image|gif type
    case "image":
      return (
        <div className={`${repliedMessage ? 'max-w-[60px] max-h-[60px] mt-0 ml-2 ' : 'max-w-[200px] max-h-[200px] mt-4'} bg-text flex  rounded-md`} >
          <img className={`w-full object-contain ${repliedMessage ? 'rounded-none':'rounded-md'} `}  src={message} />
        </div>
      );
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
      return <span className={`${repliedMessage ? " p-1 px-3 opacity-80 line-clamp ml-2" : "pl-1"}`}>{message}</span>;
  }
};

/**
 * Render the message component based on the type of the message
 *
 * @component
 * @example
 * <Message {...message} />
 */
const Message = ({
  message,
  type,
  user,
  isSelfMessage,
  deleteChat,
  id,
  handleReply,
  repliedTo,
}) => {
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
        {repliedTo ? (
          <div className="parent">
            <div className={`sender relative before:absolute before:h-full before:w-2 before:bg-gray-800 before:bg-opacity-50 bg-background rounded-lg overflow-hidden mb-2 `}>
              {renderMessage(repliedTo.message,repliedTo.type || guessContentType(repliedTo.message), true)}  
            </div> 
          </div>
        ) : null}
        <strong className="text-text opacity-90 font-semibold">{user.name}: </strong>
        {renderMessage(message, type || guessContentType(message))}

        {/* {isSelfMessage ? (
          <span className="cursor-pointer" onClick={() => deleteChat(id)}>
            🗑️
          </span>
          ) : null} */}

        

        {showMenu ? (
          <Menu
            deleteChat={deleteChat}
            id={id}
            isSelfMessage={isSelfMessage}
            showMenu={showMenu}
            handleReply={handleReply}
            
          />
        ) : null}
      </div>
    </div>
  );
};

export default Message;
