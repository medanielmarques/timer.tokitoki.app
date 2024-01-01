import { useIsCommandCenterOpen } from "@/components/command-center/command-center-store"
import { useIsSettingsMenuOpen } from "@/components/settings-menu/settings-menu-store"
import { useIsHelpModalOpen } from "@/components/shortcuts/shortcuts-modal-store"
import { useIsWhiteNoiseMenuOpen } from "@/components/white-noise/white-noise-store"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useIsAnyMenuOpen() {
  const isHelpModalOpen = useIsHelpModalOpen()
  const isSettingsMenuOpen = useIsSettingsMenuOpen()
  const isWhiteNoiseMenuOpen = useIsWhiteNoiseMenuOpen()
  const isCommandCenterOpen = useIsCommandCenterOpen()

  return (
    isHelpModalOpen ||
    isSettingsMenuOpen ||
    isWhiteNoiseMenuOpen ||
    isCommandCenterOpen
  )
}
