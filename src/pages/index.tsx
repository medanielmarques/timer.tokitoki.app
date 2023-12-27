import { CommandCenter } from "@/components/command-center"
import { Header } from "@/components/header"
import {
  type DirectionClicked,
  useCurrentActivity,
  useFormattedTimer,
  useIsTimerRunning,
  useSettingsActions,
  useTimerActions,
} from "@/lib/timer-store"
import { formatActivityName, useCountdown } from "@/lib/timer-utils"
import { CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react"
import NextHead from "next/head"
import { useSwipeable } from "react-swipeable"

export default function Home() {
  useCountdown()

  return (
    <>
      <TabTitleTimer />

      <div className=" flex h-screen justify-center md:items-start">
        <div className="flex w-[600px] flex-col justify-between md:justify-start">
          <div className="flex h-screen flex-col justify-between">
            <div>
              <Header />

              <div className="mb-[20%] flex flex-col items-center justify-between gap-36 py-[25%] md:my-24 md:mb-0 md:py-0">
                <Timer />
                <PlayPauseButton />
              </div>
            </div>

            <div className="mb-8 hidden md:flex-center">
              <CommandCenter />
            </div>
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
    <div {...handleSwipe} className="flex items-center md:gap-7">
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

  const icon =
    direction === "left" ? (
      <CaretLeft className="h-4 w-4 md:h-6 md:w-6" />
    ) : (
      <CaretRight className="h-4 w-4 md:h-6 md:w-6" />
    )

  function handleClick() {
    changeCurrentActivity(direction)
  }

  return (
    <button
      className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 p-1 text-gray-500 hover:bg-gray-100 md:h-9 md:w-9"
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
    <Pause weight="fill" className="h-9 w-9 md:h-11 md:w-11" />
  ) : (
    <Play weight="fill" className="h-9 w-9 md:h-11 md:w-11" />
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
