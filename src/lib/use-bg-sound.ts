import { Activities } from "@/lib/constants"
import {
  type BackgroundSound,
  useCurrentActivity,
  useCurrentBackgroundSound,
  useIsRunning,
} from "@/lib/timer-store"
import { useEffect, useState } from "react"
import useSound from "use-sound"

const AUDIO_UNDERWATER_WHITE_NOISE = "../audio/underwater.mp3"
const AUDIO_BIRDS = "../audio/birds.mp3"

const backgroundSounds: Record<BackgroundSound, string> = {
  underwater: AUDIO_UNDERWATER_WHITE_NOISE,
  birds: AUDIO_BIRDS,
  off: "",
}

export function useBackgroundSound() {
  const isRunning = useIsRunning()
  const currentActivity = useCurrentActivity()
  const currentBackgroundSound = useCurrentBackgroundSound()
  const [isPlaying, setIsPlaying] = useState(false)

  const [play, { stop }] = useSound(backgroundSounds[currentBackgroundSound], {
    volume: 0.5,
  })

  useEffect(() => {
    if (currentBackgroundSound === "off") return

    if (isRunning && isPlaying) {
      play()
    }

    if (!isRunning && isPlaying) {
      setIsPlaying(false)
      stop()
    }

    if (currentActivity !== Activities.POMODORO) return

    if (isRunning && !isPlaying) {
      setIsPlaying(true)
      play()
    }

    return () => {
      if (isPlaying) stop()
    }
  }, [
    isRunning,
    isPlaying,
    stop,
    play,
    currentActivity,
    currentBackgroundSound,
  ])
}
