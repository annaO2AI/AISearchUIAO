import Link from "next/link"
import Image from "next/image"
import logo from "@/public/O2_AI_Logo.png" // adjust path to your actual logo file

export default function Footer() {
  return (
    <footer className="w-full py-2 px-4 text-sm text-gray-500 bg-white">
      {/* Disclaimer */}
      <div className="mt-2 text-center px-4 text-gray-500 max-w-6xl mx-auto flex flex-col items-center">
        <span className="font-medium"> ⚠️ Disclaimer:</span> This insights,
        summaries and sentiment analysis provided are AI-generated and should be
        interpreted with human<br/> judgment. while we strive for accuracy, please
        review the content for critical decisions
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-400 mt-4">
        © {new Date().getFullYear()}. All rights reserved.
      </div>
    </footer>
  )
}
