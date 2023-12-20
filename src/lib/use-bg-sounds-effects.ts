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
import { useEffect } from "react"
import useSound from "use-sound"

export function useBackgroundSoundEffects() {
  const { handleKeyDown, setIsplaying } = useBgSoundActions()
  const isPlaying = useBgSoundIsPlaying()
  const volume = useBgSoundVolume()
  const isTimerRunning = useIsTimerRunning()
  const currentActivity = useCurrentActivity()
  const currentBackgroundSound = useCurrentBackgroundSound()

  const [play, { stop }] = useSound(
    BACKGROUND_SOUNDS_NAMES[currentBackgroundSound],
    {
      loop: true,
      volume: volume / 10,
    },
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    const shouldPlayBackgroundSound =
      currentActivity === ACTIVITIES.POMODORO &&
      currentBackgroundSound !== "off"

    if (!shouldPlayBackgroundSound) {
      setIsplaying(false)
      stop()
      return
    }

    if (isTimerRunning) {
      setIsplaying(true)
      play()
    } else if (isPlaying) {
      setIsplaying(false)
      stop()
    }

    return () => {
      stop()
    }
  }, [
    isTimerRunning,
    isPlaying,
    play,
    currentActivity,
    currentBackgroundSound,
    stop,
    setIsplaying,
  ])
}
