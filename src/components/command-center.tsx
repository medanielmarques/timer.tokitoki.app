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
  DialogClose,
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
import {
  Cross2Icon,
  MixerHorizontalIcon,
  ResetIcon,
} from "@radix-ui/react-icons"
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
      <div className="hidden md:gap-4 md:flex-center">
        <div className="gap-4 flex-center">
          <span>Command Center</span>
          <kbd className="pointer-events-none h-10 w-14 select-none gap-1 rounded border bg-muted font-semibold text-muted-foreground opacity-100 flex-center">
            <span>⌘ K</span>
          </kbd>
        </div>

        <div className="gap-4 flex-center">
          <span>Shortcuts</span>

          <Dialog open={isHelpModalOpen} onOpenChange={setHelpModalOpen}>
            <DialogTrigger>
              <kbd className="pointer-events-none h-10 w-14 select-none gap-1 rounded border bg-muted font-semibold text-muted-foreground opacity-100 flex-center">
                <span>⌘ /</span>
              </kbd>
            </DialogTrigger>

            <DialogContent
              className="flex max-w-2xl flex-col gap-6"
              standardCloseButton={false}
            >
              <DialogHeader className="mt-4">
                <DialogTitle className="text-xl">
                  Keyboard Shortcuts
                </DialogTitle>
                <DialogClose className="absolute right-10 top-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <Cross2Icon className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </DialogHeader>

              <DropdownMenuSeparator />

              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="ml-2 text-lg">Play/Pause Timer</span>

                  <div className="gap-4 flex-center">
                    <div className="gap-4 flex-center">
                      <kbd className="pointer-events-none h-12 w-44 select-none gap-1 rounded border text-xl font-semibold text-muted-foreground opacity-100 flex-center">
                        <span>⌘ P</span>
                      </kbd>
                    </div>

                    <span className="text-lg">or</span>

                    <div className="gap-4 flex-center">
                      <kbd className="pointer-events-none h-12 w-44 select-none gap-1 rounded border font-semibold text-muted-foreground opacity-100 flex-center">
                        <span>Spacebar</span>
                      </kbd>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="ml-2 text-lg">Change Activity</span>

                  <div className="gap-4 flex-center">
                    <div className="gap-4 flex-center">
                      <kbd className="pointer-events-none h-12 w-20 select-none gap-1 rounded border text-xl font-semibold text-muted-foreground opacity-100 flex-center">
                        <span>&larr;</span>
                      </kbd>

                      <kbd className="pointer-events-none h-12 w-20 select-none gap-1 rounded border text-xl font-semibold text-muted-foreground opacity-100 flex-center">
                        <span>&#8594;</span>
                      </kbd>
                    </div>

                    <span className="text-lg">or</span>

                    <div className="gap-4 flex-center">
                      <kbd className="pointer-events-none h-12 w-20 select-none gap-1 rounded border font-semibold text-muted-foreground opacity-100 flex-center">
                        <span>⌘ J</span>
                      </kbd>

                      <kbd className="pointer-events-none h-12 w-20 select-none gap-1 rounded border font-semibold text-muted-foreground opacity-100 flex-center">
                        <span>⌘ K</span>
                      </kbd>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="ml-2 text-lg">Background Sound</span>

                  <kbd className="pointer-events-none h-12 w-44 select-none gap-1 rounded border text-xl font-semibold text-muted-foreground opacity-100 flex-center">
                    <span>⌘ B</span>
                  </kbd>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="ml-2 text-lg">Settings</span>

                  <kbd className="pointer-events-none h-12 w-44 select-none gap-1 rounded border text-xl font-semibold text-muted-foreground opacity-100 flex-center">
                    <span>⌘ S</span>
                  </kbd>
                </div>
              </div>
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
