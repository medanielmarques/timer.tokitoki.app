import useSound from "use-sound"

const bubbleSfx = "../audio/bubble.mp3"
const toggleTimerSfx = "../audio/toggle-timer.mp3"

export const useSounds = () => {
  const [playAlarmSound] = useSound(bubbleSfx, {
    volume: 100 / 100,
  })

  const [playToggleTimerSound] = useSound(toggleTimerSfx, { volume: 1 })

  return { playAlarmSound, playToggleTimerSound }
}
