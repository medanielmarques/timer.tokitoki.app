import { activityDurationDev, activityDurationProd } from "@/lib/constants"
import { useTimer } from "@/lib/timer-store"
import { useLocalStorageSettings } from "@/lib/use-local-storage-settings"
import { TimerIcon } from "@radix-ui/react-icons"

export function DevModeTimer() {
  const timer = useTimer()
  const { setLocalStorageSettings } = useLocalStorageSettings()

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
