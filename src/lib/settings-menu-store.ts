import { useTimerStore } from "@/lib/timer-store"
import { create } from "zustand"

type SettingsMenuStore = {
  isSheetOpen: boolean
  wasTimerRunning: boolean
  actions: {
    handleSheetOpenChange: (open: boolean) => void
  }
}

const useSettingsMenuStore = create<SettingsMenuStore>((set, get) => {
  return {
    isSheetOpen: false,
    wasTimerRunning: false,

    actions: {
      handleSheetOpenChange: (open) => {
        const { isTimerRunning, actions } = useTimerStore.getState()
        console.log("handleSheetOpenChange", open)

        const { wasTimerRunning } = get()

        console.log({ isTimerRunning, wasTimerRunning })

        set({ isSheetOpen: open })
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

export const useIsSheetOpen = () =>
  useSettingsMenuStore((state) => state.isSheetOpen)

export const useWasTimerRunning = () =>
  useSettingsMenuStore((state) => state.wasTimerRunning)

export const useSettingsMenuActions = () =>
  useSettingsMenuStore((state) => state.actions)
