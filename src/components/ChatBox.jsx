import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { guessContentType } from "../utils/getMessageType";

const Message = lazy(() => import("./Message"));
const Reply = lazy(() => import("./Reply"));

import {
  getDatabase,
  set,
  push,
  ref,
  onChildAdded,
  remove,
  onChildRemoved,
} from "firebase/database";

function getChatByID(chats, id) {
  return Object.values(chats).find((chat) => chat.id === id);
}

export default function ChatBox({ user }) {
  // console.log(user);

  const [chats, setChats] = useState([]);
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState(null);

  const inputChatRef = useRef(null);

  const replyingTo = getChatByID(chats, reply);
  // console.log(replyingTo);

  const db = getDatabase();
  const chatListRef = ref(db, "chats");

  const updateHeight = () => {
    const el = document.getElementById("chat");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  const notifyMe = (msg, username) => {
    const options = {
      silent: true,
    };
    if (guessContentType(msg) === "image") {
      options["image"] = msg;
    } else {
      options["body"] = msg;
    }
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      new Notification(username, options);
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          new Notification(username, options);
          // …
        }
      });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    const unsubscribe = onChildAdded(chatListRef, (data) => {
      // console.log(data.val(), data.key);
      setChats((chats) => [...chats, { ...data.val(), id: data.key }]);
      setTimeout(() => {
        updateHeight();
      }, 100);
      if (window.isSecureContext) {
        // console.log("Secure context");
      }

      if (data.val().user.name !== user.name) {
        const username = data.val().user.name;
        const msg = data.val().message;
        // console.log(data.val().user.name, user.name);
        // console.log(user)
        notifyMe(msg, username);
      }
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onChildRemoved(chatListRef, (data) => {
      setChats((chats) => chats.filter((chat) => chat.id !== data.key));
    });
    return () => unsubscribe();
  }, []);

  const sendChat = () => {
    const chatRef = push(chatListRef);
    if (!msg.length) {
      return;
    }
    set(chatRef, {
      user,
      message: msg,
      type: guessContentType(msg),
      repliedTo: reply,
    });

    setMsg("");
    setReply(null);

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        const notif = new Notification("Message sent ");
      }
    });
  };

  const handleReply = (id) => {
    // console.log(id);
    setReply(id);
    inputChatRef.current?.focus();
  };

  const deleteChat = (id) => {
    remove(ref(db, "chats/" + id));
  };

  const cancelReply = () => {
    setReply(null);
  };

  return (
    <div className="flex flex-col justify-between bg-text  relative">
      {user.email ? (
        <div id="chat" className="chat-container px-8 pb-16 ">
          {chats.map((c) => (
            <Message
              {...c}
              isSelfMessage={c.user.email === user.email}
              key={c.id}
              deleteChat={deleteChat}
              id={c.id}
              handleReply={handleReply}
              repliedTo={getChatByID(chats, c.repliedTo)}
            />
          ))}
        </div>
      ) : null}
      {/* Chat INPUT */}
      <div
        className={`pr-8 pl-8 py-2 transition-colors ease-out duration-150 max-w-[1024px] w-full absolute bottom-0 right-0 left-0  mx-auto ${
          replyingTo ? "bg-white" : "bg-background"
        }`}
      >
        {reply ? (
          <Reply
            replyingTo={replyingTo}
            cancelReply={cancelReply}
            isSelfMessage={replyingTo.user.email === user.email}
          />
        ) : null}
        {user.email ? (
          <div className=" bottom-1 w-full flex z-10 gap-4">
            <input
              spellCheck={false}
              ref={inputChatRef}
              className="flex-grow p-4 py-2 rounded-md border-2 border-slate-500"
              type="text"
              placeholder="Enter your message"
              onInput={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? sendChat() : null)}
              value={msg}
            />

            <button
              disabled={!!msg.length == 0}
              className="bg-accent rounded-md  text-sm text-white px-3 font-semibold uppercase disabled:bg-slate-300 disabled:cursor-not-allowed"
              onClick={(e) => sendChat()}
            >
              Send
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
