import { activitiesDurationDefault, activityTransitions } from "@/lib/constants"
import {
  type Activity,
  type DirectionClicked,
  useIsRunning,
  useIsTimerFinished,
  useTimerActions,
} from "@/lib/timer-store"
import { useEffect } from "react"

const bubble = "../audio/bubble.mp3"
const toggleTimer = "../audio/toggle-timer.mp3"

export function playAlarmSound() {
  const alarmSound = new Audio(bubble)
  void alarmSound.play()
}

export function playToggleTimerSound() {
  const toggleTimerSound = new Audio(toggleTimer)
  void toggleTimerSound.play()
}

export function decideNextTimer(currentActivity: Activity) {
  switch (currentActivity) {
    case "pomodoro":
      return activitiesDurationDefault.pomodoro
    case "short_break":
      return activitiesDurationDefault.short_break
    case "long_break":
      return activitiesDurationDefault.long_break
  }
}

export function decideNextActivity(
  currentActivity: Activity,
  directionClicked: DirectionClicked,
) {
  return activityTransitions[currentActivity][directionClicked]
}

export function formatActivityName(activity: Activity) {
  switch (activity) {
    case "pomodoro":
      return "Pomodoro"
    case "short_break":
      return "Short Break"
    case "long_break":
      return "Long Break"
  }
}

export function formatTimer(timer: number, useInTabTitle = false) {
  const addZeroBefore = (timer: number) => ("0" + timer.toString()).slice(-2)
  const minutes = Math.floor(timer / 1000 / 60)
  const seconds = Math.floor(timer / 1000) % 60

  const formattedTimer = `${addZeroBefore(minutes)} : ${addZeroBefore(seconds)}`

  if (useInTabTitle) {
    return formattedTimer.replace(/\s/g, "")
  }

  return formattedTimer
}

export function useCountdown() {
  const { countdown } = useTimerActions()
  const isRunning = useIsRunning()
  const isTimerFinished = useIsTimerFinished()

  useEffect(() => {
    if (isRunning) {
      const countdownInterval = setInterval(() => {
        countdown()
      }, 1000)

      return () => clearInterval(countdownInterval)
    }
  }, [countdown, isRunning, isTimerFinished])
}
