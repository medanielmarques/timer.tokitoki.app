import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useBackgroundSound } from "@/lib/use-bg-sound"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Headphones } from "react-feather"

export function BackGroundSoundsMenu() {
  const {
    volume,
    decreaseVolume,
    increaseVolume,
    handleOnCheckedChange,
    sounds,
  } = useBackgroundSound()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-gray-500 hover:text-accent-foreground">
        <Headphones className="h-6 w-6 md:h-6 md:w-6" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48 px-2 text-center">
        <DropdownMenuLabel className="flex items-center justify-center gap-3">
          <p>Background Sound</p>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger>
                <InfoCircledIcon className="h-5 w-5 text-gray-600" />
              </TooltipTrigger>

              <TooltipContent>
                <p>Background sound only plays when the timer is active</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <Button
          variant="outline"
          className="h-11 rounded-br-none rounded-tr-none border-[1.5px] border-gray-300 text-xl font-medium"
          onClick={decreaseVolume}
        >
          -
        </Button>
        <Input
          type="text"
          className="h-11 w-16 rounded-none border-[1.5px] border-x-0 border-gray-300 text-center text-lg font-semibold"
          value={volume}
          onChange={() => {}}
        />
        <Button
          variant="outline"
          className="h-11 rounded-bl-none rounded-ss-none border-[1.5px] border-gray-300 text-xl font-medium"
          onClick={increaseVolume}
        >
          +
        </Button>

        {sounds.map((sound) => (
          <DropdownMenuCheckboxItem
            key={sound.value}
            checked={sound.checked}
            onCheckedChange={() => handleOnCheckedChange(sound)}
          >
            {sound.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
