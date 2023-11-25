import { activitiesDurationDefault } from "@/lib/constants"
import { formatTimer, playAlarmSound } from "@/lib/timer-utils"
import { create } from "zustand"

export type Activity = "pomodoro" | "short_break" | "long_break"
type DirectionClicked = "left" | "right"

type TimerStore = {
  activity: Activity
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
        })
      },

      countdown: () => {
        const { timer } = get()

        if (timer > 0) {
          const updatedTimer = timer - 1000
          set({ timer: updatedTimer })
        } else {
          set({
            isRunning: false,
            isTimerFinished: true,
          })
          get().actions.restart()
        }
      },

      pause: () => set({ isRunning: false }),
      play: () => set({ isRunning: true }),

      restart: () => {
        // não tenho como decidir a próxima atividade aqui,
        // pois sem o longBreakInterval não dá pra decidir.
        // Isso vai ser implementado junto com o Settings Menu.
        playAlarmSound()
      },
    },
  }
})

export const useTimerActions = () => useTimerStore((state) => state.actions)

export const useIsTimerFinished = () =>
  useTimerStore((state) => state.isTimerFinished)

export const useTimer = () => useTimerStore((state) => state.timer)
export const useFormattedTimer = (useInTabTitle = false) => {
  const timer = useTimerStore((state) => state.timer)
  return formatTimer(timer, useInTabTitle)
}
export const useIsRunning = () => useTimerStore((state) => state.isRunning)
export const useCurrentActivity = () => useTimerStore((state) => state.activity)
