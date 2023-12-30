import {
  useBgSoundActions,
  useBgSoundIsPlaying,
  useBgSoundVolume,
} from "@/lib/bg-sound-store"
import { ACTIVITIES, BACKGROUND_SOUNDS_NAMES } from "@/lib/constants"
import {
  useCurrentActivity,
  useCurrentBackgroundSound,
  useIsTimerRunning,
} from "@/lib/timer-store"
import { useCallback, useEffect } from "react"
import useSound from "use-sound"

export function useWhiteNoise() {
  const { setIsplaying } = useBgSoundActions()
  const isPlaying = useBgSoundIsPlaying()
  const volume = useBgSoundVolume()
  const isTimerRunning = useIsTimerRunning()
  const currentActivity = useCurrentActivity()
  const currentBackgroundSound = useCurrentBackgroundSound()

  const [play, { stop, pause }] = useSound(
    BACKGROUND_SOUNDS_NAMES[currentBackgroundSound],
    {
      loop: true,
      volume: volume / 10,
    },
  )

  const shouldPlayBackgroundSound = useCallback(() => {
    return (
      currentActivity === ACTIVITIES.POMODORO &&
      currentBackgroundSound !== "off"
    )
  }, [currentActivity, currentBackgroundSound])

  const startPlaying = useCallback(() => {
    setIsplaying(true)
    play()
  }, [setIsplaying, play])

  const stopPlaying = useCallback(() => {
    setIsplaying(false)
    pause()
  }, [setIsplaying, pause])

  useEffect(() => {
    if (!shouldPlayBackgroundSound()) {
      stopPlaying()
      return
    }

    if (isTimerRunning) {
      startPlaying()
    } else if (isPlaying) {
      stopPlaying()
    }

    return () => {
      stop()
    }
  }, [
    isPlaying,
    isTimerRunning,
    shouldPlayBackgroundSound,
    startPlaying,
    stop,
    stopPlaying,
  ])
}
