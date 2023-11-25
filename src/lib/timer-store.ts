import { formatTimer } from "@/lib/timer-utils"
import { create } from "zustand"

export type Activity = "pomodoro" | "short_break" | "long_break"
type DirectionClicked = "left" | "right"

type TimerStore = {
  activity: Activity
  formattedTimer: string
  timer: number
  isRunning: boolean
  isTimerFinished: boolean

  actions: {
    changeActivity: (directionClicked: DirectionClicked) => void
    countdown: () => void
    pause: () => void
    play: () => void
    restart: () => void
  }
}

type TimerDefaults = {
  activity: Activity
  timer: number
  formattedTimer: string
}

const activitiesDurationDefault = {
  pomodoro: 1000 * 60 * 25,
  short_break: 1000 * 60 * 5,
  long_break: 1000 * 60 * 15,
}

const timerDefaults: TimerDefaults = {
  activity: "pomodoro",
  timer: activitiesDurationDefault.pomodoro,
  formattedTimer: "25 : 00",
}

type ActivityTransitions = Record<
  Activity,
  {
    left: Activity
    right: Activity
  }
>

const activityTransitions: ActivityTransitions = {
  pomodoro: {
    left: "long_break",
    right: "short_break",
  },
  short_break: {
    left: "pomodoro",
    right: "long_break",
  },
  long_break: {
    left: "short_break",
    right: "pomodoro",
  },
}

function getActivityTimer(activity: Activity) {
  switch (activity) {
    case "pomodoro":
      return activitiesDurationDefault.pomodoro
    case "short_break":
      return activitiesDurationDefault.short_break
    case "long_break":
      return activitiesDurationDefault.long_break
  }
}

export const useTimerStore = create<TimerStore>((set, get) => {
  return {
    activity: timerDefaults.activity,
    timer: timerDefaults.timer,
    formattedTimer: timerDefaults.formattedTimer,
    isRunning: false,
    isTimerFinished: false,

    actions: {
      changeActivity: (directionClicked) => {
        const { activity } = get()

        const nextActivity = activityTransitions[activity][directionClicked]
        const nextTimer = getActivityTimer(nextActivity)

        set({
          activity: nextActivity,
          timer: nextTimer,
          formattedTimer: formatTimer(nextTimer),
        })
      },

      countdown: () => {
        const { timer } = get()

        if (timer > 0) {
          const updatedTimer = timer - 1000

          set({
            timer: updatedTimer,
            formattedTimer: formatTimer(updatedTimer),
          })
        }
      },

      pause: () => set({ isRunning: false }),
      play: () => set({ isRunning: true }),

      restart: () => {
        // changeTimer(nextActivity), false
      },
    },
  }
})

export const useTimerActions = () => useTimerStore((state) => state.actions)

export const useIsTimerFinished = () =>
  useTimerStore((state) => state.isTimerFinished)

export const useFormattedTimer = () =>
  useTimerStore((state) => state.formattedTimer)

export const useIsRunning = () => useTimerStore((state) => state.isRunning)
export const useCurrentActivity = () => useTimerStore((state) => state.activity)
