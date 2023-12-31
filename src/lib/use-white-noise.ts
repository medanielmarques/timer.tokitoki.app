import { ACTIVITIES, AUDIO_WHITE_NOISE } from "@/lib/constants"
import { useCurrentActivity, useIsTimerRunning } from "@/lib/timer-store"
import {
  useIsWhiteNoiseEnabled,
  useIsWhiteNoisePlaying,
  useWhiteNoiseActions,
  useWhiteNoiseVolume,
} from "@/lib/white-noise-store"
import { useCallback, useEffect } from "react"
import useSound from "use-sound"

export function useWhiteNoise() {
  const { setIsWhiteNoisePlaying } = useWhiteNoiseActions()
  const isWhiteNoisePlaying = useIsWhiteNoisePlaying()
  const volume = useWhiteNoiseVolume()
  const isTimerRunning = useIsTimerRunning()
  const currentActivity = useCurrentActivity()
  const isWhiteNoiseEnabled = useIsWhiteNoiseEnabled()

  const [playWhiteNoise, { stop: stopWhiteNoise, pause: pauseWhiteNoite }] =
    useSound(AUDIO_WHITE_NOISE, {
      loop: true,
      volume: volume / 10,
    })

  const shouldPlayWhiteNoise = useCallback(() => {
    return currentActivity === ACTIVITIES.POMODORO && isWhiteNoiseEnabled
  }, [currentActivity, isWhiteNoiseEnabled])

  const startPlaying = useCallback(() => {
    setIsWhiteNoisePlaying(true)
    playWhiteNoise()
  }, [setIsWhiteNoisePlaying, playWhiteNoise])

  const stopPlaying = useCallback(() => {
    setIsWhiteNoisePlaying(false)
    pauseWhiteNoite()
  }, [setIsWhiteNoisePlaying, pauseWhiteNoite])

  useEffect(() => {
    if (!shouldPlayWhiteNoise()) {
      stopPlaying()
      return
    }

    if (isTimerRunning) {
      startPlaying()
    } else if (isWhiteNoisePlaying) {
      stopPlaying()
    }

    return () => {
      stopWhiteNoise()
    }
  }, [
    isTimerRunning,
    isWhiteNoisePlaying,
    shouldPlayWhiteNoise,
    startPlaying,
    stopPlaying,
    stopWhiteNoise,
  ])
}
