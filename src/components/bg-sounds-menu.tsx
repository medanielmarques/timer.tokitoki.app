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
import { type BackgroundSound, useSettingsActions } from "@/lib/timer-store"
import { useBackgroundSound } from "@/lib/use-bg-sound"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { Headphones } from "react-feather"

type Sound = {
  name: string
  value: BackgroundSound
  checked: boolean
}

export function BackGroundSoundsMenu() {
  useBackgroundSound()
  const { changeBackgroundSound } = useSettingsActions()

  const [sounds, setSounds] = useState<Sound[]>([
    {
      name: "Underwater",
      value: "underwater",
      checked: false,
    },
    {
      name: "Birds",
      value: "birds",
      checked: false,
    },
    {
      name: "Off",
      value: "off",
      checked: false,
    },
  ])

  function handleOnCheckedChange(sound: Sound) {
    if (sound.checked) return

    setSounds(
      sounds.map((prevSound) => ({
        ...prevSound,
        checked: prevSound.value === sound.value ? true : false,
      })),
    )

    changeBackgroundSound(sound.value)
  }

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
