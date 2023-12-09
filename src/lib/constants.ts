import { type Activity } from "@/lib/timer-store"

export const Activities = {
  POMODORO: "pomodoro",
  SHORT_BREAK: "shortBreak",
  LONG_BREAK: "longBreak",
} as const

export const activityDuration = {
  dev: {
    pomodoro: 1000 * 3,
    shortBreak: 1000 * 1,
    longBreak: 1000 * 2,
  },
  prod: {
    pomodoro: 1000 * 60 * 25,
    shortBreak: 1000 * 60 * 5,
    longBreak: 1000 * 60 * 15,
  },
}

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
  defaultActivity: Activities.POMODORO,
  activityDuration: activityDuration.prod,
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
  [Activities.POMODORO]: {
    left: Activities.LONG_BREAK,
    right: Activities.SHORT_BREAK,
  },
  [Activities.SHORT_BREAK]: {
    left: Activities.POMODORO,
    right: Activities.LONG_BREAK,
  },
  [Activities.LONG_BREAK]: {
    left: Activities.SHORT_BREAK,
    right: Activities.POMODORO,
  },
}
