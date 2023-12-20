import { ACTIVITY_DURATION } from "@/lib/constants"
import { useTimer } from "@/lib/timer-store"
import { useLocalStorageSettings } from "@/lib/use-local-storage-settings"
import { TimerIcon } from "@radix-ui/react-icons"

export function DevModeTimer() {
  const timer = useTimer()
  const { setLocalStorageSettings } = useLocalStorageSettings()

  const getActivityDuration =
    timer === ACTIVITY_DURATION.dev.pomodoro
      ? ACTIVITY_DURATION.prod
      : ACTIVITY_DURATION.dev

  function handleDevModeTimer() {
    setLocalStorageSettings((current) => ({
      ...current,
      activityDuration: getActivityDuration,
    }))
  }

  return (
    <button className="text-gray-500" onClick={handleDevModeTimer}>
      <TimerIcon className="h-6 w-6" />
    </button>
  )
}
