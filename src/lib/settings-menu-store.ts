import { useTimerStore } from "@/components/timer/timer-store"
import { SHORTCUT_KEYS } from "@/lib/constants"
import { create } from "zustand"

import { useWhiteNoiseStore } from "../components/white-noise/white-noise-store"

type SettingsMenuStore = {
  isSettingsMenuOpen: boolean
  wasTimerRunning: boolean
  actions: {
    handleSheetOpenChange: (open?: boolean) => void
    handleSettingsMenuShortcut: (e: KeyboardEvent) => void
  }
}

export const useSettingsMenuStore = create<SettingsMenuStore>((set, get) => {
  return {
    isSettingsMenuOpen: false,
    wasTimerRunning: false,

    actions: {
      handleSheetOpenChange: (open = true) => {
        const { isWhiteNoiseMenuOpen } = useWhiteNoiseStore.getState()
        if (isWhiteNoiseMenuOpen) return

        const { isTimerRunning, actions } = useTimerStore.getState()
        const { wasTimerRunning } = get()

        set({ isSettingsMenuOpen: open })
        if (!isTimerRunning && !wasTimerRunning) return

        if (open) {
          set({ wasTimerRunning: true })
          actions.pause({ playSound: false })
        } else {
          set({ wasTimerRunning: false })
          actions.play({ playSound: false })
        }
      },

      handleSettingsMenuShortcut: (e) => {
        if (SHORTCUT_KEYS.SETINGS_MENU.includes(e.key)) {
          e.preventDefault()
          const { actions } = get()
          actions.handleSheetOpenChange()
        }
      },
    },
  }
})

export const useIsSettingsMenuOpen = () =>
  useSettingsMenuStore((state) => state.isSettingsMenuOpen)

export const useWasTimerRunning = () =>
  useSettingsMenuStore((state) => state.wasTimerRunning)

export const useSettingsMenuActions = () =>
  useSettingsMenuStore((state) => state.actions)
