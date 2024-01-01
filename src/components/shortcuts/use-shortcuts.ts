import {
  useCommandCenterActions,
  useIsCommandCenterOpen,
} from "@/components/command-center/command-center-store"
import { useSettingsMenuActions } from "@/components/settings-menu/settings-menu-store"
import { useKeyboardShortcutsModalActions } from "@/components/shortcuts/shortcuts-modal-store"
import {
  useIsTimerRunning,
  useSettingsActions,
  useTimerActions,
} from "@/components/timer/timer-store"
import { useWhiteNoiseActions } from "@/components/white-noise/white-noise-store"
import { SHORTCUT_KEYS } from "@/lib/constants"
import { useIsAnyMenuOpen } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useCallback, useEffect } from "react"

export function useShortcuts() {
  const isTimerRunning = useIsTimerRunning()
  const { play, pause } = useTimerActions()
  const { changeCurrentActivity } = useSettingsActions()
  const { handleWhiteNoiseMenuShortcut } = useWhiteNoiseActions()
  const { handleSettingsMenuShortcut } = useSettingsMenuActions()
  const { handleHelpModalShortcut } = useKeyboardShortcutsModalActions()
  const isCommandCenterOpen = useIsCommandCenterOpen()
  const { setIsCommandCenterOpen } = useCommandCenterActions()
  const isAnyMenuOpen = useIsAnyMenuOpen()
  const { setTheme, theme } = useTheme()

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

  const handleToggleThemeShortcut = useCallback(
    (e: KeyboardEvent) => {
      if (SHORTCUT_KEYS.TOGGLE_THEME.includes(e.key)) {
        e.preventDefault()
        setTheme(theme === "dark" ? "light" : "dark")
      }
    },
    [setTheme, theme],
  )

  useEffect(() => {
    if (isAnyMenuOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent switching activities instead of triggering the command center
      if (handleCommandCenterShortcut(e)) return

      handleToggleTimerShortcut(e)
      handleSwitchActivityShortcut(e)
      handleWhiteNoiseMenuShortcut(e)
      handleSettingsMenuShortcut(e)
      handleHelpModalShortcut(e)
      handleToggleThemeShortcut(e)
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [
    isCommandCenterOpen,
    handleCommandCenterShortcut,
    handleToggleTimerShortcut,
    handleSwitchActivityShortcut,
    handleWhiteNoiseMenuShortcut,
    handleSettingsMenuShortcut,
    handleHelpModalShortcut,
    isAnyMenuOpen,
    handleToggleThemeShortcut,
  ])

  return { isCommandCenterOpen, setIsCommandCenterOpen }
}
