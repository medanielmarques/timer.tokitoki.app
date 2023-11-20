import { useSounds } from "@/lib/use-sounds"
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
import { useEffect, useState } from "react"
import { type SwipeableHandlers, useSwipeable } from "react-swipeable"
import { useTimer } from "react-timer-hook"

function addZeroBefore(time: number) {
  return ("0" + time.toString()).slice(-2)
}

type Activity = "pomodoro" | "short_break" | "long_break"

type DirectionClicked = "left" | "right"

function getNextActivity(
  current: Activity,
  direction_clicked: DirectionClicked,
): Activity {
  switch (current) {
    case "pomodoro":
      return direction_clicked === "left" ? "long_break" : "short_break"
    case "short_break":
      return direction_clicked === "left" ? "pomodoro" : "long_break"
    case "long_break":
      return direction_clicked === "left" ? "short_break" : "pomodoro"
  }
}

function changeTimer(activity: Activity) {
  switch (activity) {
    case "pomodoro":
      return getTimer()
    case "short_break":
      return getTimer(60 * 5)
    case "long_break":
      return getTimer(60 * 15)
  }
}

function formatActivity(activity: Activity) {
  switch (activity) {
    case "pomodoro":
      return "Pomodoro"
    case "short_break":
      return "Short Break"
    case "long_break":
      return "Long Break"
  }
}

function getTimer(time: number = 60 * 25) {
  const timer = new Date()
  timer.setSeconds(timer.getSeconds() + time) // 60 seconds * 25 = 25 minutes
  return timer
}

export default function Home() {
  const [activity, setActivity] = useState<Activity>("pomodoro")

  const { minutes, seconds, isRunning, pause, resume, restart } = useTimer({
    expiryTimestamp: getTimer(),
    autoStart: false,
  })

  const { playAlarmSound } = useSounds()

  useEffect(() => {
    if (minutes === 0 && seconds === 0) {
      playAlarmSound()
      restart(getTimer(), false)
    }
  }, [minutes, seconds, restart, playAlarmSound])

  function changeActivity(direction_clicked: DirectionClicked) {
    const next_activity = getNextActivity(activity, direction_clicked)
    setActivity(next_activity)
    restart(changeTimer(next_activity), false)
  }

  const handleSwipe = useSwipeable({
    onSwipedLeft: () => !isRunning && changeActivity("right"),
    onSwipedRight: () => !isRunning && changeActivity("left"),
  })

  return (
    <>
      <UpdateTitle minutes={minutes} seconds={seconds} activity={activity} />

      <div className=" flex h-screen items-start justify-center">
        <div className="flex w-[500px] flex-col justify-start gap-24">
          <Header />

          <div className="flex flex-col items-center justify-between gap-36">
            <div className="block h-20 md:hidden" />

            <Timer
              handleSwipe={handleSwipe}
              activity={activity}
              minutes={minutes}
              seconds={seconds}
              isRunning={isRunning}
              changeActivity={changeActivity}
            />

            <PlayPauseButton
              isRunning={isRunning}
              pause={pause}
              resume={resume}
            />
          </div>
        </div>
      </div>
    </>
  )
}

type UpdateTimerProps = {
  minutes: number
  seconds: number
  activity: Activity
}

function UpdateTitle({ minutes, seconds, activity }: UpdateTimerProps) {
  return (
    <NextHead>
      <title>{`${addZeroBefore(minutes)}:${addZeroBefore(
        seconds,
      )} - Toki - ${formatActivity(activity)}`}</title>
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

type TimerProps = {
  handleSwipe: SwipeableHandlers
  activity: Activity
  minutes: number
  seconds: number
  isRunning: boolean
  changeActivity: (direction_clicked: DirectionClicked) => void
}

function Timer({
  handleSwipe,
  activity,
  minutes,
  seconds,
  isRunning,
  changeActivity,
}: TimerProps) {
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

      <div className="flex w-[208px] flex-col items-center gap-2 md:w-[333px] md:text-2xl">
        <p>{formatActivity(activity)}</p>

        <p className="text-6xl font-bold text-gray-600 md:text-8xl">
          {addZeroBefore(minutes)} : {addZeroBefore(seconds)}
        </p>

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

type PlayPauseButtonProps = {
  isRunning?: boolean
  pause: () => void
  resume: () => void
}

function PlayPauseButton({ isRunning, pause, resume }: PlayPauseButtonProps) {
  const { playToggleTimerSound } = useSounds()

  return (
    <button
      className="flex h-20 w-24 items-center justify-center rounded-2xl bg-gray-600 text-white md:h-24 md:w-32"
      onClick={() => {
        playToggleTimerSound()
        isRunning ? pause() : resume()
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
