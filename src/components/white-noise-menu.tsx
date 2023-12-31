import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useWhiteNoise } from "@/lib/use-white-noise"
import {
  useIsWhiteNoiseEnabled,
  useIsWhiteNoiseMenuOpen,
  useWhiteNoiseActions,
  useWhiteNoiseVolume,
} from "@/lib/white-noise-store"
import {
  Headphones,
  Info,
  SpeakerSimpleHigh,
  SpeakerSimpleLow,
} from "@phosphor-icons/react"

export function WhiteNoiseMenu() {
  useWhiteNoise()

  const isWhiteNoiseMenuOpen = useIsWhiteNoiseMenuOpen()
  const isWhiteNoiseEnabled = useIsWhiteNoiseEnabled()

  const volume = useWhiteNoiseVolume()
  const {
    setIsWhiteNoiseMenuOpen,
    handleOnCheckedChange,
    decreaseVolume,
    increaseVolume,
  } = useWhiteNoiseActions()

  return (
    <DropdownMenu
      open={isWhiteNoiseMenuOpen}
      onOpenChange={setIsWhiteNoiseMenuOpen}
    >
      <DropdownMenuTrigger className="text-gray-500 hover:text-accent-foreground">
        <Headphones className="h-6 w-6 md:h-6 md:w-6" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="px-2 text-center">
        <DropdownMenuLabel className="flex items-center justify-center gap-3">
          <Switch
            checked={isWhiteNoiseEnabled}
            onCheckedChange={() => handleOnCheckedChange()}
          />

          <p>White Noise</p>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-gray-600" />
              </TooltipTrigger>

              <TooltipContent>
                <p>White noise only plays when the timer is active</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            className="w-13 h-10 font-medium text-gray-600"
            onClick={decreaseVolume}
            disabled={volume === 0}
          >
            <SpeakerSimpleLow className="h-5 w-5" />
          </Button>

          <span className="text-lg font-semibold text-gray-600">{volume}</span>

          <Button
            variant="ghost"
            className="w-13 h-10 font-medium text-gray-600"
            onClick={increaseVolume}
            disabled={volume === 10}
          >
            <SpeakerSimpleHigh className="h-5 w-5" />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
