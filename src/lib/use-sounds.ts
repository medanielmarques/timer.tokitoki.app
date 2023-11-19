import useSound from "use-sound"

const bubble_sfx = "../audio/bubble.mp3"
const toggle_timer_sfx = "../audio/toggle-timer.mp3"

export const useSounds = () => {
  const [playAlarmSound] = useSound(bubble_sfx, {
    volume: 100 / 100,
  })

  const [playToggleTimerSound] = useSound(toggle_timer_sfx, { volume: 1 })

  return { playAlarmSound, playToggleTimerSound }
}
