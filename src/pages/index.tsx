import { BackGroundSoundsMenu } from "@/components/bg-sounds-menu"
import { DevModeTimer } from "@/components/dev-mode-timer"
import { SettingsMenu } from "@/components/settings-menu"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  type DirectionClicked,
  useCurrentActivity,
  useFormattedTimer,
  useIsTimerRunning,
  useSettingsActions,
  useTimerActions,
} from "@/lib/timer-store"
import { formatActivityName, useCountdown } from "@/lib/timer-utils"
import { useShortcuts } from "@/lib/use-shortcuts"
import { signIn, signOut } from "@/utils/supabase"
import { ExitIcon, PersonIcon } from "@radix-ui/react-icons"
import { useSession } from "@supabase/auth-helpers-react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react"
import NextHead from "next/head"
import { useState } from "react"
import { useSwipeable } from "react-swipeable"

export default function Home() {
  useCountdown()

  return (
    <>
      <TabTitleTimer />

      <div className=" flex h-screen justify-center md:items-start">
        <div className="flex w-[600px] flex-col justify-between md:justify-start">
          <Header />

          <CommandCenter />

          <div className="mb-[20%] flex flex-col items-center justify-between gap-36 py-[25%] md:my-24 md:mb-0 md:py-0">
            <Timer />
            <PlayPauseButton />
          </div>
        </div>
      </div>
    </>
  )
}

function CommandCenter() {
  const { isCommandCenterOpen, setIsCommandCenterOpen } = useShortcuts()

  return (
    <CommandDialog
      open={isCommandCenterOpen}
      onOpenChange={setIsCommandCenterOpen}
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

function TabTitleTimer() {
  const currentActivity = useCurrentActivity()
  const timer = useFormattedTimer(true)

  const title = `${timer} - Toki - ${formatActivityName(currentActivity)}`

  return (
    <NextHead>
      <title>{title}</title>
    </NextHead>
  )
}

function Header() {
  return (
    <div className="flex justify-between p-5">
      <div className="flex items-center gap-4">
        <SettingsMenu />
        <BackGroundSoundsMenu />

        {process.env.NODE_ENV === "development" && <DevModeTimer />}
      </div>
      <SignInButton />
    </div>
  )
}

function SignInButton() {
  const session = useSession()
  const isSignedIn = !!session

  const icon = isSignedIn ? (
    <ExitIcon className="mr-2 h-4 w-4" />
  ) : (
    <PersonIcon className="mr-2 h-4 w-4" />
  )
  const text = isSignedIn ? "Sign out" : "Sign in"

  const handleClick = () => (isSignedIn ? signOut() : signIn())

  return (
    <Button onClick={handleClick} variant="outline">
      {icon}
      <span>{text}</span>
    </Button>
  )
}

function Timer() {
  const { changeCurrentActivity } = useSettingsActions()
  const timer = useFormattedTimer()
  const currentActivity = useCurrentActivity()
  const isTimerRunning = useIsTimerRunning()

  const handleSwipe = useSwipeable({
    onSwipedLeft: () => !isTimerRunning && changeCurrentActivity("right"),
    onSwipedRight: () => !isTimerRunning && changeCurrentActivity("left"),
  })

  const activityName = formatActivityName(currentActivity)

  return (
    <div {...handleSwipe} className="flex items-center md:gap-10">
      {!isTimerRunning && <ChangeActivityButton direction="left" />}

      <div className="flex w-[260px] flex-col items-center gap-2 md:w-[420px] md:text-2xl">
        <p>{activityName}</p>
        <p className="text-6xl font-bold text-gray-600 md:text-8xl">{timer}</p>
        <div className="h-5" />
      </div>

      {!isTimerRunning && <ChangeActivityButton direction="right" />}
    </div>
  )
}

function ChangeActivityButton({ direction }: { direction: DirectionClicked }) {
  const { changeCurrentActivity } = useSettingsActions()

  const icon = direction === "left" ? <IconChevronLeft /> : <IconChevronRight />

  function handleClick() {
    changeCurrentActivity(direction)
  }

  return (
    <button
      className="flex items-center justify-center rounded-full border border-gray-300 p-1 text-gray-500 hover:bg-gray-100"
      onClick={handleClick}
    >
      {icon}
    </button>
  )
}

function PlayPauseButton() {
  const { play, pause } = useTimerActions()
  const isTimerRunning = useIsTimerRunning()

  function handleClick() {
    return isTimerRunning ? pause() : play()
  }

  const icon = isTimerRunning ? (
    <IconPlayerPauseFilled className="h-9 w-9 md:h-11 md:w-11" />
  ) : (
    <IconPlayerPlayFilled className="h-9 w-9 md:h-11 md:w-11" />
  )

  return (
    <button
      className="flex h-20 w-24 items-center justify-center rounded-3xl bg-gray-600 text-white md:h-24 md:w-32"
      onClick={handleClick}
    >
      {icon}
    </button>
  )
}
