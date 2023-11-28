import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { timerDefaults } from "@/lib/constants"
import {
  type DirectionClicked,
  useCurrentActivity,
  useFormattedTimer,
  useIsRunning,
  usePomodoroDuration,
  useSettingsActions,
  useTimer,
  useTimerActions,
} from "@/lib/timer-store"
import {
  formatActivityName,
  milsToMins,
  minsToMils,
  playToggleTimerSound,
  useCountdown,
} from "@/lib/timer-utils"
import { signIn, signOut } from "@/utils/supabase"
import { useLocalStorage } from "@mantine/hooks"
import {
  ClockIcon,
  ExitIcon,
  MixerHorizontalIcon,
  PersonIcon,
} from "@radix-ui/react-icons"
import { useSession } from "@supabase/auth-helpers-react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react"
import NextHead from "next/head"
import { useEffect } from "react"
import { useSwipeable } from "react-swipeable"

export default function Home() {
  useCountdown()
  const settingsActions = useSettingsActions()
  const [timer, setTimer] = useLocalStorage({
    key: "timer",
    defaultValue: timerDefaults.activityDuration.pomodoro,
  })

  useEffect(() => {
    !timer && setTimer(timer ?? 25)

    settingsActions.changeActivityDuration(timer, "pomodoro")
  }, [timer, setTimer, settingsActions])

  return (
    <>
      <TabTitleTimer />

      <div className=" flex h-screen items-start justify-center">
        <div className="flex w-[600px] flex-col justify-start gap-24">
          <Header />

          <div className="flex flex-col items-center justify-between gap-36">
            <div className="block h-20 md:hidden" />
            <Timer />
            <PlayPauseButton />
          </div>
        </div>
      </div>
    </>
  )
}

function TabTitleTimer() {
  const currentActivity = useCurrentActivity()
  const timer = useFormattedTimer(true)

  return (
    <NextHead>
      <title>{`${timer} - Toki - ${formatActivityName(
        currentActivity,
      )}`}</title>
    </NextHead>
  )
}

function Header() {
  return (
    <div className="flex justify-between p-5">
      <SettingsMenu />
      <SignInButton />
    </div>
  )
}

function SignInButton() {
  const session = useSession()

  return (
    <Button onClick={() => (session ? signOut() : signIn())} variant="outline">
      {session ? (
        <>
          <ExitIcon className="mr-2 h-4 w-4" /> Sign out
        </>
      ) : (
        <>
          <PersonIcon className="mr-2 h-4 w-4" /> Sign In
        </>
      )}
    </Button>
  )
}

function SettingsMenu() {
  const pomodoroDuration = usePomodoroDuration()
  const settingsActions = useSettingsActions()

  const [_, setLocalStorageTimer] = useLocalStorage({
    key: "timer",
    defaultValue: timerDefaults.activityDuration.pomodoro,
  })

  return (
    <Sheet>
      <SheetTrigger className="flex w-9 items-center justify-center text-gray-600">
        <MixerHorizontalIcon className="h-6 w-6 md:h-6 md:w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col gap-10 sm:max-w-md">
        <SheetHeader className="flex items-center border-b-[1px]">
          <SheetTitle className="mb-4 text-2xl font-bold">Settings</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-8">
          <div className="flex items-center gap-2">
            <ClockIcon />
            <p className="text-lg">Timer (minutes)</p>
          </div>

          <div className="flex items-center justify-between gap-6">
            <p className="text-lg font-bold">Pomodoro</p>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="h-10 w-11 text-base font-bold"
                onClick={() => {
                  const newDuration = pomodoroDuration - minsToMils(5)

                  settingsActions.changeActivityDuration(
                    newDuration,
                    "pomodoro",
                  )

                  setLocalStorageTimer(newDuration)
                }}
              >
                -5
              </Button>

              <Input
                className="h-10 w-16 text-center text-base font-medium"
                type="text"
                value={milsToMins(pomodoroDuration)}
                maxLength={4}
                onChange={(e) => {
                  settingsActions.changeActivityDuration(
                    minsToMils(Number(e.target.value)),
                    "pomodoro",
                  )
                }}
              />

              <Button
                variant="outline"
                className="h-10 w-11 text-base font-bold"
                onClick={() => {
                  const newDuration = pomodoroDuration + minsToMils(5)

                  settingsActions.changeActivityDuration(
                    newDuration,
                    "pomodoro",
                  )

                  setLocalStorageTimer(newDuration)
                }}
              >
                +5
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Timer() {
  const { changeActivity } = useTimerActions()
  const timer = useFormattedTimer()
  const currentActivity = useCurrentActivity()
  const isRunning = useIsRunning()

  const handleSwipe = useSwipeable({
    onSwipedLeft: () => !isRunning && changeActivity("right"),
    onSwipedRight: () => !isRunning && changeActivity("left"),
  })

  return (
    <div {...handleSwipe} className="flex items-center gap-10">
      {isRunning ? null : <ChangeActivityButton direction="left" />}

      <div className="flex w-[260px] flex-col items-center gap-2 md:w-[420px] md:text-2xl">
        <p>{formatActivityName(currentActivity)}</p>

        <p className="text-6xl font-bold text-gray-600 md:text-8xl">{timer}</p>

        <div className="h-5" />
      </div>

      {isRunning ? null : <ChangeActivityButton direction="right" />}
    </div>
  )
}

function ChangeActivityButton({ direction }: { direction: DirectionClicked }) {
  const { changeActivity } = useTimerActions()

  return (
    <button
      className="flex items-center justify-center rounded-full bg-gray-100 p-1 text-gray-500"
      onClick={() => changeActivity(direction)}
    >
      {direction === "left" ? (
        <IconChevronLeft className="cursor-pointer" />
      ) : (
        <IconChevronRight className="cursor-pointer" />
      )}
    </button>
  )
}

function PlayPauseButton() {
  const { play, pause } = useTimerActions()
  const isRunning = useIsRunning()

  return (
    <button
      className="flex h-20 w-24 items-center justify-center rounded-3xl bg-gray-600 text-white md:h-24 md:w-32"
      onClick={() => {
        playToggleTimerSound()
        isRunning ? pause() : play()
      }}
    >
      {isRunning ? (
        <IconPlayerPauseFilled className="h-9 w-9 md:h-11 md:w-11" />
      ) : (
        <IconPlayerPlayFilled className="h-9 w-9 md:h-11 md:w-11" />
      )}
    </button>
  )
}
