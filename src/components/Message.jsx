import { guessContentType } from "../utils/getMessageType";
import { useRef, useState, useEffect } from "react";
import Menu from "./Menu";
import EmojiMenu from "./EmojiMenu";

const renderMessage = (message, type, repliedMessage = false) => {
  switch (type) {
    // TODO: Handle image|gif type
    case "image":
      return (
        <div
          className={`${
            repliedMessage
              ? "max-w-[60px] max-h-[60px] mt-0 ml-2 "
              : "max-w-[200px] max-h-[200px] mt-4"
          } bg-text flex  rounded-md`}
        >
          <img
            className={`w-full object-contain ${
              repliedMessage ? "rounded-none" : "rounded-md"
            } `}
            src={message}
          />
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
      return (
        <span
          className={`${
            repliedMessage ? " p-1 px-3 opacity-80 line-clamp ml-2" : "pl-1"
          } break-words`}
        >
          {message}
        </span>
      );
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
  const [emojiMenu, setEmojiMenu] = useState(false);
  const [reaction, setReaction] = useState([]);
  const messageRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setEmojiMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleEnter = (e) => {
    e.stopPropagation();
    setShowMenu(true);
  };

  const handleLeave = (e) => {
    e.stopPropagation();
    setShowMenu(false);
  };

  const handleReact = () => {
    setEmojiMenu(!emojiMenu);
  };
  return (
    <div className={`container  ${isSelfMessage ? "me" : ""}`}>
      <div className="chatbox " ref={messageRef} onMouseLeave={handleLeave}>
        <div onMouseEnter={handleEnter}>
          {repliedTo ? (
            <div className="parent">
              <div
                className={`sender relative before:absolute before:h-full before:w-2 before:bg-gray-800 before:bg-opacity-50 bg-background rounded-lg overflow-hidden mb-2 `}
              >
                {renderMessage(
                  repliedTo.message,
                  repliedTo.type || guessContentType(repliedTo.message),
                  true
                )}
              </div>
            </div>
          ) : null}
          <strong className="text-text opacity-90 font-semibold">
            {user.name}:{" "}
          </strong>
          {renderMessage(message, type || guessContentType(message))}
          {showMenu ? (
            <Menu
              deleteChat={deleteChat}
              id={id}
              isSelfMessage={isSelfMessage}
              showMenu={showMenu}
              handleReply={handleReply}
              handleReact={handleReact}
            />
          ) : null}
        </div>
        {emojiMenu ? <EmojiMenu isSelfMessage={isSelfMessage} /> : null}
      </div>
    </div>
  );
};

export default Message;
