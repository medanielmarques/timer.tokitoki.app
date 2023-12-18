import { type TimerDefaults, timerDefaults } from "@/lib/constants"
import {
  decideNextActivity,
  formatTimer,
  playAlarmSound,
  playToggleTimerSound,
} from "@/lib/timer-utils"
import { type SetLocalStorageSettings } from "@/lib/use-local-storage-settings"
import { create } from "zustand"

export type Activity = "pomodoro" | "shortBreak" | "longBreak"
export type DirectionClicked = "left" | "right"

type MakeOptional<T> = { [K in keyof T]?: T[K] }

export type BackgroundSound = "underwater" | "birds" | "off"

type TimerStore = {
  currentActivity: Activity
  timer: number
  isTimerRunning: boolean
  longBreakIntervalCount: number

  pomodoro: number
  shortBreak: number
  longBreak: number
  longBreakInterval: number
  autoStart: boolean

  currentBackgroundSound: BackgroundSound

  settingsActions: {
    changeActivityDuration: (newDuration: number, activity: Activity) => void
    changeCurrentActivity: (directionClicked: DirectionClicked) => void
    changeLongBreakInterval: (newInterval: number) => void
    changeLongBreakIntervalCount: (newCount: number) => void
    changeActivityTimer: (newTimer: number, activity: Activity) => void
    changeAutoStart: (autoStart: boolean) => void

    changeBackgroundSound: (backgroundSound: BackgroundSound) => void
  }

  actions: {
    getTimer: () => number
    changeTimer: (newTimer: number) => void
    decrementTimer: () => void
    pause: ({ playSound }?: { playSound?: boolean }) => void
    play: ({ playSound }?: { playSound?: boolean }) => void
    countdown: (settingsActions: SetLocalStorageSettings) => void
    handleActivityEnd: (settingsActions: SetLocalStorageSettings) => void
    handleBreakEnd: (settingsActions: SetLocalStorageSettings) => void

    handlePomodoroEnd: (
      settingsActions: SetLocalStorageSettings,
      newLongBreakIntervalCount: number,
    ) => void

    transitionToActivity: (
      nextActivity: Activity,
      settingsActions: SetLocalStorageSettings,
      newSettings?: MakeOptional<TimerDefaults>,
    ) => void
  }
}

export const useTimerStore = create<TimerStore>((set, get) => {
  return {
    currentActivity: timerDefaults.defaultActivity,
    timer: timerDefaults.activityDuration[timerDefaults.defaultActivity],
    isTimerRunning: false,

    pomodoro: timerDefaults.activityDuration.pomodoro,
    shortBreak: timerDefaults.activityDuration.shortBreak,
    longBreak: timerDefaults.activityDuration.longBreak,
    longBreakInterval: timerDefaults.longBreakInterval,
    longBreakIntervalCount: timerDefaults.longBreakIntervalCount,
    autoStart: timerDefaults.autoStart,

    currentBackgroundSound: "off",

    settingsActions: {
      changeActivityDuration: (newDuration, activity) => {
        set({ [activity]: newDuration })
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

      changeLongBreakInterval: (newInterval) => {
        set({ longBreakInterval: newInterval })
      },

      changeLongBreakIntervalCount: (newCount) => {
        set({ longBreakIntervalCount: newCount })
      },

      changeActivityTimer: (newTimer, activity) => {
        set({ [activity]: newTimer })
      },

      changeAutoStart: (autoStart) => {
        set({ autoStart })
      },

      changeBackgroundSound: (backgroundSound) => {
        set({ currentBackgroundSound: backgroundSound })
      },
    },

    actions: {
      getTimer: () => get()[get().currentActivity],

      changeTimer: (newTimer: number) => {
        set({ timer: newTimer })
      },

      decrementTimer: () => {
        const { timer } = get()
        const updatedTimer = timer - 1000
        set({ timer: updatedTimer })
      },

      handleActivityEnd: (setLocalStorageSettings) => {
        const { currentActivity, longBreakIntervalCount } = get()
        const { handleBreakEnd, handlePomodoroEnd } = get().actions

        playAlarmSound()
        set({ isTimerRunning: false })

        if (currentActivity === "pomodoro") {
          const newLongBreakIntervalCount = longBreakIntervalCount + 1
          handlePomodoroEnd(setLocalStorageSettings, newLongBreakIntervalCount)
        } else {
          handleBreakEnd(setLocalStorageSettings)
        }
      },

      handlePomodoroEnd: (
        setLocalStorageSettings,
        newLongBreakIntervalCount,
      ) => {
        const { longBreakInterval } = get()
        const { transitionToActivity } = get().actions

        const shouldNextActivityBeLongBreak =
          newLongBreakIntervalCount === longBreakInterval

        if (shouldNextActivityBeLongBreak) {
          set({ longBreakIntervalCount: 0 })
          transitionToActivity("longBreak", setLocalStorageSettings, {
            longBreakIntervalCount: 0,
          })
        } else {
          set({ longBreakIntervalCount: newLongBreakIntervalCount })
          transitionToActivity("shortBreak", setLocalStorageSettings, {
            longBreakIntervalCount: newLongBreakIntervalCount,
          })
        }
      },

      handleBreakEnd: (setLocalStorageSettings) => {
        const { transitionToActivity } = get().actions
        transitionToActivity("pomodoro", setLocalStorageSettings)
      },

      transitionToActivity: (
        nextActivity,
        setLocalStorageSettings,
        newSettings,
      ) => {
        const { autoStart } = get()
        const nextTimer = get()?.[nextActivity]

        setLocalStorageSettings((currentSettings) => ({
          ...currentSettings,
          ...newSettings,
        }))

        set({
          currentActivity: nextActivity,
          timer: nextTimer,
        })

        autoStart && set({ isTimerRunning: true })
      },

      countdown: (setLocalStorageSettings) => {
        const { timer } = get()
        const { decrementTimer, handleActivityEnd } = get().actions

        if (timer > 0) {
          decrementTimer()
        } else {
          handleActivityEnd(setLocalStorageSettings)
        }
      },

      play: ({ playSound = true } = {}) => {
        set({ isTimerRunning: true })
        playSound && playToggleTimerSound()
      },

      pause: ({ playSound = true } = {}) => {
        set({ isTimerRunning: false })
        playSound && playToggleTimerSound()
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

export const useIsTimerRunning = () =>
  useTimerStore((state) => state.isTimerRunning)

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

export const useCurrentBackgroundSound = () =>
  useTimerStore((state) => state.currentBackgroundSound)
