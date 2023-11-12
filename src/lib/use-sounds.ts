import useSound from "use-sound"

const bubble_sfx = "../audio/bubble.mp3"
const toggle_timer_sfx = "../audio/toggle-timer.mp3"

export const useSounds = () => {
  const [play_alarm_sound] = useSound(bubble_sfx, {
    volume: 100 / 100,
  })

  const [play_toggle_timer_sound] = useSound(toggle_timer_sfx, { volume: 1 })

  return { play_alarm_sound, play_toggle_timer_sound }
}
