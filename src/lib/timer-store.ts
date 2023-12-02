import { timerDefaults } from "@/lib/constants"
import {
  decideNextActivity,
  decideNextTimer,
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

  settingsActions: {
    changeActivityDuration: (newDuration: number, activity: Activity) => void
    changeLongBreakInterval: (newInterval: number) => void
    changeActivityTimer: (newTimer: number, activity: Activity) => void
  }

  actions: {
    getTimer: () => number
    changeTimer: (newTimer: number) => void
    changeActivity: (directionClicked: DirectionClicked) => void
    countdown: () => void
    pause: () => void
    play: () => void
    restart: () => void
  }
}

export const useTimerStore = create<TimerStore>((set, get) => {
  return {
    currentActivity: timerDefaults.defaultActivity,
    timer: timerDefaults.activityDuration[timerDefaults.defaultActivity],
    isRunning: false,
    isTimerFinished: false,
    longBreakIntervalCount: 0,

    pomodoro: timerDefaults.activityDuration.pomodoro,
    shortBreak: timerDefaults.activityDuration.shortBreak,
    longBreak: timerDefaults.activityDuration.longBreak,
    longBreakInterval: timerDefaults.longBreakInterval,

    settingsActions: {
      changeActivityDuration: (newDuration, activity) => {
        set({ [activity]: newDuration })
      },

      changeLongBreakInterval: (newInterval) => {
        set({ longBreakInterval: newInterval })
      },

      changeActivityTimer: (newTimer, activity) => {
        set({ [activity]: newTimer })
      },
    },

    actions: {
      getTimer: () => get()[get().currentActivity],

      changeTimer: (newTimer: number) => {
        set({ timer: newTimer })
      },

      changeActivity: (directionClicked) => {
        const { currentActivity } = get()

        const nextActivity = decideNextActivity(
          currentActivity,
          directionClicked,
        )
        const nextTimer = decideNextTimer(nextActivity)

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
          const newLongBreakIntervalCount = get().longBreakIntervalCount + 1

          set({
            isRunning: false,
            isTimerFinished: true,
            longBreakIntervalCount: newLongBreakIntervalCount,
          })

          const settings = localStorage.getItem("toki-settings")
          const parsedSettings =
            settings && (JSON.parse(settings) as TimerStore)
          localStorage.setItem(
            "toki-settings",
            JSON.stringify({
              ...parsedSettings,
              longBreakIntervalCount: newLongBreakIntervalCount,
            }),
          )

          // if(autoStart) {
          //   get().actions.restart()
          // }
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

      restart: () => {
        const { currentActivity, longBreakInterval, longBreakIntervalCount } =
          get()

        let nextActivity: Activity
        let nextTimer = 0

        const shouldNextActivityBeLongBreak =
          currentActivity === "pomodoro" &&
          longBreakIntervalCount < longBreakInterval

        if (shouldNextActivityBeLongBreak) {
          nextActivity = "longBreak"
          nextTimer = decideNextTimer(nextActivity)
        } else {
          nextActivity = decideNextActivity(currentActivity, "right")
          nextTimer = decideNextTimer(nextActivity)
        }

        set({
          currentActivity: nextActivity,
          timer: nextTimer,
          isRunning: true,
          isTimerFinished: false,
        })

        playAlarmSound()
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
