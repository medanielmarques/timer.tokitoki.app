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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useBgSoundActions } from "@/lib/bg-sound-store"
import {
  useIsHelpModalOpen,
  useKeyboardShortcutsModalActions,
} from "@/lib/kbd-shortcuts-modal-store"
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
  const isHelpModalOpen = useIsHelpModalOpen()
  const { setHelpModalOpen } = useKeyboardShortcutsModalActions()

  return (
    <>
      <div className="gap-4 flex-center">
        <div className="gap-2 flex-center">
          <span>Command Center</span>
          <kbd className="pointer-events-none h-8 w-11 select-none gap-1 rounded border bg-muted font-mono font-semibold text-muted-foreground opacity-100 flex-center">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </div>

        <div className="gap-2 flex-center">
          <span>Shortcuts</span>

          <Dialog open={isHelpModalOpen} onOpenChange={setHelpModalOpen}>
            <DialogTrigger>
              <kbd className="pointer-events-none h-8 w-11 select-none gap-1 rounded border bg-muted font-mono font-semibold text-muted-foreground opacity-100 flex-center">
                <span>/</span>
              </kbd>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Keyboard Shortcuts</DialogTitle>
              </DialogHeader>

              <DropdownMenuSeparator />

              <div>Shortcuts goes here</div>
            </DialogContent>
          </Dialog>
        </div>
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
    </>
  )
}
