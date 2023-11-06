import { useEffect, useState } from "react";
import {
  getDatabase,
  set,
  push,
  ref,
  onChildAdded,
  remove,
  onChildRemoved,
} from "firebase/database";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function App() {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const googleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        setUser({ name: result.user.displayName, email: result.user.email });
        console.log(token, user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const [user, setUser] = useState("");
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
    const unsubscribe = onChildAdded(chatListRef, (data) => {
      console.log(data.val(), data.key);
      setChats((chats) => [...chats, { ...data.val(), id: data.key }]);

      setTimeout(() => {
        updateHeight();
      }, 100);
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
    });

    // const c = [...chats];
    // c.push({ name, message: msg });
    // setChats(c);
    setMsg("");
  };

  const deleteChat = (id) => {
    remove(ref(db, "chats/" + id));
  };

  // console.log(chats);

  return (
    <>
      <div className=" text-center bg-slate-500  py-4 ">
        <h1 className="text-4xl font-semibold text-white">Chat App </h1>
      </div>
      {user.email ? null : (
        <div
          onClick={(e) => {
            googleLogin();
          }}
          className=" cursor-pointer flex items-center justify-center gap-6 max-w-[300px] lg:max-w-[450px] mt-[40%] lg:mt-[10%]  mx-auto border-[1px] border-gray-300 shadow-md rounded-md p-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 262"
            id="google"
          >
            <path
              fill="#4285F4"
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            ></path>
            <path
              fill="#34A853"
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            ></path>
            <path
              fill="#FBBC05"
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
            ></path>
            <path
              fill="#EB4335"
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            ></path>
          </svg>

          <button className="font-semibold text-[#232323] lg:text-lg ">
            Sign up with Google
          </button>
        </div>
      )}
      {user.email ? (
        <span className="text-xl font-bold inline-block my-10">
          User:<strong className="text-lg font-light">{user.name}</strong>
        </span>
      ) : null}
      <div className="flex flex-col justify-between">
        {user.email ? (
          <div id="chat" className="chat-container ">
            {chats.map((c, i) => (
              <div
                key={i}
                className={`container ${
                  c.user.email === user.email ? "me" : ""
                } `}
              >
                <p className="chatbox ">
                  <strong>{c.user.name}: </strong>
                  <span className="pl-1">{c.message}</span>
                  {user.name === c.user.name ? (
                    <span onClick={() => deleteChat(c.id)}>🗑️</span>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        ) : null}
        {/* Chat INPUT */}
        {user.email ? (
          <div className="fixed bottom-1 w-full flex z-10">
            <input
              className="flex-grow p-4 border-2 border-slate-500"
              type="text"
              placeholder="enter your message"
              onInput={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? sendChat() : null)}
              value={msg}
            />

            <button
              disabled={!!msg.length == 0}
              className="bg-slate-500 text-sm text-white px-3 font-semibold uppercase disabled:bg-slate-300 disabled:cursor-not-allowed"
              onClick={(e) => sendChat()}
            >
              Send
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default App;
