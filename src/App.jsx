import { Route } from "wouter";
import { useEffect, useState, lazy, Suspense } from "react";
import useLocation from "wouter/use-location";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const SignupPage = lazy(() => import("./components/SignupPage"));
const ChatBox = lazy(() => import("./components/ChatBox"));

function App() {
  const [user, setUser] = useState("");
  const [location, setLocation] = useLocation();
  // console.log(chats);
  const auth = getAuth();

  useEffect(() => {
   const unsubscribe= onAuthStateChanged(auth, (user) => {
      
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // const uid = user.uid;
        setUser({ name: user.displayName, email: user.email });
        setLocation("/");
      } else {
        // User is signed out
        // .
        setLocation("/signin");
        setUser("");
      }
    });
    return ()=>unsubscribe();
  }
  , []);

  return (
    <>
      <div className=" flex justify-between items-center text-center bg-primary px-8  py-4 max-w-[1024px] mx-auto">
        <h1 className="text-4xl font-semibold text-white">Chat App </h1>
        {user && (
          <button
            className="rounded-md p-2 bg-background bg-opacity-90"
            onClick={() => signOut(auth)}
          >
            {/* Log out button */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28px"
              height="28px"
              viewBox="0 -0.5 25 25"
              fill="none"
            >
              <path
                d="M7.04401 9.53165C7.33763 9.23949 7.33881 8.76462 7.04665 8.47099C6.75449 8.17737 6.27962 8.17619 5.98599 8.46835L7.04401 9.53165ZM2.97099 11.4683C2.67737 11.7605 2.67619 12.2354 2.96835 12.529C3.26051 12.8226 3.73538 12.8238 4.02901 12.5317L2.97099 11.4683ZM4.02901 11.4683C3.73538 11.1762 3.26051 11.1774 2.96835 11.471C2.67619 11.7646 2.67737 12.2395 2.97099 12.5317L4.02901 11.4683ZM5.98599 15.5317C6.27962 15.8238 6.75449 15.8226 7.04665 15.529C7.33881 15.2354 7.33763 14.7605 7.04401 14.4683L5.98599 15.5317ZM3.5 11.25C3.08579 11.25 2.75 11.5858 2.75 12C2.75 12.4142 3.08579 12.75 3.5 12.75V11.25ZM17.5 12.75C17.9142 12.75 18.25 12.4142 18.25 12C18.25 11.5858 17.9142 11.25 17.5 11.25V12.75ZM5.98599 8.46835L2.97099 11.4683L4.02901 12.5317L7.04401 9.53165L5.98599 8.46835ZM2.97099 12.5317L5.98599 15.5317L7.04401 14.4683L4.02901 11.4683L2.97099 12.5317ZM3.5 12.75L17.5 12.75V11.25L3.5 11.25V12.75Z"
                fill="#000000"
              />
              <path
                d="M9.5 15C9.5 17.2091 11.2909 19 13.5 19H17.5C19.7091 19 21.5 17.2091 21.5 15V9C21.5 6.79086 19.7091 5 17.5 5H13.5C11.2909 5 9.5 6.79086 9.5 9"
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
      {/* {user.email ? null : (
        <div
          onClick={(e) => {
            googleLogin();
          }}
          className="bg-background cursor-pointer flex items-center justify-center gap-6 max-w-[300px] lg:max-w-[450px] mt-[40%] lg:mt-[10%]  mx-auto border-[1px] border-gray-300 shadow-md rounded-md p-3"
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

          <button className="font-semibold  text-text lg:text-lg ">
            Sign up with Google
          </button>
        </div>
      )} */}
      <Suspense fallback={<p className="text-white text-3xl">Loading....</p>}>
        <Route path="/signin">
          <SignupPage user={user} setUser={setUser} />
        </Route>

        <Route path="/">
          <ChatBox user={user} />
        </Route>
      </Suspense>
    </>
  );
}

export default App;
