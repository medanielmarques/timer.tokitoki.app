import {
  type DirectionClicked,
  useCurrentActivity,
  useFormattedTimer,
  useIsTimerRunning,
  useSettingsActions,
  useTimerActions,
} from "@/components/timer/timer-store"
import { formatActivityName } from "@/components/timer/timer-utils"
import { Button } from "@/components/ui/button"
import { CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react"
import { useSwipeable } from "react-swipeable"

export function TimerSection() {
  return (
    <div className="mb-[20%] flex flex-col items-center justify-between gap-36 py-[25%] md:my-24 md:mb-0 md:py-0">
      <Timer />
      <PlayPauseButton />
    </div>
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
        <p className="text-6xl font-bold text-primary md:text-8xl">{timer}</p>
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

  function handleChangeActivity() {
    changeCurrentActivity(direction)
  }

  return (
    <Button
      variant="outline"
      className="h-7 w-7 rounded-full p-1 md:h-8 md:w-8"
      onClick={handleChangeActivity}
    >
      {icon}
    </Button>
  )
}

function PlayPauseButton() {
  const { play, pause } = useTimerActions()
  const isTimerRunning = useIsTimerRunning()

  function handleToggleTimer() {
    return isTimerRunning ? pause() : play()
  }

  const icon = isTimerRunning ? (
    <Pause weight="fill" className="h-9 w-9 md:h-11 md:w-11" />
  ) : (
    <Play weight="fill" className="h-9 w-9 md:h-11 md:w-11" />
  )

  return (
    <Button
      className="h-20 w-20 rounded-full md:h-28 md:w-28"
      onClick={handleToggleTimer}
    >
      {icon}
    </Button>
  )
}
