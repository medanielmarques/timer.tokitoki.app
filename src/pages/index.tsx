import { useSounds } from "@/lib/use-sounds"
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

function add_zero_before(time: number) {
  return ("0" + time.toString()).slice(-2)
}

type Activity = "pomodoro" | "short_break" | "long_break"

type DirectionClicked = "left" | "right"

function get_next_activity(
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

function change_timer(activity: Activity) {
  switch (activity) {
    case "pomodoro":
      return get_timer()
    case "short_break":
      return get_timer(60 * 5)
    case "long_break":
      return get_timer(60 * 15)
  }
}

function format_activity(activity: Activity) {
  switch (activity) {
    case "pomodoro":
      return "Pomodoro"
    case "short_break":
      return "Short Break"
    case "long_break":
      return "Long Break"
  }
}

function get_timer(time: number = 60 * 25) {
  const timer = new Date()
  timer.setSeconds(timer.getSeconds() + time) // 60 seconds * 25 = 25 minutes
  return timer
}

export default function Home() {
  const [activity, setActivity] = useState<Activity>("pomodoro")

  const { minutes, seconds, isRunning, pause, resume, restart } = useTimer({
    expiryTimestamp: get_timer(),
    autoStart: false,
  })

  const { play_alarm_sound, play_toggle_timer_sound } = useSounds()

  useEffect(() => {
    if (minutes === 0 && seconds === 0) {
      play_alarm_sound()
      restart(get_timer(), false)
    }
  }, [minutes, seconds, restart, play_alarm_sound])

  function change_activity(direction_clicked: DirectionClicked) {
    const next_activity = get_next_activity(activity, direction_clicked)
    setActivity(next_activity)
    restart(change_timer(next_activity), false)
  }

  const handle_swipe = useSwipeable({
    onSwipedLeft: () => change_activity("right"),
    onSwipedRight: () => change_activity("left"),
  })

  function handle_auth() {}

  return (
    <>
      <NextHead>
        <title>{`${add_zero_before(minutes)}:${add_zero_before(
          seconds,
        )} - Toki - ${format_activity(activity)}`}</title>
      </NextHead>

      <div className=" flex h-screen items-start justify-center">
        <div className="flex w-[500px] flex-col justify-start gap-24">
          <div className="flex justify-between p-5">
            <button className="rounded-full text-gray-400">
              <IconMenuDeep className="h-8 w-8 md:h-8 md:w-8" />
            </button>

            <button
              onClick={handle_auth}
              className="rounded-full text-gray-400"
            >
              <IconUser className="h-8 w-8 md:h-8 md:w-8" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-between gap-36">
            <div className="block h-20 md:hidden" />

            <div {...handle_swipe} className="flex items-center gap-10">
              {isRunning ? null : (
                <div className="flex items-center justify-center rounded-full bg-gray-100 p-1 text-gray-500">
                  <IconChevronLeft
                    className="cursor-pointer"
                    onClick={() => change_activity("left")}
                  />
                </div>
              )}

              <div className="flex w-[208px] flex-col items-center gap-2 md:w-[333px] md:text-2xl">
                <p>{format_activity(activity)}</p>

                <p className="text-6xl font-bold text-gray-600 md:text-8xl">
                  {add_zero_before(minutes)} : {add_zero_before(seconds)}
                </p>

                <div className="h-5" />
              </div>

              {isRunning ? null : (
                <div className="flex items-center justify-center rounded-full bg-gray-100 p-1 text-gray-500">
                  <IconChevronRight
                    className="cursor-pointer"
                    onClick={() => change_activity("right")}
                  />
                </div>
              )}
            </div>

            <button
              className="flex h-20 w-24 items-center justify-center rounded-2xl bg-gray-600 text-white md:h-24 md:w-32"
              onClick={() => {
                play_toggle_timer_sound()
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
