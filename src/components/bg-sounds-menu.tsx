import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  useBgSoundActions,
  useBgSoundSounds,
  useBgSoundVolume,
  useIsBgSoundMenuOpen,
} from "@/lib/bg-sound-store"
import { useWhiteNoise } from "@/lib/use-white-noise"
import {
  Headphones,
  Info,
  SpeakerSimpleHigh,
  SpeakerSimpleLow,
} from "@phosphor-icons/react"

export function BackGroundSoundsMenu() {
  useWhiteNoise()

  const isBgSoundMenuOpen = useIsBgSoundMenuOpen()
  const sounds = useBgSoundSounds()
  const volume = useBgSoundVolume()
  const {
    setIsBgSoundMenuOpen,
    handleOnCheckedChange,
    decreaseVolume,
    increaseVolume,
  } = useBgSoundActions()

  return (
    <DropdownMenu open={isBgSoundMenuOpen} onOpenChange={setIsBgSoundMenuOpen}>
      <DropdownMenuTrigger className="text-gray-500 hover:text-accent-foreground">
        <Headphones className="h-6 w-6 md:h-6 md:w-6" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="px-2 text-center">
        <DropdownMenuLabel className="flex items-center justify-center gap-3">
          <p>Background Sound</p>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-gray-600" />
              </TooltipTrigger>

              <TooltipContent>
                <p>Background sound only plays when the timer is active</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {sounds.map((sound) => (
          <DropdownMenuCheckboxItem
            className="text-base"
            key={sound.value}
            checked={sound.checked}
            onCheckedChange={() => handleOnCheckedChange(sound)}
          >
            {sound.name}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />

        <div className="gap-4 flex-center">
          <Button
            variant="ghost"
            className="w-13 h-10 font-medium text-gray-600"
            onClick={decreaseVolume}
            disabled={volume === 0}
          >
            <SpeakerSimpleLow className="h-5 w-5" />
          </Button>

          <p className="text-lg font-semibold text-gray-600">{volume}</p>

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
