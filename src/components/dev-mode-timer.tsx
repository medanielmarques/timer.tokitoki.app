import { useTimer } from "@/components/timer/timer-store"
import { Button } from "@/components/ui/button"
import { ACTIVITY_DURATION } from "@/lib/constants"
import { useLocalStorageSettings } from "@/lib/use-local-storage-settings"
import { Clock } from "@phosphor-icons/react"
import { useCallback, useEffect } from "react"

export function DevModeTimer() {
  const timer = useTimer()
  const { setLocalStorageSettings } = useLocalStorageSettings()

  const getActivityDuration =
    timer === ACTIVITY_DURATION.DEV.pomodoro
      ? ACTIVITY_DURATION.PROD
      : ACTIVITY_DURATION.DEV

  const handleDevModeTimer = useCallback(() => {
    setLocalStorageSettings((current) => ({
      ...current,
      activityDuration: getActivityDuration,
    }))
  }, [getActivityDuration, setLocalStorageSettings])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "d") {
        e.preventDefault()
        handleDevModeTimer()
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [handleDevModeTimer])

  return (
    <Button variant="ghost" size="icon" onClick={handleDevModeTimer}>
      <Clock className="h-6 w-6" />
    </Button>
  )
}
