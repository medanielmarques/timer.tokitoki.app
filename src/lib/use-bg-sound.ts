import { Activities } from "@/lib/constants"
import {
  type BackgroundSound,
  useCurrentActivity,
  useCurrentBackgroundSound,
  useIsTimerRunning,
  useSettingsActions,
} from "@/lib/timer-store"
import { useEffect, useState } from "react"
import useSound from "use-sound"

const AUDIO_UNDERWATER_WHITE_NOISE = "../audio/underwater.mp3"
const AUDIO_BIRDS = "../audio/birds.mp3"

const backgroundSounds: Record<BackgroundSound, string> = {
  underwater: AUDIO_UNDERWATER_WHITE_NOISE,
  birds: AUDIO_BIRDS,
  off: AUDIO_UNDERWATER_WHITE_NOISE,
}

type Sound = {
  name: string
  value: BackgroundSound
  checked: boolean
}

export function useBackgroundSound() {
  const isTimerRunning = useIsTimerRunning()
  const currentActivity = useCurrentActivity()
  const currentBackgroundSound = useCurrentBackgroundSound()
  const { changeBackgroundSound } = useSettingsActions()
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(5)
  const [sounds, setSounds] = useState<Sound[]>([
    {
      name: "Underwater",
      value: "underwater",
      checked: false,
    },
    {
      name: "Birds",
      value: "birds",
      checked: false,
    },
    {
      name: "Off",
      value: "off",
      checked: true,
    },
  ])

  const [play, { stop }] = useSound(backgroundSounds[currentBackgroundSound], {
    loop: true,
    volume: volume / 10,
  })

  function handleOnCheckedChange(sound: Sound) {
    if (sound.checked) return

    setSounds(
      sounds.map((prevSound) => ({
        ...prevSound,
        checked: prevSound.value === sound.value ? true : false,
      })),
    )

    changeBackgroundSound(sound.value)
  }

  function increaseVolume() {
    if (volume === 10) return
    setVolume((curr) => curr + 1)
  }

  function decreaseVolume() {
    if (volume === 0) return
    setVolume((curr) => curr - 1)
  }

  useEffect(() => {
    const shouldPlayBackgroundSound =
      currentActivity === Activities.POMODORO &&
      currentBackgroundSound !== "off"

    if (!shouldPlayBackgroundSound) {
      setIsPlaying(false)
      return () => {
        stop()
      }
    }

    if (isTimerRunning) {
      setIsPlaying(true)
      play()
    } else if (isPlaying) {
      setIsPlaying(false)
      stop()
    }

    return () => {
      stop()
    }
  }, [
    isTimerRunning,
    isPlaying,
    stop,
    play,
    currentActivity,
    currentBackgroundSound,
  ])

  return {
    volume,
    increaseVolume,
    decreaseVolume,
    sounds,
    handleOnCheckedChange,
  }
}
