interface SentMessageProps {
  message: string;
  timestamp: string; 
}

function SentMessage({ message, timestamp }: SentMessageProps) {
  return (
    <div className="flex justify-end mb-6">
      <div className="flex flex-col items-end space-y-2 max-w-[75%]">
        <div className="px-5 py-3 rounded-lg bg-green-500 text-white shadow-md">
          {message.split("\n").map((text, index) => (
            <p key={index} className="mb-1 last:mb-0">
              {text}
            </p>
          ))}
        </div>
        <span className="text-sm text-gray-400">{timestamp}</span>
      </div>
    </div>
  );
}

export default SentMessage;
