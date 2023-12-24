import { useTimerStore } from "@/lib/timer-store"
import { create } from "zustand"

import { useBackgroundSoundStore } from "./bg-sound-store"

type SettingsMenuStore = {
  isSettingsMenuOpen: boolean
  wasTimerRunning: boolean
  actions: {
    handleSheetOpenChange: (open: boolean) => void
  }
}

export const useSettingsMenuStore = create<SettingsMenuStore>((set, get) => {
  return {
    isSettingsMenuOpen: false,
    wasTimerRunning: false,

    actions: {
      handleSheetOpenChange: (open) => {
        const { isBgSoundMenuOpen } = useBackgroundSoundStore.getState()
        if (isBgSoundMenuOpen) return

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
    },
  }
})

export const useIsSettingsMenuOpen = () =>
  useSettingsMenuStore((state) => state.isSettingsMenuOpen)

export const useWasTimerRunning = () =>
  useSettingsMenuStore((state) => state.wasTimerRunning)

export const useSettingsMenuActions = () =>
  useSettingsMenuStore((state) => state.actions)
