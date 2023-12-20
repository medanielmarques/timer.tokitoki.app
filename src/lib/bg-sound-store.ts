import {
  ACTIVITIES,
  BACKGROUND_SOUNDS,
  BACKGROUND_SOUNDS_NAMES,
} from "@/lib/constants"
import {
  type BackgroundSound,
  useCurrentActivity,
  useCurrentBackgroundSound,
  useIsTimerRunning,
  useTimerStore,
} from "@/lib/timer-store"
import { useEffect } from "react"
import useSound from "use-sound"
import { create } from "zustand"

type Sound = {
  name: string
  value: BackgroundSound
  checked: boolean
}

type BackgroundSoundStore = {
  isBgSoundMenuopen: boolean
  isPlaying: boolean
  volume: number
  sounds: Sound[]

  actions: {
    setIsplaying: (isPlaying: boolean) => void
    handleOnCheckedChange: (sound: Sound) => void
    increaseVolume: () => void
    decreaseVolume: () => void
    setIsBgSoundMenuOpen: (isBgSoundMenuopen: boolean) => void
    handleKeyDown: (e: KeyboardEvent) => void
  }
}

export const useBackgroundSoundStore = create<BackgroundSoundStore>(
  (set, _get) => {
    const { settingsActions } = useTimerStore.getState()

    return {
      isBgSoundMenuopen: false,
      isPlaying: false,
      volume: 5,
      sounds: BACKGROUND_SOUNDS,

      actions: {
        handleOnCheckedChange: (sound) => {
          if (sound.checked) return

          set((state) => ({
            sounds: state.sounds.map((prevSound) => ({
              ...prevSound,
              checked: prevSound.value === sound.value,
            })),
          }))

          settingsActions.changeBackgroundSound(sound.value)
        },

        setIsplaying: (isPlaying) => set({ isPlaying }),

        setIsBgSoundMenuOpen: (isBgSoundMenuopen) => set({ isBgSoundMenuopen }),

        increaseVolume: () => {
          set((state) => ({
            volume: state.volume === 10 ? state.volume : state.volume + 1,
          }))
        },

        decreaseVolume: () => {
          set((state) => ({
            volume: state.volume === 0 ? state.volume : state.volume - 1,
          }))
        },

        handleKeyDown: (e) => {
          const backgroundSoundShortcuts = ["b", "B"]

          if (backgroundSoundShortcuts.includes(e.key)) {
            e.preventDefault()
            set((state) => ({ isBgSoundMenuopen: !state.isBgSoundMenuopen }))
          }
        },
      },
    }
  },
)

export const useIsBgSoundMenuOpen = () =>
  useBackgroundSoundStore((state) => state.isBgSoundMenuopen)

export const useBgSoundIsPlaying = () =>
  useBackgroundSoundStore((state) => state.isPlaying)

export const useBgSoundVolume = () =>
  useBackgroundSoundStore((state) => state.volume)

export const useBgSoundSounds = () =>
  useBackgroundSoundStore((state) => state.sounds)

export const useBgSoundActions = () =>
  useBackgroundSoundStore((state) => state.actions)
