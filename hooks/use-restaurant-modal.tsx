import { create } from "zustand"

interface useRestaurantModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useRestaurantModal = create<useRestaurantModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set(() => ({ isOpen: true })),
  onClose: () => set(() => ({ isOpen: false })),
}))
