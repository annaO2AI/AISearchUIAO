import { LoganimationsIcon, DOCIcon, PDFIcon, LogIcon } from "./icons";

interface Message {
  sender: "user" | "ai";
  content: string;
  isLoading?: boolean;
  fileType?: string;
  followup_questions?: string[];
}

interface ChatMessagesProps {
  messages: Message[];
  initials: string;
}

export default function ChatMessages({ messages, initials }: ChatMessagesProps) {
  // Function to format markdown content
  const formatMessageContent = (content: string) => {
    // Split content into lines for processing
    let lines = content.split("\n");
    
    // Process lines to handle titles, lists, and bold text
    let inList = false;
    let formattedLines = lines.map((line) => {
      line = line.trim();
      if (line.startsWith("### ")) {
        // Handle ### as title (e.g., <h3>)
        return `<h3>${line.replace("### ", "")}</h3>`;
      } else if (line.startsWith("- ")) {
        // Handle dash as list item
        if (!inList) {
          inList = true;
          return "<ul>" + line.replace(/^- (.*)$/, "<li>$1</li>");
        }
        return line.replace(/^- (.*)$/, "<li>$1</li>");
      } else {
        // Close list if it was open and handle non-list lines
        if (inList) {
          inList = false;
          return "</ul>" + (line ? `<br />${line}` : "");
        }
        return line ? `<br />${line}` : "";
      }
    });

    // Close the list if it was open at the end
    if (inList) {
      formattedLines.push("</ul>");
    }

    // Join lines and apply bold formatting
    return formattedLines
      .join("")
      // Convert **text** to <strong>text</strong>
      .replace(/\*\*([^\*]+)\*\*/g, "<strong>$1</strong>")
      // Ensure proper spacing for non-list text
      .replace(/<br \/><br \/>/g, "<br />");
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
              </div>
            ) : msg.content?.startsWith("📎") && msg.fileType ? (
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