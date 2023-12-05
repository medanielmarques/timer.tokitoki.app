import { timerDefaults } from "@/lib/constants"
import {
  decideNextActivity,
  formatTimer,
  playAlarmSound,
  playToggleTimerSound,
} from "@/lib/timer-utils"
import { type SettingsContextType } from "@/lib/use-local-storage-settings"
import { create } from "zustand"

export type Activity = "pomodoro" | "shortBreak" | "longBreak"
export type DirectionClicked = "left" | "right"

type TimerStore = {
  currentActivity: Activity
  timer: number
  isRunning: boolean
  longBreakIntervalCount: number

  pomodoro: number
  shortBreak: number
  longBreak: number
  longBreakInterval: number
  autoStart: boolean

  settingsActions: {
    changeActivityDuration: (newDuration: number, activity: Activity) => void
    changeLongBreakInterval: (newInterval: number) => void
    changeLongBreakIntervalCount: (newCount: number) => void
    changeActivityTimer: (newTimer: number, activity: Activity) => void
    changeAutoStart: (autoStart: boolean) => void
  }

  actions: {
    getTimer: () => number
    changeTimer: (newTimer: number) => void
    changeCurrentActivity: (directionClicked: DirectionClicked) => void
    countdown: (
      settingsActions: SettingsContextType["setLocalStorageSettings"],
    ) => void
    pause: () => void
    play: () => void
  }
}

export const useTimerStore = create<TimerStore>((set, get) => {
  return {
    currentActivity: timerDefaults.defaultActivity,
    timer: timerDefaults.activityDuration[timerDefaults.defaultActivity],
    isRunning: false,

    pomodoro: timerDefaults.activityDuration.pomodoro,
    shortBreak: timerDefaults.activityDuration.shortBreak,
    longBreak: timerDefaults.activityDuration.longBreak,
    longBreakInterval: timerDefaults.longBreakInterval,
    longBreakIntervalCount: timerDefaults.longBreakIntervalCount,
    autoStart: timerDefaults.autoStart,

    settingsActions: {
      changeActivityDuration: (newDuration, activity) => {
        set({ [activity]: newDuration })
      },

      changeLongBreakInterval: (newInterval) => {
        set({ longBreakInterval: newInterval })
      },

      changeLongBreakIntervalCount: (newCount) => {
        set({ longBreakIntervalCount: newCount })
      },

      changeActivityTimer: (newTimer, activity) => {
        set({ [activity]: newTimer })
      },

      changeAutoStart(autoStart) {
        set({ autoStart })
      },
    },

    actions: {
      getTimer: () => get()[get().currentActivity],

      changeTimer: (newTimer: number) => {
        set({ timer: newTimer })
      },

      changeCurrentActivity: (directionClicked) => {
        const { currentActivity } = get()

        const nextActivity = decideNextActivity(
          currentActivity,
          directionClicked,
        )
        const nextTimer = get()?.[nextActivity]

        set({
          currentActivity: nextActivity,
          timer: nextTimer,
        })
      },

      countdown: (setLocalStorageSettings) => {
        const { timer } = get()

        if (timer > 0) {
          const updatedTimer = timer - 1000
          set({ timer: updatedTimer })
        } else {
          playAlarmSound()

          set({ isRunning: false })

          const {
            longBreakInterval,
            currentActivity,
            longBreakIntervalCount,
            autoStart,
          } = get()

          let newLongBreakIntervalCount = 0
          let nextActivity: Activity
          let nextTimer = 0

          // update long break interval count
          if (currentActivity === "pomodoro") {
            newLongBreakIntervalCount = longBreakIntervalCount + 1

            const shouldNextActivityBeLongBreak =
              currentActivity === "pomodoro" &&
              newLongBreakIntervalCount === longBreakInterval

            if (shouldNextActivityBeLongBreak) {
              nextActivity = "longBreak"
              nextTimer = get()?.[nextActivity]

              setLocalStorageSettings((current) => ({
                ...current,
                longBreakIntervalCount: 0,
              }))

              nextTimer = get()?.[nextActivity]

              set({
                currentActivity: nextActivity,
                timer: nextTimer,
              })

              if (autoStart) set({ isRunning: true })

              return
            } else {
              set({ longBreakIntervalCount: newLongBreakIntervalCount })

              setLocalStorageSettings((current) => ({
                ...current,
                longBreakIntervalCount: newLongBreakIntervalCount,
              }))

              nextActivity = "shortBreak"
              nextTimer = get()?.[nextActivity]

              set({
                currentActivity: nextActivity,
                timer: nextTimer,
              })

              if (autoStart) set({ isRunning: true })

              return
            }
          }
          // update long break interval count

          nextActivity = "pomodoro"
          nextTimer = get()?.[nextActivity]

          set({
            currentActivity: nextActivity,
            timer: nextTimer,
          })

          if (autoStart) set({ isRunning: true })
        }
      },

      pause: () => {
        set({ isRunning: false })
        playToggleTimerSound()
      },
      play: () => {
        set({ isRunning: true })
        playToggleTimerSound()
      },
    },
  }
})

export const useTimerActions = () => useTimerStore((state) => state.actions)
export const useSettingsActions = () =>
  useTimerStore((state) => state.settingsActions)

export const useTimer = () => useTimerStore((state) => state.timer)

export const useFormattedTimer = (useInTabTitle = false) => {
  const timer = useTimerStore((state) => state.timer)
  return formatTimer(timer, useInTabTitle)
}

export const useIsRunning = () => useTimerStore((state) => state.isRunning)
export const useCurrentActivity = () =>
  useTimerStore((state) => state.currentActivity)

export const usePomodoroDuration = () =>
  useTimerStore((state) => state.pomodoro)

export const useShortBreakDuration = () =>
  useTimerStore((state) => state.shortBreak)

export const useLongBreakDuration = () =>
  useTimerStore((state) => state.longBreak)

export const useLongBreakInterval = () =>
  useTimerStore((state) => state.longBreakInterval)
