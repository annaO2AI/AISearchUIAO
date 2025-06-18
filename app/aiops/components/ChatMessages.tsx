// ChatMessages.tsx
import { LoganimationsIcon, DOCIcon, PDFIcon, LogIcon } from "./icons";

interface ExtractedData {
  application_name: string;
  problem_datetime: string;
  confidence_score: number;
  raw_datetime_mention: string;
}

interface Document {
  _id: string;
  Time: string;
  Instance: string;
  "CPU_%": string;
  Handles: string;
  Memory_PageFile_MB: string;
  Memory_Private_MB: string;
  Memory_Virtual_MB: string;
  Threads: string;
  "Working Set - Private": string;
}

interface Message {
  sender: "user" | "ai";
  content: string;
  isLoading?: boolean;
  fileType?: string;
  extracted_data?: ExtractedData;
  documents?: Document[];
}

interface ChatMessagesProps {
  messages: Message[];
  initials: string;
}

export default function ChatMessages({ messages, initials }: ChatMessagesProps) {
  const formatMessageContent = (content: string, extracted_data?: ExtractedData, documents?: Document[]) => {
    let formattedContent = content
      .replace(/\*\*([^\*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />");

    if (extracted_data) {
      formattedContent += `<br /><br /><strong>Extracted Information:</strong><br />`;
      formattedContent += `Application: ${extracted_data.application_name || 'N/A'}<br />`;
      formattedContent += `Problem Time: ${extracted_data.problem_datetime || 'N/A'}<br />`;
      formattedContent += `Confidence Score: ${extracted_data.confidence_score ? (extracted_data.confidence_score * 100).toFixed(2) + '%' : 'N/A'}<br />`;
      formattedContent += `Time Mention: ${extracted_data.raw_datetime_mention || 'N/A'}<br />`;
    }

    if (documents && Array.isArray(documents) && documents.length > 0) {
      formattedContent += `<br /><strong>Performance Metrics:</strong><br />`;
      formattedContent += `
        <div class="overflow-x-auto">
          <table class="min-w-full border-collapse border border-gray-200 text-sm">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-200 px-4 py-2 text-left font-medium">Time</th>
                <th class="border border-gray-200 px-4 py-2 text-left font-medium">CPU %</th>
                <th class="border border-gray-200 px-4 py-2 text-left font-medium">Handles</th>
                <th class="border border-gray-200 px-4 py-2 text-left font-medium">Memory PageFile (MB)</th>
                <th class="border border-gray-200 px-4 py-2 text-left font-medium">Memory Private (MB)</th>
                <th class="border border-gray-200 px-4 py-2 text-left font-medium">Memory Virtual (MB)</th>
                <th class="border border-gray-200 px-4 py-2 text-left font-medium">Threads</th>
                <th class="border border-gray-200 px-4 py-2 text-left font-medium">Working Set - Private</th>
              </tr>
            </thead>
            <tbody>
      `;

      documents.forEach((doc) => {
        formattedContent += `
          <tr>
            <td class="border border-gray-200 px-4 py-2">${doc.Time || 'N/A'}</td>
            <td class="border border-gray-200 px-4 py-2">${doc["CPU_%"] || 'N/A'}</td>
            <td class="border border-gray-200 px-4 py-2">${doc.Handles || 'N/A'}</td>
            <td class="border border-gray-200 px-4 py-2">${doc.Memory_PageFile_MB || 'N/A'}</td>
            <td class="border border-gray-200 px-4 py-2">${doc.Memory_Private_MB || 'N/A'}</td>
            <td class="border border-gray-200 px-4 py-2">${doc.Memory_Virtual_MB || 'N/A'}</td>
            <td class="border border-gray-200 px-4 py-2">${doc.Threads || 'N/A'}</td>
            <td class="border border-gray-200 px-4 py-2">${doc["Working Set - Private"] || 'N/A'}</td>
          </tr>
        `;
      });

      formattedContent += `
            </tbody>
          </table>
        </div>
      `;
    }

    return formattedContent;
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
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-normal text-md">
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
            className={`max-w-[100%] rounded-xl text-sm ${
              msg.sender === "user"
                ? " GeographyClass bg-white font-bold border-o3 px-4 py-3 boxshadow rounded-br-none"
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
                className="font-sans whitespace-pre-wrap break-words m-0"
                dangerouslySetInnerHTML={{
                  __html: formatMessageContent(msg.content, msg.extracted_data, msg.documents),
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}