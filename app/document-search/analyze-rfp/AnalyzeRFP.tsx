"use client"
import { useState } from "react"
import CompareRFPs from "./CompareRFPs"
import SummarizeRFP from "./SummarizeRFP"

const AnalyzeRFP = () => {
  const [activeTab, setActiveTab] = useState<"analyze" | "summarize">("analyze")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  return (
    <div className="w-[80%] mx-auto">
      <h2 className="text-xl font-bold mt-6 mb-4">Analyze RFP</h2>
      <div className="flex border-b mb-6">
        <button
          className={`py-4 px-12 font-medium ${
            activeTab === "analyze"
              ? "text-blue-600 border-b-2 border-blue-600 bg-white shadow-md"
              : "text-gray-500 "
          }`}
          onClick={() => setActiveTab("analyze")}
        >
          Compare RFPs
        </button>
        <button
          className={`py-4 px-12 font-medium ${
            activeTab === "summarize"
              ? "text-blue-600 border-b-2 border-blue-600 bg-white shadow-md text-[16px]"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("summarize")}
        >
          Summarize RFP
        </button>
      </div>
      <div className="analyze-section">
        {errorMessage && (
          <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
        )}
        {activeTab === "analyze" ? (
          <CompareRFPs setErrorMessage={setErrorMessage} />
        ) : (
          <SummarizeRFP setErrorMessage={setErrorMessage} />
        )}
      </div>
    </div>
  )
}

export default AnalyzeRFP