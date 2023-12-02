import { type Activity } from "@/lib/timer-store"

export const activityDurationDev = {
  pomodoro: 1000 * 5,
  shortBreak: 1000 * 2,
  longBreak: 1000 * 3,
}

export const activityDurationProd = {
  pomodoro: 1000 * 60 * 25,
  shortBreak: 1000 * 60 * 5,
  longBreak: 1000 * 60 * 15,
}

export const activityDuration = activityDurationProd

export type TimerDefaults = {
  defaultActivity: Activity
  activityDuration: {
    pomodoro: number
    shortBreak: number
    longBreak: number
  }
  longBreakInterval: number
  longBreakIntervalCount: number
  autoStart: boolean
}

export const timerDefaults: TimerDefaults = {
  defaultActivity: "pomodoro",
  activityDuration,
  longBreakInterval: 3,
  longBreakIntervalCount: 0,
  autoStart: false,
}

export const timerDurationLimit = {
  lowest: 1000 * 60 * 5,
  highest: 1000 * 60 * 999,
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
