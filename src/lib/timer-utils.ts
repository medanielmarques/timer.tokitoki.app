import {
  type Activity,
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

export function formatActivity(activity: Activity) {
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
      if (isTimerFinished) {
        playAlarmSound()
        // restart()
      }

      const countdownInterval = setInterval(() => {
        countdown()
      }, 1000)

      return () => clearInterval(countdownInterval)
    }
  }, [countdown, isRunning, isTimerFinished])
}
