import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useWhiteNoise } from "@/components/white-noise/use-white-noise"
import {
  useIsWhiteNoiseEnabled,
  useIsWhiteNoiseMenuOpen,
  useWhiteNoiseActions,
  useWhiteNoiseVolume,
} from "@/components/white-noise/white-noise-store"
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

  const switchText = isWhiteNoiseEnabled ? "ON" : "OFF"

  return (
    <Sheet open={isWhiteNoiseMenuOpen} onOpenChange={setIsWhiteNoiseMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Headphones className="h-6 w-6 md:h-6 md:w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="flex flex-col">
        <SheetHeader className="flex items-center  border-b-[1px]">
          <SheetTitle className="mb-4 gap-2 text-2xl font-bold flex-center">
            <span>White Noise</span>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger tabIndex={-1} className="mt-1">
                  <Info className="h-5 w-5" />
                </TooltipTrigger>

                <TooltipContent>
                  <span>White noise only plays when the timer is active</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SheetTitle>
        </SheetHeader>

        <div className="gap-5 py-4 flex-center">
          <div className="gap-3 flex-center">
            <span className="font-bold">{switchText}</span>
            <Switch
              checked={isWhiteNoiseEnabled}
              onCheckedChange={() => handleOnCheckedChange()}
            />
          </div>

          <div className="gap-4 flex-center">
            <Button
              variant="ghost"
              className="w-13 h-10 font-medium"
              onClick={decreaseVolume}
              disabled={volume === 0}
            >
              <SpeakerSimpleLow className="h-5 w-5" />
            </Button>

            <span className="text-xl font-semibold">{volume}</span>

            <Button
              variant="ghost"
              className="w-13 h-10 font-medium"
              onClick={increaseVolume}
              disabled={volume === 10}
            >
              <SpeakerSimpleHigh className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
