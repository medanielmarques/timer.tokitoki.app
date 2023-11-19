import { useSounds } from "@/lib/use-sounds"
import { supabase } from "@/utils/supabase"
import { IconMenuDeep, IconUser } from "@tabler/icons-react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react"
import NextHead from "next/head"
import { useEffect, useState } from "react"
import { useSwipeable } from "react-swipeable"
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

  const { playAlarmSound, playToggleTimerSound } = useSounds()

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
    onSwipedLeft: () => changeActivity("right"),
    onSwipedRight: () => changeActivity("left"),
  })

  async function sign_in() {
    await supabase.auth.signInWithOAuth({
      provider: "discord",
    })
  }

  return (
    <>
      <NextHead>
        <title>{`${addZeroBefore(minutes)}:${addZeroBefore(
          seconds,
        )} - Toki - ${formatActivity(activity)}`}</title>
      </NextHead>

      <div className=" flex h-screen items-start justify-center">
        <div className="flex w-[500px] flex-col justify-start gap-24">
          <div className="flex justify-between p-5">
            <button className="rounded-full text-gray-400">
              <IconMenuDeep className="h-7 w-7 md:h-8 md:w-8" />
            </button>

            <button onClick={sign_in} className="rounded-full text-gray-400">
              <IconUser className="h-7 w-7 md:h-8 md:w-8" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-between gap-36">
            <div className="block h-20 md:hidden" />

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
          </div>
        </div>
      </div>
    </>
  )
}
