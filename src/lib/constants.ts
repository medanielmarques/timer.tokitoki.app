import { type Activity } from "@/lib/timer-store"

const activitiesDurationDev = {
  pomodoro: 1000 * 4,
  short_break: 1000 * 2,
  long_break: 1000 * 3,
}

const activitiesDurationProd = {
  pomodoro: 1000 * 60 * 25,
  short_break: 1000 * 60 * 5,
  long_break: 1000 * 60 * 15,
}

export const activitiesDurationDefault =
  process.env.NODE_ENV === "production"
    ? activitiesDurationProd
    : activitiesDurationDev

type TimerDefaults = {
  activity: Activity
  timer: number
  formattedTimer: string
}

export const timerDefaults: TimerDefaults = {
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

export const activityTransitions: ActivityTransitions = {
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
