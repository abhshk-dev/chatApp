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
  const [chats, setChats] = useState([]);
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState(null);
  const [notifPermission,setPermission]=useState("");

  const inputChatRef = useRef(null);

  const replyingTo = getChatByID(chats, reply);
  console.log(replyingTo);

  const db = getDatabase();
  const chatListRef = ref(db, "chats");

  const updateHeight = () => {
    const el = document.getElementById("chat");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  useEffect( ()=>{
    Notification.requestPermission().then(permission => {
      setPermission(permission);
    })
    
  },[])
  
  useEffect(() => {
    const unsubscribe = onChildAdded(chatListRef, (data) => {
      // console.log(data.val(), data.key);
      setChats((chats) => [...chats, { ...data.val(), id: data.key }]);
     
      // alert("New Message");
      setTimeout(() => {
        updateHeight();
      }, 100);
      if(window.isSecureContext){
        console.log("Secure context")
      }
      if (notifPermission === "granted" && data.val().user.name != user.name){
        console.log('Notification')
        new Notification(data.val().user.name,{
          body:data.val().message,
  
        })
      }
      
  
    });
    return () => unsubscribe();
  }, []);

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
    
  };

  const handleReply = (id) => {
    console.log(id);
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
    <div className="flex flex-col justify-between bg-[#11090d] relative">
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
