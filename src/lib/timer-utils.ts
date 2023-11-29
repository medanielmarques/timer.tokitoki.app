import {
  type ActivityDuration,
  activityDuration,
  activityStateTransitions,
  timerDefaults,
} from "@/lib/constants"
import {
  type Activity,
  type DirectionClicked,
  useCurrentActivity,
  useIsRunning,
  useIsTimerFinished,
  useSettingsActions,
  useTimerActions,
} from "@/lib/timer-store"
import { useLocalStorage } from "@mantine/hooks"
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
      return activityDuration.pomodoro
    case "shortBreak":
      return activityDuration.shortBreak
    case "longBreak":
      return activityDuration.longBreak
  }
}

export function decideNextActivity(
  currentActivity: Activity,
  directionClicked: DirectionClicked,
) {
  return activityStateTransitions[currentActivity][directionClicked]
}

export function formatActivityName(activity: Activity) {
  switch (activity) {
    case "pomodoro":
      return "Pomodoro"
    case "shortBreak":
      return "Short Break"
    case "longBreak":
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

export function milsToMins(mils: number) {
  return mils / 1000 / 60
}

export function minsToMils(mins: number) {
  return mins * 1000 * 60
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

export function useLocalStorageTimer() {
  const settingsActions = useSettingsActions()
  const timerActions = useTimerActions()
  const currentActivity = useCurrentActivity()

  const [localStorageTimer, setLocalStorageTimer] = useLocalStorage({
    key: "timerDuration",
    defaultValue: timerDefaults.activityDuration,
  })

  useEffect(() => {
    timerActions.changeTimer(
      localStorageTimer?.[currentActivity] ??
        timerDefaults.activityDuration[currentActivity],
    )
  }, [
    localStorageTimer,
    setLocalStorageTimer,
    settingsActions,
    timerActions,
    currentActivity,
  ])

  return [localStorageTimer, setLocalStorageTimer]
}

export function getActivityDurationFromLocalStorage() {
  if (typeof window !== "undefined") {
    const activityDuration = localStorage.getItem("timerDuration")
    if (activityDuration) {
      return JSON.parse(activityDuration) as ActivityDuration
    }
  }
}
