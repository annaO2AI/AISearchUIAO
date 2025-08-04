import React from "react";
import { LoganimationsIcon, DOCIcon, PDFIcon, LogIcon } from "./icons";

interface Message {
  sender: "user" | "ai";
  content: string;
  isLoading?: boolean;
  fileType?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  initials: string;
  handleLoadingState?: any;
}

export default function ChatMessages({ messages, initials, handleLoadingState }: ChatMessagesProps) {
  // Function to format markdown content
  const formatMessageContent = (content: string) => {
    return content
      // Convert ### 1. **Title** to ◉ <strong>1. Title</strong>
      .replace(/###\s*(\d+\.\s*)\*\*([^\*]+)\*\*/g, "<strong>$1$2</strong>")
      // Convert remaining **text** to <strong>text</strong>
      .replace(/\*\*([^\*]+)\*\*/g, "<strong>$1</strong>")
      // Convert newlines to <br /> for proper rendering
      .replace(/\n/g, "<br />");
  };

  return (
    <div id="chat-box" className="flex-1 overflow-y-auto px-0 py-2 space-y-2">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${
            msg.sender === "user" ? "justify-end gap-2" : "justify-start gap-2"
          }`}
        >
          {msg.sender === "user" && !msg.isLoading ? (
            <div>
              {initials && (
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-normal text-xs">
                  {initials}
                </div>
              )}
            </div>
          ) : msg.sender === "ai" && !msg.isLoading ? (
            <LogIcon width={36} height={36} />
          ) : (
            <div></div>
          )}
          <div
            className={`max-w-[70%] rounded-xl text-sm ${
              msg.sender === "user"
                ? "bg-white font-bold border-o3 px-4 py-3 boxshadow rounded-br-none"
                : msg.isLoading
                ? "p-0"
                : "bg-white text-gray-800 rounded-bl-none border-o3 p-5"
            }`}
          >
            {msg.isLoading ? (
             <div className="flex items-center gap-2">
              <LoganimationsIcon width={40} height={40} />
              {/* <button
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-2 rounded-full flex items-center gap-1 text-sm cursor-pointer"
                onClick={() => handleLoadingState(idx)}
              >
                STOP Request
              </button> */}
            </div>
            ) : msg.sender === "user" && msg.content?.startsWith("📎") && msg.fileType ? (
              <div className="flex items-center gap-2">
                {msg.fileType === "pdf" ? <PDFIcon width={20} /> : null}
                {msg.fileType === "doc" || msg.fileType === "docx" ? (
                  <DOCIcon width={20} />
                ) : null}
                <span>{msg.content.replace("📎 ", "")}</span>
              </div>
            ) : (
              <div
                className="font-sans whitespace-pre-wrap break-words m-0 leading-7"
                dangerouslySetInnerHTML={{
                  __html: formatMessageContent(msg.content),
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}