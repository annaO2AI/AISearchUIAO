import { LoganimationsIcon, DOCIcon, PDFIcon, LogIcon } from "./icons";

interface Message {
  sender: "user" | "ai";
  content: string | { data: any; recommendation: string };
  isLoading?: boolean;
  fileType?: string;
  followup_questions?: string[];
}

interface ChatMessagesProps {
  messages: Message[];
  initials: string;
}

export default function ChatMessages({ messages, initials }: ChatMessagesProps) {
  // Utility function to determine if an array is suitable for a table
  const isTableData = (arr: any[]): boolean => {
    if (!arr.length) return false;
    const firstItem = arr[0];
    // Consider it table data if the first item is an object with at least 2 keys
    return typeof firstItem === "object" && Object.keys(firstItem).length >= 2;
  };

  // Utility function to format a single value
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "object") {
      return JSON.stringify(value); // Fallback for complex nested objects
    }
    return String(value);
  };

  // Function to dynamically format JSON data
  const formatJsonData = (data: any, depth: number = 0): string => {
    let html = "";

    if (Array.isArray(data)) {
      if (isTableData(data)) {
        // Render as a table
        const headers = Object.keys(data[0]).filter(
          (key) => !["id", "_id"].includes(key) // Exclude common ID fields
        );
        html += `<table class='border-collapse border border-gray-300 w-full'><thead><tr>`;
        headers.forEach((header) => {
          html += `<th class='border p-2'>${header.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</th>`;
        });
        html += `</tr></thead><tbody>`;
        data.forEach((item) => {
          html += `<tr>`;
          headers.forEach((header) => {
            html += `<td class='border p-2'>${formatValue(item[header])}</td>`;
          });
          html += `</tr>`;
        });
        html += `</tbody></table>`;
      } else {
        // Render as a list
        html += `<ul>`;
        data.forEach((item) => {
          if (typeof item === "object") {
            // For objects, show key-value pairs or a summary
            const summary = Object.entries(item)
              .map(([k, v]) => `${k}: ${formatValue(v)}`)
              .join(", ");
            html += `<li>${summary}</li>`;
          } else {
            html += `<li>${formatValue(item)}</li>`;
          }
        });
        html += `</ul>`;
      }
    } else if (typeof data === "object" && data !== null) {
      // Render as paragraphs or nested sections
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          html += `<h${depth + 3}>${key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</h${depth + 3}>`;
          html += formatJsonData(value, depth + 1);
        } else if (typeof value === "object" && value !== null) {
          html += `<h${depth + 3}>${key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</h${depth + 3}>`;
          html += formatJsonData(value, depth + 1);
        } else {
          html += `<p><strong>${key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}:</strong> ${formatValue(value)}</p>`;
        }
      });
    } else {
      // Render as a paragraph
      html += `<p>${formatValue(data)}</p>`;
    }

    return html;
  };

  // Function to format markdown content or structured JSON data
  const formatMessageContent = (content: string | { data: any; recommendation: string }) => {
    if (typeof content === "string") {
      // Handle plain string content (existing markdown logic)
      let lines = content.split("\n");
      let inList = false;
      let formattedLines = lines.map((line) => {
        line = line.trim();
        if (line.startsWith("### ")) {
          return `<h3>${line.replace("### ", "")}</h3>`;
        } else if (line.startsWith("- ")) {
          if (!inList) {
            inList = true;
            return "<ul>" + line.replace(/^- (.*)$/, "<li>$1</li>");
          }
          return line.replace(/^- (.*)$/, "<li>$1</li>");
        } else {
          if (inList) {
            inList = false;
            return "</ul>" + (line ? `<br />${line}` : "");
          }
          return line ? `${line}` : "";
        }
      });
      if (inList) {
        formattedLines.push("</ul>");
      }
      return formattedLines
        .join("")
        .replace(/\*\*([^\*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/<br \/><br \/>/g, "<br />");
    } else if (typeof content === "object" && content.recommendation) {
      // Handle JSON response
      let html = `<p>${content.recommendation}</p>`;
      if (content.data) {
        html += formatJsonData(content.data);
      }
      return html;
    }
    return "";
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
            className={`max-w-[70%] rounded-xl text-sm chatmassage-wrapper ${
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
            ) : typeof msg.content === "string" && msg.content.startsWith("📎") && msg.fileType ? (
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