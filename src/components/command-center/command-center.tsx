import { useSettingsMenuActions } from "@/components/settings-menu/settings-menu-store"
import { KeyboardShortcutsMenu } from "@/components/shortcuts/shortcuts-menu"
import { useShortcuts } from "@/components/shortcuts/use-shortcuts"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useWhiteNoiseActions } from "@/components/white-noise/white-noise-store"
import { useLocalStorageSettings } from "@/lib/use-local-storage-settings"
import { Headphones, SlidersHorizontal } from "@phosphor-icons/react"
import { ResetIcon } from "@radix-ui/react-icons"

export function CommandCenter() {
  const { isCommandCenterOpen, setIsCommandCenterOpen } = useShortcuts()
  const { setIsWhiteNoiseMenuOpen } = useWhiteNoiseActions()
  const { handleSheetOpenChange } = useSettingsMenuActions()
  const { resetSettings } = useLocalStorageSettings()

  return (
    <>
      <div className="hidden md:gap-4 md:flex-center">
        <div className="gap-4 flex-center">
          <span>Command Center</span>
          <kbd className="pointer-events-none h-10 w-14 select-none gap-1 rounded border font-semibold text-muted-foreground opacity-100 flex-center">
            <span>⌘ K</span>
          </kbd>
        </div>

        <KeyboardShortcutsMenu />
      </div>

      <CommandDialog
        open={isCommandCenterOpen}
        onOpenChange={setIsCommandCenterOpen}
      >
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Settings">
            <CommandItem
              onSelect={() => {
                resetSettings()
                setIsCommandCenterOpen(false)
              }}
            >
              <div className="gap-2 flex-center">
                <ResetIcon />
                <span>Reset Settings</span>
              </div>
            </CommandItem>

            <CommandSeparator />

            <CommandItem
              onSelect={() => {
                setIsWhiteNoiseMenuOpen(true)
                setIsCommandCenterOpen(false)
              }}
            >
              <div className="gap-2 flex-center">
                <Headphones />
                <span>White Noise</span>
              </div>

              <CommandShortcut>W</CommandShortcut>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                handleSheetOpenChange()
                setIsCommandCenterOpen(false)
              }}
            >
              <div className="gap-2 flex-center">
                <SlidersHorizontal />
                <span>Settings</span>
              </div>

              <CommandShortcut>S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
