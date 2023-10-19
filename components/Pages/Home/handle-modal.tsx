"use client"
import { useEffect } from "react"
import { useRestaurantModal } from "@/hooks/use-restaurant-modal"

const HandleModal = () => {
  const onOpen = useRestaurantModal((state) => state.onOpen)
  const isOpen = useRestaurantModal((state) => state.isOpen)

  useEffect(() => {
    if (!isOpen) onOpen()
  }, [isOpen, onOpen])

  return null
}

export default HandleModal
