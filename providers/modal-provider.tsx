"use client"

import { useState, useEffect } from "react"
import { RestaurantModal } from "@/components/Global/restaurant-modal"

export function ModalProvider() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <RestaurantModal />
    </>
  )
}
