import { ACTIVITIES, ACTIVITY_STATE_TRANSITIONS } from "@/lib/constants"
import {
  type Activity,
  type DirectionClicked,
  useIsTimerRunning,
  useTimerActions,
} from "@/lib/timer-store"
import { useLocalStorageSettings } from "@/lib/use-local-storage-settings"
import { useEffect } from "react"

const AUDIO_ALARM = "../audio/alarm.mp3"
const AUDIO_TOGGLE_TIMER = "../audio/beep.mp3"

export function playAlarmSound() {
  const alarmSound = new Audio(AUDIO_ALARM)
  void alarmSound.play()
}

export function playToggleTimerSound() {
  const toggleTimerSound = new Audio(AUDIO_TOGGLE_TIMER)
  toggleTimerSound.volume = 0.3
  void toggleTimerSound.play()
}

export function decideNextActivity(
  currentActivity: Activity,
  directionClicked: DirectionClicked,
) {
  return ACTIVITY_STATE_TRANSITIONS[currentActivity][directionClicked]
}

export function formatActivityName(activity: Activity) {
  switch (activity) {
    case ACTIVITIES.POMODORO:
      return "Pomodoro"
    case ACTIVITIES.SHORT_BREAK:
      return "Short Break"
    case ACTIVITIES.LONG_BREAK:
      return "Long Break"
  }
}

export function formatTimer(timer: number, useInTabTitle = false) {
  const addZeroBefore = (value: number) => {
    const length = value >= 100 ? 3 : 2
    return ("0".repeat(length) + value).slice(-length)
  }

  const minutes = Math.floor(timer / 1000 / 60)
  const seconds = Math.floor(timer / 1000) % 60

  const formattedTimer = `${addZeroBefore(minutes)} : ${addZeroBefore(seconds)}`

  if (useInTabTitle) {
    return formattedTimer.replace(/\s/g, "")
  }

  return formattedTimer
}

export function milsToMins(mils: number) {
  return mils / 1000 / 60
}

export function minsToMils(mins: number) {
  return mins * 1000 * 60
}

export function useCountdown() {
  const { countdown } = useTimerActions()
  const isTimerRunning = useIsTimerRunning()
  const { setLocalStorageSettings } = useLocalStorageSettings()

  useEffect(() => {
    if (isTimerRunning) {
      const countdownInterval = setInterval(() => {
        countdown(setLocalStorageSettings)
      }, 1000)

      return () => clearInterval(countdownInterval)
    }
  }, [countdown, isTimerRunning, setLocalStorageSettings])
}
