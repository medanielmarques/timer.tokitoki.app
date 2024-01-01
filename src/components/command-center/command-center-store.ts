import { create } from "zustand"

type CommandCenterStore = {
  isCommandCenterOpen: boolean
  actions: {
    setIsCommandCenterOpen: (isOpen: boolean) => void
  }
}

const useCommandCenterStore = create<CommandCenterStore>((set) => ({
  isCommandCenterOpen: false,

  actions: {
    setIsCommandCenterOpen: (isOpen: boolean) =>
      set({ isCommandCenterOpen: isOpen }),
  },
}))

export const useIsCommandCenterOpen = () =>
  useCommandCenterStore((state) => state.isCommandCenterOpen)

export const useCommandCenterActions = () =>
  useCommandCenterStore((state) => state.actions)
