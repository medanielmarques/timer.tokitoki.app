import { timerDefaults } from "@/lib/constants"
import {
  useCurrentActivity,
  useSettingsActions,
  useTimerActions,
} from "@/lib/timer-store"
import { useLocalStorage } from "@mantine/hooks"
import { type ReactNode, createContext, useContext, useEffect } from "react"

type SettingsContextType = {
  localStorageSettings: typeof timerDefaults | undefined
  setLocalStorageSettings: (current: typeof timerDefaults) => void
}

const SettingsContext = createContext<SettingsContextType>({
  localStorageSettings: timerDefaults,
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
    defaultValue: timerDefaults,
  })

  useEffect(() => {
    if (localStorageSettings) {
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

      console.log(localStorageSettings, "here")

      settingsActions.changeLongBreakIntervalCount(
        localStorageSettings.longBreakIntervalCount,
      )
    }
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
