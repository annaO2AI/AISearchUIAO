"use client"
import { useEffect, useState } from "react"
import {
  LoganimationsIcon,
  SendIcon,
  AttachemntIcon,
  AIsearchIcon,
  DOCIcon,
  PDFIcon,
  LogIcon,
  EditIcon,
} from "./icons"
import Image from 'next/image';
export default function Aisearchinner({ onSend }: { onSend: () => void }) {
  const [fileName, setFileName] = useState("")
  const [fileType, setFileType] = useState("")

  const handleFileChange = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
      const extension = file.name.split(".").pop().toLowerCase()
      setFileType(extension)
    }
  }
  useEffect(() => {
    console.log("this is inner search")
  }, [])
  return (
    <div className="o2AlignSearch-inner-center ">
      <div className="text-left p-4 mt-auto text-xs subtitle w-full">
        <div className="flex flex-col gap-4 mb-5">
          <div className="flex flex-row justify-start w-full">
            <div className="flex flex-row items-top gap-4 ">
              <div className="">
                <LogIcon width={40} />
              </div>
              <div className="bg-white border border-solid border-gray-100 p-4 text-base rounded-md">
                👋,Hey John hope you are good today! <br></br>
                I’d love to help you get some of your questions❓answered
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-end w-full">
            <div className="flex flex-row items-top gap-4">
              <div className="">
                 <Image
                    src="/userAvtar.png"
                    alt="Otow Logo"
                    width={36}
                    height={36}
                  />
              </div>
              <div className="bg-white border border-solid border-gray-100 p-6 text-base rounded-md relative">
                <button className="absolute top-3 right-3 cursor-pointer">
                  <EditIcon width={14} />
                </button>
                <div className="flex flex-row mb-4">
                  <div className="flex flex-row items-center  rounded-md border border-solid border-gray-200 p-4 bg-white gap-4">
                    <PDFIcon width={24} />
                    <p className="text-sm text-gray-600">Pooja Resume.pdf</p>
                  </div>
                </div>
                Summarize uploaded resume
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-start w-full">
          <div className="flex flex-row items-top gap-4 ">
            <div className="">
              <LoganimationsIcon width={40} />
            </div>
          </div>
        </div>

        <div className="osubtitle text-base">
          <div className="flex flex-col w-full max-w-6xl px-4 p-6 rounded-xl bg-white border-o2 aisearchinput">
            {fileName && (
              <div className="flex flex-row mb-4">
                <div className="flex flex-row items-center  rounded-md border border-solid border-gray-200 p-4 bg-white gap-4">
                  {fileType === "doc" || fileType === "docx" ? (
                    <DOCIcon width={26} />
                  ) : null}
                  {fileType === "pdf" ? <PDFIcon width={24} /> : null}
                  {fileName && (
                    <p className="text-sm text-gray-600">{fileName}</p>
                  )}
                </div>
              </div>
            )}
            <div className="flex-1 text-gray-400 flex items-center space-x-2 mb-4">
              <AIsearchIcon width={36} />
              <input
                type="text"
                placeholder="Type your massages here..."
                className="w-full outline-none bg-transparent text-sm text-gray-700 placeholder:text-gray-400"
              />
            </div>
            <div className="flex flex-row w-full justify-between px-2">
              <div>
                <label className="cursor-pointer inline-flex items-center px-4 py-2  text-white rounded">
                  <AttachemntIcon width={15} />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".doc,.docx,.pdf"
                  />
                </label>
              </div>
              <button
                onClick={onSend}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6 py-2 rounded-full flex items-center gap-1 text-sm cursor-pointer"
              >
                Send <SendIcon width={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
