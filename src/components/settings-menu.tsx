import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { timerDurationLimit } from "@/lib/constants"
import {
  type Activity,
  useLongBreakDuration,
  usePomodoroDuration,
  useSettingsActions,
  useShortBreakDuration,
} from "@/lib/timer-store"
import { formatActivityName, milsToMins, minsToMils } from "@/lib/timer-utils"
import { useLocalStorageSettings } from "@/lib/use-local-storage-settings"
import { ClockIcon, MixerHorizontalIcon } from "@radix-ui/react-icons"

export function SettingsMenu() {
  const pomodoroDuration = usePomodoroDuration()
  const shortBreakDuration = useShortBreakDuration()
  const longBreakDuration = useLongBreakDuration()

  return (
    <Sheet>
      <SheetTrigger className="flex w-9 items-center justify-center text-gray-600">
        <MixerHorizontalIcon className="h-6 w-6 md:h-6 md:w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col gap-10 sm:max-w-md">
        <SheetHeader className="flex items-center border-b-[1px]">
          <SheetTitle className="mb-4 text-2xl font-bold">Settings</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-8">
          <div className="flex items-center gap-2">
            <ClockIcon />
            <p className="text-lg">Timer (minutes)</p>
          </div>

          <SettingsMenuChangeActivityDuration
            activity="pomodoro"
            activityDuration={pomodoroDuration}
          />

          <SettingsMenuChangeActivityDuration
            activity="shortBreak"
            activityDuration={shortBreakDuration}
          />

          <SettingsMenuChangeActivityDuration
            activity="longBreak"
            activityDuration={longBreakDuration}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

function SettingsMenuChangeActivityDuration({
  activity,
  activityDuration,
}: {
  activity: Activity
  activityDuration: number
}) {
  const { changeActivityDuration } = useSettingsActions()
  const { setLocalStorageSettings } = useLocalStorageSettings()

  function handleClick(action: "sum" | "subtract") {
    const sumOrSubtractFive = action === "sum" ? 5 : -5
    const newDuration = activityDuration + minsToMils(sumOrSubtractFive)

    changeActivityDuration(newDuration, activity)

    setLocalStorageSettings((current) => ({
      ...current,
      activityDuration: {
        ...current.activityDuration,
        [activity]: newDuration,
      },
    }))
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-lg font-bold">{formatActivityName(activity)}</p>

      <div className="flex items-center gap-4">
        <DurationButton
          label="-5"
          handleClick={() => handleClick("subtract")}
          disabled={activityDuration <= timerDurationLimit.lowest}
        />

        <Input
          className="h-10 w-16 text-center text-base font-medium"
          type="text"
          value={milsToMins(activityDuration)}
          maxLength={3}
          onChange={(e) => {
            const newDuration = minsToMils(Number(e.target.value))

            changeActivityDuration(newDuration, activity)

            setLocalStorageSettings((current) => ({
              ...current,
              activityDuration: {
                ...current.activityDuration,
                [activity]: newDuration,
              },
            }))
          }}
        />

        <DurationButton
          label="+5"
          handleClick={() => handleClick("sum")}
          disabled={activityDuration >= timerDurationLimit.highest}
        />
      </div>
    </div>
  )
}

function DurationButton({
  label,
  handleClick,
  disabled,
}: {
  label: string
  handleClick: () => void
  disabled: boolean
}) {
  return (
    <Button
      variant="outline"
      className="h-10 w-11 text-base font-bold"
      disabled={disabled}
      onClick={handleClick}
    >
      {label}
    </Button>
  )
}
