import { useEffect, useState } from "react";
import { getDatabase, set, push, ref, onChildAdded } from "firebase/database";

function App() {
  const [name, setName] = useState("");
  const [chats, setChats] = useState([]);

  const [msg, setMsg] = useState("");

  const db = getDatabase();
  const chatListRef = ref(db, "chats");

  const updateHeight = () => {
    const el = document.getElementById("chat");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  useEffect(() => {
    onChildAdded(chatListRef, (data) => {
      setChats((chats) => [...chats, data.val()]);
      setTimeout(() => {
        updateHeight();
      }, 100);
    });
  }, []);

  const sendChat = () => {
    const chatRef = push(chatListRef);
    set(chatRef, {
      name,
      message: msg,
    });

    // const c = [...chats];
    // c.push({ name, message: msg });
    // setChats(c);
    setMsg("");
  };

  return (
    <>
      <div className=" text-center bg-slate-500  py-4 ">
        <h1 className="text-4xl font-semibold text-white">Chat App </h1>
      </div>
      {name ? null : (
        <div className="flex flex-col ">
          <label className="m-2 text-lg font-medium" htmlFor="name">
            Your name:
          </label>
          <input
            className="border-2 border-gray-400 my-6 mt-0 p-2"
            type="text"
            placeholder="Enter your name"
            onBlur={(e) => setName(e.target.value)}
          />
        </div>
      )}
      {name ? (
        <span className="text-xl font-bold inline-block my-10">
          User:<strong className="text-lg font-light">{name}</strong>
        </span>
      ) : null}

      {name ? (
        <div id="chat" className="chat-container ">
          {chats.map((c, i) => (
            <div
              key={i}
              className={`container ${c.name === name ? "me" : ""} `}
            >
              <p className="chatbox ">
                <strong>{c.name}:</strong>
                <span>{c.message}</span>
              </p>
            </div>
          ))}

          {/* Chat INPUT */}

          <div className="lg:fixed bottom-1 w-full flex z-10">
            <input
              className="flex-grow p-4 border-2 border-slate-500"
              type="text"
              placeholder="enter your message"
              onInput={(e) => setMsg(e.target.value)}
              value={msg}
            />
            <button onClick={(e) => sendChat()}>send</button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default App;
