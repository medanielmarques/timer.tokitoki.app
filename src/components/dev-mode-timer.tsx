import { activityDurationDev, activityDurationProd } from "@/lib/constants"
import { useTimer } from "@/lib/timer-store"
import { TimerIcon } from "@radix-ui/react-icons"

export function DevModeTimer({ setLocalStorageSettings }) {
  const timer = useTimer()

  const activityDuration =
    timer === activityDurationDev.pomodoro
      ? activityDurationProd
      : activityDurationDev

  function handleDevModeTimer() {
    setLocalStorageSettings((current) => ({
      ...current,
      activityDuration,
    }))
  }

  return (
    <button className="text-gray-400" onClick={handleDevModeTimer}>
      <TimerIcon className="h-4 w-4" />
    </button>
  )
}
