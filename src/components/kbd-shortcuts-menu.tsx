import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import {
  useIsHelpModalOpen,
  useKeyboardShortcutsModalActions,
} from "@/lib/kbd-shortcuts-modal-store"
import { Cross2Icon } from "@radix-ui/react-icons"

export function KeyboardShortcutsMenu() {
  const isHelpModalOpen = useIsHelpModalOpen()
  const { setHelpModalOpen } = useKeyboardShortcutsModalActions()

  return (
    <div className="gap-4 flex-center">
      <span>Shortcuts</span>

      <Dialog open={isHelpModalOpen} onOpenChange={setHelpModalOpen}>
        <DialogTrigger>
          <kbd className="pointer-events-none h-10 w-14 select-none gap-1 rounded border font-semibold text-muted-foreground opacity-100 flex-center">
            <span>⌘ /</span>
          </kbd>
        </DialogTrigger>

        <DialogContent
          className="flex max-w-xl flex-col gap-5"
          standardCloseButton={false}
        >
          <DialogHeader className="mt-2">
            <DialogTitle className="text-lg">Keyboard Shortcuts</DialogTitle>
            <DialogClose className="absolute right-6 top-7 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <Cross2Icon className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>

          <DropdownMenuSeparator />

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-2">
              <span className="ml-2">Play/Pause Timer</span>

              <div className="gap-4 flex-center">
                <div className="gap-4 flex-center">
                  <kbd className="pointer-events-none h-12 w-32 select-none gap-1 rounded border text-base font-semibold text-muted-foreground opacity-100 flex-center">
                    <span>⌘ P</span>
                  </kbd>
                </div>

                <span className="">or</span>

                <div className="gap-4 flex-center">
                  <kbd className="pointer-events-none h-12 w-32 select-none gap-1 rounded border font-semibold text-muted-foreground opacity-100 flex-center">
                    <span>Spacebar</span>
                  </kbd>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="ml-2">Change Activity</span>

              <div className="gap-4 flex-center">
                <div className="gap-4 flex-center">
                  <kbd className="pointer-events-none h-12 w-14 select-none gap-1 rounded border text-xl font-semibold text-muted-foreground opacity-100 flex-center">
                    <span>&larr;</span>
                  </kbd>

                  <kbd className="pointer-events-none h-12 w-14 select-none gap-1 rounded border text-xl font-semibold text-muted-foreground opacity-100 flex-center">
                    <span>&#8594;</span>
                  </kbd>
                </div>

                <span className="">or</span>

                <div className="gap-4 flex-center">
                  <kbd className="pointer-events-none h-12 w-14 select-none gap-1 rounded border font-semibold text-muted-foreground opacity-100 flex-center">
                    <span>⌘ J</span>
                  </kbd>

                  <kbd className="pointer-events-none h-12 w-14 select-none gap-1 rounded border font-semibold text-muted-foreground opacity-100 flex-center">
                    <span>⌘ K</span>
                  </kbd>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="ml-2">White Noise</span>

              <kbd className="pointer-events-none h-12 w-32 select-none gap-1 rounded border text-base font-semibold text-muted-foreground opacity-100 flex-center">
                <span>⌘ W</span>
              </kbd>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="ml-2">Settings</span>

              <kbd className="pointer-events-none h-12 w-32 select-none gap-1 rounded border text-base font-semibold text-muted-foreground opacity-100 flex-center">
                <span>⌘ S</span>
              </kbd>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
