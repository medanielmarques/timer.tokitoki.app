import { DevModeTimer } from "@/components/dev-mode-timer"
import { SettingsMenu } from "@/components/settings-menu"
import { Button } from "@/components/ui/button"
import {
  type DirectionClicked,
  useCurrentActivity,
  useFormattedTimer,
  useIsRunning,
  useIsTimerFinished,
  useTimerActions,
} from "@/lib/timer-store"
import {
  formatActivityName,
  useCountdown,
  useLocalStorageSettings,
} from "@/lib/timer-utils"
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
import { useSwipeable } from "react-swipeable"

export default function Home() {
  useCountdown()

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

  const title = `${timer} - Toki - ${formatActivityName(currentActivity)}`

  return (
    <NextHead>
      <title>{title}</title>
    </NextHead>
  )
}

function Header() {
  const [, setLocalStorageSettings] = useLocalStorageSettings()

  return (
    <div className="flex justify-between p-5">
      <div className="flex items-center gap-2">
        <SettingsMenu setLocalStorageSettings={setLocalStorageSettings} />

        {process.env.NODE_ENV === "development" && (
          <DevModeTimer setLocalStorageSettings={setLocalStorageSettings} />
        )}
      </div>
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
          <ExitIcon className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </>
      ) : (
        <>
          <PersonIcon className="mr-2 h-4 w-4" />
          <span>Sign in</span>
        </>
      )}
    </Button>
  )
}

function Timer() {
  const { changeCurrentActivity } = useTimerActions()
  const timer = useFormattedTimer()
  const currentActivity = useCurrentActivity()
  const isRunning = useIsRunning()

  const handleSwipe = useSwipeable({
    onSwipedLeft: () => !isRunning && changeCurrentActivity("right"),
    onSwipedRight: () => !isRunning && changeCurrentActivity("left"),
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
  const { changeCurrentActivity } = useTimerActions()

  return (
    <button
      className="flex items-center justify-center rounded-full bg-gray-100 p-1 text-gray-500"
      onClick={() => changeCurrentActivity(direction)}
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
      onClick={() => (isRunning ? pause() : play())}
    >
      {isRunning ? (
        <IconPlayerPauseFilled className="h-9 w-9 md:h-11 md:w-11" />
      ) : (
        <IconPlayerPlayFilled className="h-9 w-9 md:h-11 md:w-11" />
      )}
    </button>
  )
}
