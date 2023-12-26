import { type Activity, type BackgroundSound } from "@/lib/timer-store"

export const ACTIVITIES = {
  POMODORO: "pomodoro",
  SHORT_BREAK: "shortBreak",
  LONG_BREAK: "longBreak",
} as const

export const ACTIVITY_DURATION = {
  DEV: {
    pomodoro: 1000 * 3,
    shortBreak: 1000 * 1,
    longBreak: 1000 * 2,
  },
  PROD: {
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

export const TIMER_DEFAULTS: TimerDefaults = {
  defaultActivity: ACTIVITIES.POMODORO,
  activityDuration: ACTIVITY_DURATION.PROD,
  longBreakInterval: 3,
  longBreakIntervalCount: 0,
  autoStart: false,
}

export const TIMER_DURATION_LIMIT = {
  LOWEST: 1000 * 60 * 5,
  HIGHEST: 1000 * 60 * 999,
}

type ActivityStateTransitions = Record<
  Activity,
  {
    left: Activity
    right: Activity
  }
>

export const ACTIVITY_STATE_TRANSITIONS: ActivityStateTransitions = {
  [ACTIVITIES.POMODORO]: {
    left: ACTIVITIES.LONG_BREAK,
    right: ACTIVITIES.SHORT_BREAK,
  },
  [ACTIVITIES.SHORT_BREAK]: {
    left: ACTIVITIES.POMODORO,
    right: ACTIVITIES.LONG_BREAK,
  },
  [ACTIVITIES.LONG_BREAK]: {
    left: ACTIVITIES.SHORT_BREAK,
    right: ACTIVITIES.POMODORO,
  },
}

export type Sound = {
  name: string
  value: BackgroundSound
  checked: boolean
}

export const BACKGROUND_SOUNDS: Sound[] = [
  {
    name: "Underwater",
    value: "underwater",
    checked: false,
  },
  {
    name: "Birds",
    value: "birds",
    checked: false,
  },
  {
    name: "Off",
    value: "off",
    checked: true,
  },
]

const AUDIO_UNDERWATER_WHITE_NOISE = "../audio/underwater.mp3"
const AUDIO_BIRDS = "../audio/birds.mp3"

export const BACKGROUND_SOUNDS_NAMES: Record<BackgroundSound, string> = {
  underwater: AUDIO_UNDERWATER_WHITE_NOISE,
  birds: AUDIO_BIRDS,
  off: AUDIO_UNDERWATER_WHITE_NOISE,
}

export const SHORTCUT_KEYS = {
  BG_SOUND_MENU: ["b", "B"],
  COMMAND_CENTER: ["k", "K"],
  CTRL_OR_META: (e: KeyboardEvent) => e.metaKey || e.ctrlKey,
  HELP_MODAL: "/",
  SETINGS_MENU: ["s", "S"],
  SPACEBAR: " ",
  TOGGLE_TIMER: ["p", "P"],
  SWITCH_ACTIVITY_LEFT: ["ArrowLeft", "j", "J"],
  SWITCH_ACTIVITY_RIGHT: ["ArrowRight", "k", "K"],
}
