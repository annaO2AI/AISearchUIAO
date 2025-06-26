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
      // Handle JSON response, always display recommendation if present
      let html = `<p>${content.recommendation}</p>`;

      if (content.data && content.data.employeeDetails) {
        const emp = content.data.employeeDetails;
        html += `<h3>Employee Details</h3>`;
        // Basic Info
        html += `<p><strong>Name:</strong> ${emp.first_name} ${emp.middle_name !== "-" ? emp.middle_name : ""} ${emp.last_name}</p>`;
        if (emp.employee_number) html += `<p><strong>Employee Number:</strong> ${emp.employee_number}</p>`;
        if (emp.emp_type) html += `<p><strong>Employee Type:</strong> ${emp.emp_type}</p>`;
        if (emp.gender) html += `<p><strong>Gender:</strong> ${emp.gender}</p>`;
        if (emp.email_id) html += `<p><strong>Email:</strong> ${emp.email_id}</p>`;
        if (emp.mobile_phone) html += `<p><strong>Mobile:</strong> ${emp.mobile_phone}</p>`;
        if (emp.date_of_joining) html += `<p><strong>Date of Joining:</strong> ${emp.date_of_joining}</p>`;
        if (emp.employee_status) html += `<p><strong>Status:</strong> ${emp.employee_status}</p>`;

        // Job Details (Table)
        if (emp.job_details?.length) {
          html += `<h4>Job Details</h4><table class='border-collapse border border-gray-300 w-full'><thead><tr><th class='border p-2'>Job Title</th><th class='border p-2'>Job Code</th><th class='border p-2'>Start Date</th><th class='border p-2'>End Date</th><th class='border p-2'>Status</th><th class='border p-2'>Client</th><th class='border p-2'>Pay Rate</th></tr></thead><tbody>`;
          emp.job_details.forEach((job: any) => {
            html += `<tr><td class='border p-2'>${job.job_title || ""}</td><td class='border p-2'>${job.job_code || ""}</td><td class='border p-2'>${job.job_start_date || ""}</td><td class='border p-2'>${job.job_end_date || "Ongoing"}</td><td class='border p-2'>${job.job_status || ""}</td><td class='border p-2'>${job.client || ""}</td><td class='border p-2'>${job.net_pay_rate || ""}</td></tr>`;
          });
          html += `</tbody></table>`;
        }

        // Education Details (List)
        if (emp.education_details?.length) {
          html += `<h4>Education Details</h4><ul>`;
          emp.education_details.forEach((edu: any) => {
            if (edu.highest_degree || edu.institution) {
              html += `<li>${edu.highest_degree} from ${edu.institution}</li>`;
            }
          });
          html += `</ul>`;
        }

        // Skills (List)
        if (emp.skill_details?.length) {
          html += `<h4>Skills</h4><ul>`;
          emp.skill_details.forEach((skill: any) => {
            if (skill.skill_id && skill.years_of_experience) {
              html += `<li>${skill.skill_id}: ${skill.years_of_experience} years</li>`;
            }
          });
          html += `</ul>`;
        }

        // Documents (Table)
        if (emp.document_details?.length) {
          html += `<h4>Documents</h4><table class='border-collapse border border-gray-300 w-full'><thead><tr><th class='border p-2'>Title</th><th class='border p-2'>Type</th><th class='border p-2'>Expiry Date</th><th class='border p-2'>Status</th></tr></thead><tbody>`;
          emp.document_details.forEach((doc: any) => {
            if (doc.document_title || doc.document_type) {
              html += `<tr><td class='border p-2'>${doc.document_title || ""}</td><td class='border p-2'>${doc.document_type || ""}</td><td class='border p-2'>${doc.document_exp_date || "N/A"}</td><td class='border p-2'>${doc.status || "N/A"}</td></tr>`;
            }
          });
          html += `</tbody></table>`;
        }

        // Contact Details (List)
        if (emp.contact_details?.length) {
          html += `<h4>Contact Details</h4><ul>`;
          emp.contact_details.forEach((contact: any) => {
            if (contact.address1 || contact.city || contact.state || contact.country) {
              html += `<li>${contact.contact_type}: ${contact.address1}, ${contact.city}, ${contact.state}, ${contact.country} ${contact.pincode || ""}</li>`;
            }
          });
          html += `</ul>`;
        }
      } else if (content.data && Array.isArray(content.data)) {
        // Handle Vendor Data
        const vendor = content.data[0];
        html += `<h3>Vendor Details</h3>`;
        if (vendor.business_information?.[0]) {
          const biz = vendor.business_information[0];
          html += `<p><strong>Business Name:</strong> ${biz.business_name}</p>`;
          if (biz.vendor_number) html += `<p><strong>Vendor Number:</strong> ${biz.vendor_number}</p>`;
          if (biz.vendor_emailid) html += `<p><strong>Email:</strong> ${biz.vendor_emailid}</p>`;
          if (biz.net_terms) html += `<p><strong>Net Terms:</strong> ${biz.net_terms}</p>`;
          if (biz.status) html += `<p><strong>Status:</strong> ${biz.status}</p>`;
        }

        // Contact Details (List)
        if (vendor.contact_details?.length) {
          html += `<h4>Contact Details</h4><ul>`;
          vendor.contact_details.forEach((contact: any) => {
            if (contact.primary_representative_name || contact.primary_email_id) {
              html += `<li>${contact.primary_representative_name}: ${contact.primary_email_id} (${contact.contact_type})</li>`;
            }
          });
          html += `</ul>`;
        }

        // Accounts Location (List)
        if (vendor.accounts_location?.length) {
          html += `<h4>Accounts Location</h4><ul>`;
          vendor.accounts_location.forEach((loc: any) => {
            if (loc.accounts_address1 || loc.accounts_city) {
              html += `<li>${loc.accounts_address1}, ${loc.accounts_city}, ${loc.accounts_state_id === 1335 ? "Telangana" : loc.accounts_state_id}, ${loc.accounts_country_id === 356 ? "India" : "Unknown"}</li>`;
            }
          });
          html += `</ul>`;
        }

        // User Defined Fields (Table)
        if (vendor.user_defined_fields?.length) {
          html += `<h4>User Defined Fields</h4><table class='border-collapse border border-gray-300 w-full'><thead><tr><th class='border p-2'>Field Label</th><th class='border p-2'>Value</th></tr></thead><tbody>`;
          vendor.user_defined_fields.forEach((field: any) => {
            if (field.field_value) {
              html += `<tr><td class='border p-2'>${field.field_label}</td><td class='border p-2'>${field.field_value}</td></tr>`;
            }
          });
          html += `</tbody></table>`;
        }
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