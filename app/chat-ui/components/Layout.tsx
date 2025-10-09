"use client"
import { useState } from "react"
import Aisearch from "./Aisearch"
import TalentAcquisitionPage from "../../talent-acquisition/page"


export default function Layout() {
  const [showInner, setShowInner] = useState(false)

  const handleToggle = () => {
    setShowInner((prev) => !prev)
  }

  return (
    <>
      <TalentAcquisitionPage  />
    </>
  )
}
