import { Activities } from "@/lib/constants"
import {
  type BackgroundSound,
  useCurrentActivity,
  useCurrentBackgroundSound,
  useIsRunning,
  useSettingsActions,
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

type Sound = {
  name: string
  value: BackgroundSound
  checked: boolean
}

export function useBackgroundSound() {
  const isRunning = useIsRunning()
  const currentActivity = useCurrentActivity()
  const currentBackgroundSound = useCurrentBackgroundSound()
  const { changeBackgroundSound } = useSettingsActions()
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(100)
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
      checked: false,
    },
  ])

  const [play, { stop }] = useSound(backgroundSounds[currentBackgroundSound], {
    loop: true,
    volume: volume / 100,
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
    if (volume === 100) return
    setVolume((curr) => curr + 10)
  }

  function decreaseVolume() {
    if (volume === 0) return
    setVolume((curr) => curr - 10)
  }

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

  return {
    volume,
    increaseVolume,
    decreaseVolume,
    sounds,
    handleOnCheckedChange,
  }
}
