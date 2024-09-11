import { useState, useEffect } from "react";
import { remark } from "remark";
import html from "remark-html";

interface ResponseMessageProps {
  message: string;
}

function ResponseMessage({ message }: ResponseMessageProps) {
  const [contentHtml, setContentHtml] = useState<string>("");

  useEffect(() => {
    const processMarkdown = async () => {
      // Use remark to convert markdown into HTML string
      const processedContent = await remark().use(html).process(message);
      setContentHtml(processedContent.toString());
    };

    processMarkdown();
  }, [message]);

  return (
    <div className="flex justify-start mb-4">
      <div
        className="px-4 py-2 rounded-lg shadow-md max-w-[80%] sm:max-w-[70%] bg-gray-600 text-white leading-relaxed"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}

export default ResponseMessage;
