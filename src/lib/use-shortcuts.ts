import { useBgSoundActions } from "@/lib/bg-sound-store"
import { SHORTCUT_KEYS } from "@/lib/constants"
import { useSettingsMenuActions } from "@/lib/settings-menu-store"
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
  const { handleBgSoundMenuShortcut } = useBgSoundActions()
  const { handleSettingsMenuShortcut } = useSettingsMenuActions()

  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false)

  const handleCommandCenterShortcut = useCallback(
    (e: KeyboardEvent) => {
      if (
        SHORTCUT_KEYS.COMMAND_CENTER.includes(e.key) &&
        SHORTCUT_KEYS.CTRL_OR_META(e)
      ) {
        e.preventDefault()
        setIsCommandCenterOpen(true)
        return true
      }
    },
    [setIsCommandCenterOpen],
  )

  const handleToggleTimerShortcut = useCallback(
    (e: KeyboardEvent) => {
      const shouldSpacebarToggleTimer =
        SHORTCUT_KEYS.SPACEBAR.includes(e.key) &&
        document.activeElement === document.body

      if (shouldSpacebarToggleTimer) {
        e.preventDefault()
        isTimerRunning ? pause() : play()
      }

      if (SHORTCUT_KEYS.TOGGLE_TIMER.includes(e.key)) {
        e.preventDefault()
        isTimerRunning ? pause() : play()
      }
    },
    [isTimerRunning, play, pause],
  )

  const handleSwitchActivityShortcut = useCallback(
    (e: KeyboardEvent) => {
      if (SHORTCUT_KEYS.SWITCH_ACTIVITY_LEFT.includes(e.key)) {
        e.preventDefault()
        changeCurrentActivity("left")
      }

      if (SHORTCUT_KEYS.SWITCH_ACTIVITY_RIGHT.includes(e.key)) {
        e.preventDefault()
        changeCurrentActivity("right")
      }
    },
    [changeCurrentActivity],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCommandCenterOpen) return

      // Prevent shortcuts from firing when user is typing
      if (handleCommandCenterShortcut(e)) return

      handleToggleTimerShortcut(e)
      handleSwitchActivityShortcut(e)
      handleBgSoundMenuShortcut(e)
      handleSettingsMenuShortcut(e)
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [
    isCommandCenterOpen,
    handleCommandCenterShortcut,
    handleToggleTimerShortcut,
    handleSwitchActivityShortcut,
    handleBgSoundMenuShortcut,
    handleSettingsMenuShortcut,
  ])

  return { isCommandCenterOpen, setIsCommandCenterOpen }
}
