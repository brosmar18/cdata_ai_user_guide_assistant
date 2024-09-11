import { useState, useEffect } from "react";
import { remark } from "remark";
import html from "remark-html";
import Image from "next/image";

interface ResponseMessageProps {
  message: string;
}

function ResponseMessage({ message }: ResponseMessageProps) {
  const [contentHtml, setContentHtml] = useState<string>("");

  useEffect(() => {
    const processMessage = async () => {
      // Use remark to convert markdown into HTML string
      const processedContent = await remark().use(html).process(message);
      setContentHtml(processedContent.toString());
    };

    processMessage();
  }, [message]);

  return (
    <div className="flex items-start mb-6 space-x-3 animate-fadeIn">
      {/* Use Next.js Image component to load the profile image */}
      <Image
        src="/ai_profile.png" 
        alt="AI Profile Image"
        width={40}
        height={40}
        className="rounded-full"
      />
      
      <div className="flex flex-col space-y-2 max-w-[75%]">
        <div
          className="px-5 py-3 rounded-lg bg-gray-100 text-gray-900 shadow-md"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </div>
  );
}

export default ResponseMessage;
