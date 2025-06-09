"use client"
import { useState } from "react"
import Aisearch from "./Aisearch"
import Aisearchinner from "./Aisearchinner"


export default function Layout() {
  const [showInner, setShowInner] = useState(false)

  const handleToggle = () => {
    setShowInner((prev) => !prev)
  }

  return (
    <>
      {showInner ? (
        <Aisearchinner onSend={handleToggle} />
      ) : (
        <Aisearch onSend={handleToggle} />
      )}
    </>
  )
}
