"use client"
import Modal from "./modal"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, onConfirm, loading }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <Modal title="Are you sure?" description="This action cannot be reverted." isOpen={isOpen} onClose={onClose}>
      <div className="pt-4  space-x-4 md:space-x-2 flex items-center justify-center md:justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          <Loader2 className={cn("mr-2 h-4 w-4 animate-spin hidden", loading && "block")} />
          Continue
        </Button>
      </div>
    </Modal>
  )
}

export default AlertModal
