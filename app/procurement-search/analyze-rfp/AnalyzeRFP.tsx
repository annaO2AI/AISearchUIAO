"use client"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { API_ROUTES } from "@/app/constants/api"

interface FileUploadValues {
  existing_files: File[]
  new_file: File | null
  temperature: string
}

interface SummarizeValues {
  file: File | null
  temperature: string
  toc_hint: string
}

interface SummarizeResult {
  ok: boolean
  filename: string
  doc_type: string
  executive_summary: string
  sections: Array<{
    title: string
    summary: string
  }>
  docx_download_url?: string
}

interface ComparisonResult {
  ok: boolean
  comparison: string
}

const AnalyzeRFP = () => {
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [summarizeResult, setSummarizeResult] = useState<SummarizeResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"analyze" | "summarize">("analyze")
  const [fileMetadata, setFileMetadata] = useState<Record<string, { path: string; size: string; lastModified: string }>>({})

  // Helper function to clear file inputs
  const clearFileInput = (elementId: string) => {
    const fileInput = document.getElementById(elementId) as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  // Analyze Form
  const analyzeInitialValues: FileUploadValues = {
    existing_files: [],
    new_file: null,
    temperature: "0.7",
  }

  // Summarize Form
  const summarizeInitialValues: SummarizeValues = {
    file: null,
    temperature: "0.3",
    toc_hint: "",
  }

  const SUPPORTED_MIME_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]

  const SUPPORTED_FILE_EXTENSIONS = ".pdf,.doc,.docx"

  const analyzeValidationSchema = Yup.object({
    existing_files: Yup.array()
      .of(
        Yup.mixed<File>()
          .test("fileSize", "File too large (max 5MB)", (value) =>
            value ? value.size <= 5 * 1024 * 1024 : true
          )
          .test(
            "fileType",
            "Only PDF and Word documents are supported",
            (value) =>
              value ? SUPPORTED_MIME_TYPES.includes(value.type) : true
          )
      )
      .min(1, "At least one existing file is required")
      .required("Existing files are required"),
    new_file: Yup.mixed<File>()
      .required("New file is required")
      .test("fileSize", "File too large (max 5MB)", (value) =>
        value ? value.size <= 5 * 1024 * 1024 : true
      )
      .test("fileType", "Only PDF and Word documents are supported", (value) =>
        value ? SUPPORTED_MIME_TYPES.includes(value.type) : true
      ),
    temperature: Yup.string()
      .matches(/^-?\d*\.?\d+$/, "Must be a number")
      .notRequired(),
  })

  const summarizeValidationSchema = Yup.object({
    file: Yup.mixed<File>()
      .required("File is required")
      .test("fileSize", "File too large (max 5MB)", (value) =>
        value ? value.size <= 5 * 1024 * 1024 : true
      )
      .test("fileType", "Only PDF and Word documents are supported", (value) =>
        value ? SUPPORTED_MIME_TYPES.includes(value.type) : true
      ),
    temperature: Yup.string()
      .matches(/^-?\d*\.?\d+$/, "Must be a number")
      .notRequired(),
    toc_hint: Yup.string().notRequired(),
  })

  const analyzeFormik = useFormik({
    initialValues: analyzeInitialValues,
    validationSchema: analyzeValidationSchema,
    onSubmit: async (values) => {
      setErrorMessage(null)
      const formData = new FormData()

      values.existing_files.forEach((file) => {
        formData.append("existing_files", file)
      })

      if (values.new_file) {
        formData.append("new_file", values.new_file)
      }

      if (values.temperature) {
        formData.append(
          "temperature",
          parseFloat(values.temperature).toString()
        )
      } else {
        formData.append("temperature", "")
      }

      try {
        const response = await fetch(API_ROUTES.analyzeRFP, {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            `Failed to analyze files: ${
              errorData.message || response.statusText
            }`
          )
        }

        const result: ComparisonResult = await response.json()

        if (result.ok && result.comparison) {
          setAnalysisResult(result.comparison)
        } else {
          throw new Error("Invalid response format from server")
        }

        // Reset form and clear file inputs
        analyzeFormik.resetForm()
        setFileMetadata({})
        clearFileInput("existing-files-input")
        clearFileInput("new-file-input")
      } catch (error: any) {
        setErrorMessage(
          error.message || "An error occurred while uploading files."
        )
      }
    },
  })

  const summarizeFormik = useFormik({
    initialValues: summarizeInitialValues,
    validationSchema: summarizeValidationSchema,
    onSubmit: async (values) => {
      setErrorMessage(null)
      setSummarizeResult(null)

      if (!values.file) {
        setErrorMessage("File is required")
        return
      }

      const formData = new FormData()
      formData.append("file", values.file)
      formData.append("temperature", values.temperature)
      formData.append("toc_hint", values.toc_hint)

      try {
        const response = await fetch(API_ROUTES.summarizeRFP,
          {
            method: "POST",
            body: formData,
          }
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            `Failed to summarize file: ${
              errorData.message || response.statusText
            }`
          )
        }

        const result = await response.json()
        setSummarizeResult(result)
        summarizeFormik.resetForm()
        setFileMetadata({})
        clearFileInput("summarize-file-input")
      } catch (error: any) {
        setErrorMessage(
          error.message || "An error occurred while summarizing the file."
        )
      }
    },
  })

  const handleExistingFilesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files
    if (files) {
      const fileArray = Array.from(files)
      const uniqueFiles = fileArray.filter(
        (newFile) =>
          !analyzeFormik.values.existing_files.some(
            (existingFile) => existingFile.name === newFile.name
          )
      )

      const newMetadata = { ...fileMetadata }
      fileArray.forEach((file) => {
        // @ts-ignore - webkitRelativePath is browser-specific
        const fullPath = file.webkitRelativePath || file.name
        newMetadata[file.name] = {
          path: fullPath,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          lastModified: new Date(file.lastModified).toLocaleString(),
        }
      })
      setFileMetadata(newMetadata)

      analyzeFormik.setFieldValue("existing_files", [
        ...analyzeFormik.values.existing_files,
        ...uniqueFiles,
      ])
    }
  }

  const handleNewFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (file) {
      // @ts-ignore - webkitRelativePath is browser-specific
      const fullPath = file.webkitRelativePath || file.name
      setFileMetadata((prev) => ({
        ...prev,
        [file.name]: {
          path: fullPath,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          lastModified: new Date(file.lastModified).toLocaleString(),
        },
      }))
    }
    analyzeFormik.setFieldValue("new_file", file)
  }

  const handleSummarizeFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null
    if (file) {
      // @ts-ignore - webkitRelativePath is browser-specific
      const fullPath = file.webkitRelativePath || file.name
      setFileMetadata((prev) => ({
        ...prev,
        [file.name]: {
          path: fullPath,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          lastModified: new Date(file.lastModified).toLocaleString(),
        },
      }))
    }
    summarizeFormik.setFieldValue("file", file)
  }

  const removeExistingFile = (index: number) => {
    const updatedFiles = analyzeFormik.values.existing_files.filter(
      (_, i) => i !== index
    )
    analyzeFormik.setFieldValue("existing_files", updatedFiles)
  }

  const renderExistingFilesErrors = (errors: unknown): React.ReactNode => {
    if (typeof errors === "string") {
      return <div>{errors}</div>
    }
    if (Array.isArray(errors)) {
      return errors.map((error, index) => {
        if (typeof error === "string") {
          return <div key={index}>{error}</div>
        }
        if (error && typeof error === "object") {
          return (
            <div key={index}>
              {Object.values(error).map((err, i) => (
                <div key={i}>{String(err)}</div>
              ))}
            </div>
          )
        }
        return null
      })
    }
    if (errors && typeof errors === "object") {
      return Object.values(errors).map((err, i) => (
        <div key={i}>{String(err)}</div>
      ))
    }
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mt-10 mb-4">Analyze RFP</h2>

      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "analyze"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("analyze")}
        >
          Compare RFPs
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "summarize"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("summarize")}
        >
          Summarize RFP
        </button>
      </div>

      <div className="p-12 bg-white rounded-lg shadow-md">
        {activeTab === "analyze" ? (
          <>
            <form onSubmit={analyzeFormik.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Existing Files *
                </label>
                <input
                  id="existing-files-input"
                  type="file"
                  multiple
                  onChange={handleExistingFilesChange}
                  onBlur={analyzeFormik.handleBlur}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  accept={SUPPORTED_FILE_EXTENSIONS}
                  key={analyzeFormik.values.existing_files.length}
                />
                {analyzeFormik.values.existing_files.length > 0 && (
                  <div className="mt-2">
                    {analyzeFormik.values.existing_files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <div className="flex-1">
                          <span className="text-sm text-gray-600 block font-medium">
                            {file.name}
                          </span>
                          <div className="text-xs text-gray-500 space-y-1 mt-1">
                            <div>
                              Size:{" "}
                              {fileMetadata[file.name]?.size ||
                                "Calculating..."}
                            </div>
                            <div>
                              Modified:{" "}
                              {fileMetadata[file.name]?.lastModified ||
                                "Unknown"}
                            </div>
                            <div>
                              Path:{" "}
                              {fileMetadata[file.name]?.path || "Not available"}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingFile(index)}
                          className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {analyzeFormik.touched.existing_files &&
                  analyzeFormik.errors.existing_files && (
                    <div className="text-red-500 text-sm mt-1">
                      {renderExistingFilesErrors(
                        analyzeFormik.errors.existing_files
                      )}
                    </div>
                  )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New File Upload *
                </label>
                <input
                  id="new-file-input"
                  type="file"
                  onChange={handleNewFileChange}
                  onBlur={analyzeFormik.handleBlur}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  accept={SUPPORTED_FILE_EXTENSIONS}
                  key={analyzeFormik.values.new_file?.name || "empty"}
                />
                {analyzeFormik.touched.new_file &&
                  analyzeFormik.errors.new_file && (
                    <div className="text-red-500 text-sm mt-1">
                      {String(analyzeFormik.errors.new_file)}
                    </div>
                  )}
                {analyzeFormik.values.new_file && (
                  <div className="mt-2 p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600 block font-medium">
                      {analyzeFormik.values.new_file.name}
                    </span>
                    <div className="text-xs text-gray-500 space-y-1 mt-1">
                      <div>
                        Size:{" "}
                        {fileMetadata[analyzeFormik.values.new_file.name]
                          ?.size || "Calculating..."}
                      </div>
                      <div>
                        Modified:{" "}
                        {fileMetadata[analyzeFormik.values.new_file.name]
                          ?.lastModified || "Unknown"}
                      </div>
                      <div>
                        Path:{" "}
                        {fileMetadata[analyzeFormik.values.new_file.name]
                          ?.path || "Not available"}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature
                </label>
                <input
                  type="text"
                  name="temperature"
                  value={analyzeFormik.values.temperature}
                  onChange={analyzeFormik.handleChange}
                  onBlur={analyzeFormik.handleBlur}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded py-2 px-3"
                  placeholder="Enter temperature (e.g., 0.7)"
                />
                {analyzeFormik.touched.temperature &&
                  analyzeFormik.errors.temperature && (
                    <div className="text-red-500 text-sm mt-1">
                      {analyzeFormik.errors.temperature}
                    </div>
                  )}
              </div>

              {errorMessage && (
                <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
                disabled={analyzeFormik.isSubmitting}
              >
                {analyzeFormik.isSubmitting ? "Uploading..." : "Upload Files"}
              </button>
            </form>

            {analysisResult && (
              <div className="mt-8 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  Comparison Result
                </h3>
                <div className="prose max-w-none">
                  <ReactMarkdown>{analysisResult}</ReactMarkdown>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <form onSubmit={summarizeFormik.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  RFP File to Summarize *
                </label>
                <input
                  id="summarize-file-input"
                  type="file"
                  onChange={handleSummarizeFileChange}
                  onBlur={summarizeFormik.handleBlur}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  accept={SUPPORTED_FILE_EXTENSIONS}
                  key={summarizeFormik.values.file?.name || "empty"}
                />
                {summarizeFormik.touched.file &&
                  summarizeFormik.errors.file && (
                    <div className="text-red-500 text-sm mt-1">
                      {String(summarizeFormik.errors.file)}
                    </div>
                  )}
                {summarizeFormik.values.file && (
                  <div className="mt-2 p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600 block font-medium">
                      {summarizeFormik.values.file.name}
                    </span>
                    <div className="text-xs text-gray-500 space-y-1 mt-1">
                      <div>
                        Size:{" "}
                        {fileMetadata[summarizeFormik.values.file.name]?.size ||
                          "Calculating..."}
                      </div>
                      <div>
                        Modified:{" "}
                        {fileMetadata[summarizeFormik.values.file.name]
                          ?.lastModified || "Unknown"}
                      </div>
                      <div>
                        Path:{" "}
                        {fileMetadata[summarizeFormik.values.file.name]?.path ||
                          "Not available"}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature
                </label>
                <input
                  type="text"
                  name="temperature"
                  value={summarizeFormik.values.temperature}
                  onChange={summarizeFormik.handleChange}
                  onBlur={summarizeFormik.handleBlur}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded py-2 px-3"
                  placeholder="Enter temperature (e.g., 0.3)"
                />
                {summarizeFormik.touched.temperature &&
                  summarizeFormik.errors.temperature && (
                    <div className="text-red-500 text-sm mt-1">
                      {summarizeFormik.errors.temperature}
                    </div>
                  )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Table of Contents Hint
                </label>
                <input
                  type="text"
                  name="toc_hint"
                  value={summarizeFormik.values.toc_hint}
                  onChange={summarizeFormik.handleChange}
                  onBlur={summarizeFormik.handleBlur}
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded py-2 px-3"
                  placeholder="Enter TOC hint to help with summarization"
                />
                {summarizeFormik.touched.toc_hint &&
                  summarizeFormik.errors.toc_hint && (
                    <div className="text-red-500 text-sm mt-1">
                      {summarizeFormik.errors.toc_hint}
                    </div>
                  )}
              </div>

              {errorMessage && (
                <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
                disabled={summarizeFormik.isSubmitting}
              >
                {summarizeFormik.isSubmitting
                  ? "Summarizing..."
                  : "Summarize RFP"}
              </button>
            </form>

            {summarizeResult && (
              <div className="mt-8 space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    Document Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Filename:</p>
                      <p className="font-medium">{summarizeResult.filename}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Document Type:</p>
                      <p className="font-medium">{summarizeResult.doc_type}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    Executive Summary
                  </h3>
                  <div className="prose max-w-none">
                    <ReactMarkdown>
                      {summarizeResult.executive_summary}
                    </ReactMarkdown>
                  </div>
                </div>

                {summarizeResult.sections &&
                  summarizeResult.sections.length > 0 && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">
                        Section Summaries
                      </h3>
                      {summarizeResult.sections.map((section, index) => (
                        <div key={index} className="mb-4">
                          {section.title && (
                            <h4 className="font-medium text-gray-800">
                              {section.title}
                            </h4>
                          )}
                          <div className="prose max-w-none">
                            <ReactMarkdown>{section.summary}</ReactMarkdown>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                {summarizeResult.docx_download_url && (
                  <div className="mt-4">
                    <a
                      href={`https://procuremindai-hvf9hxhbhfgvaaa7.centralindia-01.azurewebsites.net${summarizeResult.docx_download_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Download Summary Document
                    </a>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AnalyzeRFP