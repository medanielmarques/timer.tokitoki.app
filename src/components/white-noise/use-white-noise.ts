import {
  useCurrentActivity,
  useIsTimerRunning,
} from "@/components/timer/timer-store"
import {
  useIsWhiteNoiseEnabled,
  useIsWhiteNoisePlaying,
  useWhiteNoiseActions,
  useWhiteNoiseVolume,
} from "@/components/white-noise/white-noise-store"
import { ACTIVITIES, AUDIO_WHITE_NOISE } from "@/lib/constants"
import { useCallback, useEffect } from "react"
import useSound from "use-sound"

export function useWhiteNoise() {
  const { setIsWhiteNoisePlaying } = useWhiteNoiseActions()
  const isWhiteNoisePlaying = useIsWhiteNoisePlaying()
  const volume = useWhiteNoiseVolume()
  const isTimerRunning = useIsTimerRunning()
  const currentActivity = useCurrentActivity()
  const isWhiteNoiseEnabled = useIsWhiteNoiseEnabled()

  const [playWhiteNoise, { pause: pauseWhiteNoite }] = useSound(
    AUDIO_WHITE_NOISE,
    {
      loop: true,
      volume: volume / 10,
    },
  )

  const shouldPlayWhiteNoise = useCallback(() => {
    return currentActivity === ACTIVITIES.POMODORO && isWhiteNoiseEnabled
  }, [currentActivity, isWhiteNoiseEnabled])

  const startPlaying = useCallback(() => {
    setIsWhiteNoisePlaying(true)
    playWhiteNoise()
  }, [setIsWhiteNoisePlaying, playWhiteNoise])

  const pausePlaying = useCallback(() => {
    setIsWhiteNoisePlaying(false)
    pauseWhiteNoite()
  }, [setIsWhiteNoisePlaying, pauseWhiteNoite])

  useEffect(() => {
    if (!shouldPlayWhiteNoise()) {
      pausePlaying()
      return
    }

    if (isTimerRunning) {
      startPlaying()
    } else if (isWhiteNoisePlaying) {
      pausePlaying()
    }

    return () => {
      pauseWhiteNoite()
    }
  }, [
    isTimerRunning,
    isWhiteNoisePlaying,
    shouldPlayWhiteNoise,
    startPlaying,
    pausePlaying,
    pauseWhiteNoite,
  ])
}
