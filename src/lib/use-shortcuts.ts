import {
  useIsTimerRunning,
  useSettingsActions,
  useTimerActions,
} from "@/lib/timer-store"
import { useCallback, useEffect, useState } from "react"

export function useShortcuts() {
  const isTimerRunning = useIsTimerRunning()
  const { play, pause } = useTimerActions()
  const { changeCurrentActivity } = useSettingsActions()

  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false)

  const handleCommandCenterShortcut = useCallback(
    (e: KeyboardEvent) => {
      const commandCenterShortcuts = ["k", "K"]
      const ctrlOrMetaKey = e.metaKey || e.ctrlKey

      if (commandCenterShortcuts.includes(e.key) && ctrlOrMetaKey) {
        e.preventDefault()
        setIsCommandCenterOpen(true)
        return
      }
    },
    [setIsCommandCenterOpen],
  )

  const handleToggleTimerShortcut = useCallback(
    (e: KeyboardEvent) => {
      const spacebarShortcut = " "
      const toggleTimerShortcuts = ["p", "P"]

      const shouldSpacebarToggleTimer =
        e.key === spacebarShortcut && document.activeElement === document.body

      if (shouldSpacebarToggleTimer) {
        e.preventDefault()
        isTimerRunning ? pause() : play()
      }

      if (toggleTimerShortcuts.includes(e.key)) {
        e.preventDefault()
        isTimerRunning ? pause() : play()
      }
    },
    [isTimerRunning, play, pause],
  )

  const handleSwitchActivityShortcut = useCallback(
    (e: KeyboardEvent) => {
      const leftArrowShortcuts = ["ArrowLeft", "j", "J"]
      const rightArrowShortcuts = ["ArrowRight", "k", "K"]

      if (leftArrowShortcuts.includes(e.key)) {
        e.preventDefault()
        changeCurrentActivity("left")
      }

      if (rightArrowShortcuts.includes(e.key)) {
        e.preventDefault()
        changeCurrentActivity("right")
      }
    },
    [changeCurrentActivity],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCommandCenterOpen) return

      handleCommandCenterShortcut(e)
      handleToggleTimerShortcut(e)
      handleSwitchActivityShortcut(e)
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [
    isCommandCenterOpen,
    handleCommandCenterShortcut,
    handleToggleTimerShortcut,
    handleSwitchActivityShortcut,
  ])

  return { isCommandCenterOpen, setIsCommandCenterOpen }
}
