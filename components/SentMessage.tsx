interface SentMessageProps {
    message: string;
  }
  
  function SentMessage({ message }: SentMessageProps) {
    return (
      <div className="flex justify-end mb-4">
        <div className="px-4 py-2 rounded-lg shadow-md max-w-[80%] sm:max-w-[70%] bg-green-500 text-gray-800">
          {message.split("\n").map((text, index) => (
            <p key={index} className="mb-1 last:mb-0">
              {text}
            </p>
          ))}
        </div>
      </div>
    );
  }
  
  export default SentMessage;
  