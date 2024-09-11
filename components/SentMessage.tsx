interface SentMessageProps {
  message: string;
}

function SentMessage({ message }: SentMessageProps) {
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
      </div>
    </div>
  );
}

export default SentMessage;
