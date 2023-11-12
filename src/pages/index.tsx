import { useSounds } from "@/lib/use-sounds"
import { Box, Button, Center, Flex, Text } from "@mantine/core"
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react"
import NextHead from "next/head"
import { useEffect, useState } from "react"
import { useTimer } from "react-timer-hook"

function add_zero_before(time: number) {
  return ("0" + time.toString()).slice(-2)
}

type Activity = "pomodoro" | "short_break" | "long_break"

function change_activity(
  current: Activity,
  direction_clicked: "left" | "right",
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

  return (
    <>
      <NextHead>
        <title>{`${add_zero_before(minutes)}:${add_zero_before(
          seconds,
        )} - Toki - ${format_activity(activity)}`}</title>
      </NextHead>

      <Center h="100vh">
        <Flex
          gap={150}
          direction="column"
          justify="space-between"
          align="center"
        >
          <Box h={80} />

          <Flex align="center" gap={40}>
            {isRunning ? null : (
              <IconChevronLeft
                color="#909296"
                cursor="pointer"
                onClick={() => {
                  const next_activity = change_activity(activity, "left")

                  setActivity(next_activity)
                  restart(change_timer(next_activity), false)
                }}
              />
            )}

            <Flex direction="column" align="center" gap={10}>
              <Text>{format_activity(activity)}</Text>

              <Text c="gray.7" size="64px" fw="bold">
                {add_zero_before(minutes)} : {add_zero_before(seconds)}
              </Text>

              <Box h={20} />
            </Flex>

            {isRunning ? null : (
              <IconChevronRight
                color="#909296"
                cursor="pointer"
                onClick={() => {
                  const next_activity = change_activity(activity, "right")

                  setActivity(next_activity)
                  restart(change_timer(next_activity), false)
                }}
              />
            )}
          </Flex>

          <Button
            onClick={() => {
              play_toggle_timer_sound()
              isRunning ? pause() : resume()
            }}
            color="gray.7"
            w={100}
            h={80}
            radius="lg"
          >
            {isRunning ? (
              <IconPlayerPauseFilled size={35} />
            ) : (
              <IconPlayerPlayFilled size={35} />
            )}
          </Button>
        </Flex>
      </Center>
    </>
  )
}
