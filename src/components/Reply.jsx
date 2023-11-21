const renderMessage = (message, type) => {
  switch (type) {
    // TODO: Handle image|gif type
    case "image":
      return (
        <div className="max-w-[50px] max-h-[50px] bg-text flex  rounded-md">
          <img className="w-full object-contain  rounded-lg " src={message} />
        </div>
      );
    case "link":
    case "text":
    default:
      return <span className="pl-1">{message}</span>;
  }
};

export default function Reply({ replyingTo, cancelReply, isSelfMessage }) {
  return (
    <div
      className={`relative rounded-md p-2 px-4 w-full max-h-[120px] mb-2 bg-background border border-text border-opacity-10 
        before:absolute before:h-full before:w-1.5  
        ${
          isSelfMessage
            ? "before:bg-gray-800 before:bg-opacity-50"
            : "before:bg-pink-800 before:bg-opacity-40"
        }  before:left-0 before:top-0 overflow-hidden gap-4
        flex items-center justify-between`}
    >
      <p className="line-clamp">

        {renderMessage(replyingTo.message,replyingTo.type)}
        
        </p>

      <button onClick={cancelReply}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
          width="24px"
          height="24px"
          viewBox="0 0 32 32"
        >
          <path d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5  c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4  C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z" />
        </svg>
      </button>
    </div>
  );
}
