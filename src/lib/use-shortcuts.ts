import {
  useIsTimerRunning,
  useSettingsActions,
  useTimerActions,
} from "@/lib/timer-store"
import { type Dispatch, type SetStateAction, useEffect } from "react"

export function useShortcuts({
  handleOpenChangeCommandCenter,
}: {
  handleOpenChangeCommandCenter: Dispatch<SetStateAction<boolean>>
}) {
  const isTimerRunning = useIsTimerRunning()
  const { play, pause } = useTimerActions()
  const { changeCurrentActivity } = useSettingsActions()

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
        handleOpenChangeCommandCenter(true)
        return
      }

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
  }, [
    isTimerRunning,
    pause,
    play,
    changeCurrentActivity,
    handleOpenChangeCommandCenter,
  ])
}
