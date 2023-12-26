import { BACKGROUND_SOUNDS, SHORTCUT_KEYS } from "@/lib/constants"
import { type BackgroundSound, useTimerStore } from "@/lib/timer-store"
import { create } from "zustand"

import { useSettingsMenuStore } from "./settings-menu-store"

type Sound = {
  name: string
  value: BackgroundSound
  checked: boolean
}

type BackgroundSoundStore = {
  isBgSoundMenuOpen: boolean
  isPlaying: boolean
  volume: number
  sounds: Sound[]

  actions: {
    setIsplaying: (isPlaying: boolean) => void
    handleOnCheckedChange: (sound: Sound) => void
    increaseVolume: () => void
    decreaseVolume: () => void
    setIsBgSoundMenuOpen: (isBgSoundMenuOpen: boolean) => void
    handleBgSoundMenuShortcut: (e: KeyboardEvent) => void
  }
}

export const useBackgroundSoundStore = create<BackgroundSoundStore>(
  (set, _get) => {
    const { settingsActions } = useTimerStore.getState()

    return {
      isBgSoundMenuOpen: false,
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

        setIsBgSoundMenuOpen: (isBgSoundMenuOpen) => set({ isBgSoundMenuOpen }),

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

        handleBgSoundMenuShortcut: (e) => {
          const { isSettingsMenuOpen } = useSettingsMenuStore.getState()
          if (isSettingsMenuOpen) return

          if (SHORTCUT_KEYS.BG_SOUND_MENU.includes(e.key)) {
            e.preventDefault()
            set((state) => ({ isBgSoundMenuOpen: !state.isBgSoundMenuOpen }))
          }
        },
      },
    }
  },
)

export const useIsBgSoundMenuOpen = () =>
  useBackgroundSoundStore((state) => state.isBgSoundMenuOpen)

export const useBgSoundIsPlaying = () =>
  useBackgroundSoundStore((state) => state.isPlaying)

export const useBgSoundVolume = () =>
  useBackgroundSoundStore((state) => state.volume)

export const useBgSoundSounds = () =>
  useBackgroundSoundStore((state) => state.sounds)

export const useBgSoundActions = () =>
  useBackgroundSoundStore((state) => state.actions)
