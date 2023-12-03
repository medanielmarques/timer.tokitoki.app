import { timerDefaults } from "@/lib/constants"
import {
  decideNextActivity,
  formatTimer,
  playAlarmSound,
  playToggleTimerSound,
} from "@/lib/timer-utils"
import { create } from "zustand"

export type Activity = "pomodoro" | "shortBreak" | "longBreak"
export type DirectionClicked = "left" | "right"

type TimerStore = {
  currentActivity: Activity
  timer: number
  isRunning: boolean
  isTimerFinished: boolean
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
    updateLongBreakIntervalCount: () => void
    changeActivityTimer: (newTimer: number, activity: Activity) => void
    changeAutoStart: (autoStart: boolean) => void
  }

  actions: {
    getTimer: () => number
    changeTimer: (newTimer: number) => void
    changeCurrentActivity: (directionClicked: DirectionClicked) => void
    countdown: () => void
    pause: () => void
    play: () => void
  }
}

export const useTimerStore = create<TimerStore>((set, get) => {
  return {
    currentActivity: timerDefaults.defaultActivity,
    timer: timerDefaults.activityDuration[timerDefaults.defaultActivity],
    isRunning: false,
    isTimerFinished: false,

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

      updateLongBreakIntervalCount: () => {
        set({ longBreakIntervalCount: get().longBreakIntervalCount + 1 })
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

      countdown: () => {
        const { timer } = get()

        if (timer > 0) {
          const updatedTimer = timer - 1000
          set({ timer: updatedTimer })
        } else {
          playAlarmSound()

          set({
            isRunning: false,
            isTimerFinished: true,
          })

          const {
            longBreakInterval,
            currentActivity,
            longBreakIntervalCount,
            autoStart,
          } = get()

          let newLongBreakIntervalCount

          // update long break interval count
          if (currentActivity === "pomodoro") {
            newLongBreakIntervalCount = longBreakIntervalCount + 1

            set({ longBreakIntervalCount: newLongBreakIntervalCount })

            const settings = localStorage.getItem("toki-settings")
            if (!settings) return null

            const parsedSettings = JSON.parse(settings) as TimerStore
            localStorage.setItem(
              "toki-settings",
              JSON.stringify({
                ...parsedSettings,
                longBreakIntervalCount: newLongBreakIntervalCount,
              }),
            )
          }
          // update long break interval count

          let nextActivity: Activity
          let nextTimer = 0

          console.log({ longBreakIntervalCount, longBreakInterval })

          const shouldNextActivityBeLongBreak =
            currentActivity === "pomodoro" &&
            newLongBreakIntervalCount === longBreakInterval

          if (shouldNextActivityBeLongBreak) {
            nextActivity = "longBreak"
            nextTimer = get()?.[nextActivity]
            set({ longBreakIntervalCount: 0 })

            const settings = localStorage.getItem("toki-settings")
            if (!settings) return null

            const parsedSettings = JSON.parse(settings) as TimerStore
            localStorage.setItem(
              "toki-settings",
              JSON.stringify({
                ...parsedSettings,
                longBreakIntervalCount: 0,
              }),
            )
          } else {
            switch (currentActivity) {
              case "pomodoro":
                nextActivity = "shortBreak"
                break
              default:
                nextActivity = "pomodoro"
                break
            }

            nextTimer = get()?.[nextActivity]
          }

          set({
            currentActivity: nextActivity,
            timer: nextTimer,
          })

          if (autoStart) set({ isRunning: true, isTimerFinished: false })
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

export const useIsTimerFinished = () =>
  useTimerStore((state) => state.isTimerFinished)

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
