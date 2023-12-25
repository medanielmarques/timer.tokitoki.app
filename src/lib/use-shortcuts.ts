import {
  useIsTimerRunning,
  useSettingsActions,
  useTimerActions,
} from "@/lib/timer-store"
import { useEffect, useState } from "react"

export function useShortcuts() {
  const isTimerRunning = useIsTimerRunning()
  const { play, pause } = useTimerActions()
  const { changeCurrentActivity } = useSettingsActions()

  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const spacebarShortcut = " "
      const toggleTimerShortcuts = ["p", "P"]
      const leftArrowShortcuts = ["ArrowLeft", "j", "J"]
      const rightArrowShortcuts = ["ArrowRight", "k", "K"]
      const commandCenterShortcuts = ["k", "K"]
      const ctrlOrMetaKey = e.metaKey || e.ctrlKey
      const shouldSpacebarToggleTimer =
        e.key === spacebarShortcut && document.activeElement === document.body

      if (commandCenterShortcuts.includes(e.key) && ctrlOrMetaKey) {
        e.preventDefault()
        setIsCommandCenterOpen(true)
        return
      }

      if (isCommandCenterOpen) return

      if (shouldSpacebarToggleTimer) {
        e.preventDefault()
        isTimerRunning ? pause() : play()
      }

      if (toggleTimerShortcuts.includes(e.key)) {
        e.preventDefault()
        isTimerRunning ? pause() : play()
      }

      if (leftArrowShortcuts.includes(e.key)) {
        e.preventDefault()
        changeCurrentActivity("left")
      }

      if (rightArrowShortcuts.includes(e.key)) {
        e.preventDefault()
        changeCurrentActivity("right")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isTimerRunning, pause, play, changeCurrentActivity, isCommandCenterOpen])

  return { isCommandCenterOpen, setIsCommandCenterOpen }
}
