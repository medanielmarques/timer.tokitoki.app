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
import { useSettingsActions } from "@/lib/timer-store"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { Headphones } from "react-feather"

export function BackGroundSoundsMenu() {
  const [isUnderwaterSoundActive, setIsUnderwaterSoundActive] = useState(true)
  const [isBirdsSoundActive, setIsBirdsSoundActive] = useState(false)
  const { changeBackgroundSound } = useSettingsActions()

  function toggleSounds() {
    setIsUnderwaterSoundActive((prev) => !prev)
    setIsBirdsSoundActive((prev) => !prev)
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

        <DropdownMenuCheckboxItem
          checked={isUnderwaterSoundActive}
          onCheckedChange={() => {
            if (isUnderwaterSoundActive) return
            toggleSounds()
            changeBackgroundSound("underwater")
          }}
        >
          Underwater
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={isBirdsSoundActive}
          onCheckedChange={() => {
            if (isBirdsSoundActive) return
            toggleSounds()
            changeBackgroundSound("birds")
          }}
        >
          Birds
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
