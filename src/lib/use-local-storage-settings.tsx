import { TIMER_DEFAULTS, type TimerDefaults } from "@/lib/constants"
import {
  useCurrentActivity,
  useSettingsActions,
  useTimerActions,
} from "@/lib/timer-store"
import { useLocalStorage } from "@mantine/hooks"
import { type ReactNode, createContext, useContext, useEffect } from "react"

export type SetLocalStorageSettings = (
  val: TimerDefaults | ((prevState: TimerDefaults) => TimerDefaults),
) => void

type SettingsContextType = {
  localStorageSettings: TimerDefaults | undefined
  setLocalStorageSettings: SetLocalStorageSettings
}

const SettingsContext = createContext<SettingsContextType>({
  localStorageSettings: TIMER_DEFAULTS,
  setLocalStorageSettings: () => {},
})

export const useLocalStorageSettings = () => useContext(SettingsContext)

export function LocalStorageSettingsProvider({
  children,
}: {
  children: ReactNode
}) {
  const settingsActions = useSettingsActions()
  const timerActions = useTimerActions()
  const currentActivity = useCurrentActivity()

  const [localStorageSettings, setLocalStorageSettings] = useLocalStorage({
    key: "toki-settings",
    defaultValue: TIMER_DEFAULTS,
  })

  useEffect(() => {
    if (!localStorageSettings) return

    timerActions.changeTimer(
      localStorageSettings.activityDuration[currentActivity],
    )

    settingsActions.changeActivityTimer(
      localStorageSettings.activityDuration.pomodoro,
      "pomodoro",
    )

    settingsActions.changeActivityTimer(
      localStorageSettings.activityDuration.shortBreak,
      "shortBreak",
    )

    settingsActions.changeActivityTimer(
      localStorageSettings.activityDuration.longBreak,
      "longBreak",
    )

    settingsActions.changeLongBreakIntervalCount(
      localStorageSettings.longBreakIntervalCount,
    )
  }, [
    localStorageSettings,
    setLocalStorageSettings,
    settingsActions,
    timerActions,
    currentActivity,
  ])

  return (
    <SettingsContext.Provider
      value={{ localStorageSettings, setLocalStorageSettings }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
