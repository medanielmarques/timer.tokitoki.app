import { SHORTCUT_KEYS } from "@/lib/constants"
import { create } from "zustand"

type KeyboardShortcutsModalStore = {
  isHelpModalOpen: boolean
  actions: {
    setHelpModalOpen: (isOpen: boolean) => void
    handleHelpModalShortcut: (e: KeyboardEvent) => void
  }
}

const useKeyboardShortcutsModalStore = create<KeyboardShortcutsModalStore>(
  (set) => ({
    isHelpModalOpen: false,

    actions: {
      setHelpModalOpen: (isOpen) => set({ isHelpModalOpen: isOpen }),

      handleHelpModalShortcut: (e) => {
        if (SHORTCUT_KEYS.HELP_MODAL.includes(e.key)) {
          e.preventDefault()
          set((state) => ({ isHelpModalOpen: !state.isHelpModalOpen }))
        }
      },
    },
  }),
)

export const useIsHelpModalOpen = () =>
  useKeyboardShortcutsModalStore((state) => state.isHelpModalOpen)

export const useKeyboardShortcutsModalActions = () =>
  useKeyboardShortcutsModalStore((state) => state.actions)
