import { SHORTCUT_KEYS } from "@/lib/constants"
import { create } from "zustand"

import { useSettingsMenuStore } from "../settings-menu/settings-menu-store"

type WhiteNoiseStore = {
  isWhiteNoiseMenuOpen: boolean
  isWhiteNoisePlaying: boolean
  isWhiteNoiseEnabled: boolean
  volume: number

  actions: {
    setIsWhiteNoisePlaying: (isWhiteNoisePlaying: boolean) => void
    handleOnCheckedChange: () => void
    increaseVolume: () => void
    decreaseVolume: () => void
    setIsWhiteNoiseMenuOpen: (isWhiteNoiseMenuOpen: boolean) => void
    handleWhiteNoiseMenuShortcut: (e: KeyboardEvent) => void
  }
}

export const useWhiteNoiseStore = create<WhiteNoiseStore>((set, _get) => {
  return {
    isWhiteNoiseMenuOpen: false,
    isWhiteNoisePlaying: false,
    isWhiteNoiseEnabled: false,
    volume: 5,

    actions: {
      handleOnCheckedChange: () => {
        set((state) => ({ isWhiteNoiseEnabled: !state.isWhiteNoiseEnabled }))
      },

      setIsWhiteNoisePlaying: (isWhiteNoisePlaying) =>
        set({ isWhiteNoisePlaying }),

      setIsWhiteNoiseMenuOpen: (isWhiteNoiseMenuOpen) =>
        set({ isWhiteNoiseMenuOpen }),

      increaseVolume: () => {
        set((state) => ({ volume: Math.min(state.volume + 1, 10) }))
      },

      decreaseVolume: () => {
        set((state) => ({ volume: Math.max(state.volume - 1, 0) }))
      },

      handleWhiteNoiseMenuShortcut: (e) => {
        const { isSettingsMenuOpen } = useSettingsMenuStore.getState()
        if (isSettingsMenuOpen) return

        if (SHORTCUT_KEYS.WHITE_NOISE_MENU.includes(e.key)) {
          e.preventDefault()
          set((state) => ({
            isWhiteNoiseMenuOpen: !state.isWhiteNoiseMenuOpen,
          }))
        }
      },
    },
  }
})

export const useIsWhiteNoiseMenuOpen = () =>
  useWhiteNoiseStore((state) => state.isWhiteNoiseMenuOpen)

export const useIsWhiteNoisePlaying = () =>
  useWhiteNoiseStore((state) => state.isWhiteNoisePlaying)

export const useIsWhiteNoiseEnabled = () =>
  useWhiteNoiseStore((state) => state.isWhiteNoiseEnabled)

export const useWhiteNoiseVolume = () =>
  useWhiteNoiseStore((state) => state.volume)

export const useWhiteNoiseActions = () =>
  useWhiteNoiseStore((state) => state.actions)
