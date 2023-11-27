import { type Activity } from "@/lib/timer-store"

const activityDurationDev = {
  pomodoro: 1000 * 4,
  shortBreak: 1000 * 2,
  longBreak: 1000 * 3,
}

const activityDurationProd = {
  pomodoro: 1000 * 60 * 25,
  shortBreak: 1000 * 60 * 5,
  longBreak: 1000 * 60 * 15,
}

export const activityDuration =
  process.env.NODE_ENV !== "production"
    ? activityDurationProd
    : activityDurationDev

type TimerDefaults = {
  activity: Activity
  activityDuration: typeof activityDuration
  formattedTimer: string
  longBreakInterval: number
}

export const timerDefaults: TimerDefaults = {
  activity: "pomodoro",
  activityDuration,
  formattedTimer: "25 : 00",
  longBreakInterval: 3,
}

type ActivityStateTransitions = Record<
  Activity,
  {
    left: Activity
    right: Activity
  }
>

export const activityStateTransitions: ActivityStateTransitions = {
  pomodoro: {
    left: "longBreak",
    right: "shortBreak",
  },
  shortBreak: {
    left: "pomodoro",
    right: "longBreak",
  },
  longBreak: {
    left: "shortBreak",
    right: "pomodoro",
  },
}
