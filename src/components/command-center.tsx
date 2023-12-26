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
import { useBgSoundActions } from "@/lib/bg-sound-store"
import { useSettingsMenuActions } from "@/lib/settings-menu-store"
import { useLocalStorageSettings } from "@/lib/use-local-storage-settings"
import { useShortcuts } from "@/lib/use-shortcuts"
import { MixerHorizontalIcon, ResetIcon } from "@radix-ui/react-icons"
import { Headphones } from "react-feather"

export function CommandCenter() {
  const { isCommandCenterOpen, setIsCommandCenterOpen } = useShortcuts()
  const { setIsBgSoundMenuOpen } = useBgSoundActions()
  const { handleSheetOpenChange } = useSettingsMenuActions()
  const { resetSettings } = useLocalStorageSettings()

  return (
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
              setIsBgSoundMenuOpen(true)
              setIsCommandCenterOpen(false)
            }}
          >
            <div className="gap-2 flex-center">
              <Headphones />
              <span>Background Sounds</span>
            </div>

            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => {
              handleSheetOpenChange()
              setIsCommandCenterOpen(false)
            }}
          >
            <div className="gap-2 flex-center">
              <MixerHorizontalIcon />
              <span>Settings</span>
            </div>

            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
