import { Activities } from "@/lib/constants"
import {
  useAutoPlayBackgroundSound,
  useCurrentActivity,
  useIsRunning,
} from "@/lib/timer-store"
import { useEffect, useState } from "react"

const AUDIO_WHITE_NOISE = "../audio/underwater-white-noise.mp3"
let audio: HTMLAudioElement | null = null

if (typeof window !== "undefined") {
  audio = new Audio(AUDIO_WHITE_NOISE)
}

export function useBackgroundSound() {
  const isRunning = useIsRunning()
  const autoPlay = useAutoPlayBackgroundSound()
  const currentActivity = useCurrentActivity()
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!audio) return

    audio.loop = true
    audio.volume = 0.5

    if (!isRunning && isPlaying) {
      setIsPlaying(false)
      audio.pause()
    }

    if (currentActivity !== Activities.POMODORO) return

    if (isRunning && autoPlay && !isPlaying) {
      setIsPlaying(true)
      void audio.play()
    }
  }, [isRunning, isPlaying, autoPlay, currentActivity])
}
