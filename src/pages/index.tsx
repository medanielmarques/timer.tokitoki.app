import {
  useCurrentActivity,
  useFormattedTimer,
  useIsRunning,
  useTimerActions,
} from "@/lib/timer-store"
import {
  formatActivity,
  playToggleTimerSound,
  useCountdown,
} from "@/lib/timer-utils"
import { signIn, signOut } from "@/utils/supabase"
import { useSession } from "@supabase/auth-helpers-react"
import { IconMenuDeep, IconUser } from "@tabler/icons-react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react"
import NextHead from "next/head"
import Image from "next/image"
import { useSwipeable } from "react-swipeable"

export default function Home() {
  useCountdown()

  return (
    <>
      <UpdateTabTitle />

      <div className=" flex h-screen items-start justify-center">
        <div className="flex w-[500px] flex-col justify-start gap-24">
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

function UpdateTabTitle() {
  const activity = useCurrentActivity()
  const timer = useFormattedTimer(true)

  return (
    <NextHead>
      <title>{`${timer} - Toki - ${formatActivity(activity)}`}</title>
    </NextHead>
  )
}

function Header() {
  const session = useSession()

  return (
    <div className="flex justify-between p-5">
      <button className="rounded-full text-gray-400">
        <IconMenuDeep className="h-7 w-7 rotate-180 md:h-8 md:w-8" />
      </button>

      <button
        onClick={() => (session ? signOut() : signIn())}
        className="relative h-7 w-7 rounded-full text-gray-400 md:h-8 md:w-8"
      >
        {session ? (
          <Image
            fill={true}
            src={session.user.user_metadata.avatar_url as string}
            alt="avatar"
            style={{ borderRadius: "9999px" }}
          />
        ) : (
          <IconUser className="h-7 w-7 md:h-8 md:w-8" />
        )}
      </button>
    </div>
  )
}

function Timer() {
  const { changeActivity } = useTimerActions()
  const timer = useFormattedTimer()
  const activity = useCurrentActivity()
  const isRunning = useIsRunning()

  const handleSwipe = useSwipeable({
    onSwipedLeft: () => !isRunning && changeActivity("right"),
    onSwipedRight: () => !isRunning && changeActivity("left"),
  })

  return (
    <div {...handleSwipe} className="flex items-center gap-10">
      {isRunning ? null : (
        <div className="flex items-center justify-center rounded-full bg-gray-100 p-1 text-gray-500">
          <IconChevronLeft
            className="cursor-pointer"
            onClick={() => changeActivity("left")}
          />
        </div>
      )}

      <div className="flex w-[260px] flex-col items-center gap-2 md:w-[420px] md:text-2xl">
        <p>{formatActivity(activity)}</p>

        <p className="text-6xl font-bold text-gray-600 md:text-8xl">{timer}</p>

        <div className="h-5" />
      </div>

      {isRunning ? null : (
        <div className="flex items-center justify-center rounded-full bg-gray-100 p-1 text-gray-500">
          <IconChevronRight
            className="cursor-pointer"
            onClick={() => changeActivity("right")}
          />
        </div>
      )}
    </div>
  )
}

function PlayPauseButton() {
  const { play, pause } = useTimerActions()
  const isRunning = useIsRunning()

  return (
    <button
      className="flex h-20 w-24 items-center justify-center rounded-2xl bg-gray-600 text-white md:h-24 md:w-32"
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
