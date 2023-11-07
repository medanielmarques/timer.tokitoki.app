import { useSounds } from "@/lib/use-sounds"
import { Box, Button, Center, Flex, Text } from "@mantine/core"
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react"
import NextHead from "next/head"
import { useEffect } from "react"
import { useTimer } from "react-timer-hook"

const time = new Date()
const addZeroBefore = (time: number) => ("0" + time.toString()).slice(-2)

export default function Home() {
  time.setSeconds(time.getSeconds() + 60 * 25) // 60 seconds * 25 = 25 minutes

  const { minutes, seconds, isRunning, pause, resume, restart } = useTimer({
    expiryTimestamp: time,
    autoStart: false,
  })

  const { playAlarmSound, playToggleTimerSound } = useSounds()

  useEffect(() => {
    if (minutes === 0 && seconds === 0) {
      playAlarmSound()
      restart(time, false)
    }
  }, [minutes, seconds, restart, playAlarmSound])

  return (
    <>
      <NextHead>
        <title>{`${addZeroBefore(minutes)}:${addZeroBefore(
          seconds,
        )} - Toki`}</title>
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
            <IconChevronLeft color="#909296" />

            <Flex direction="column" align="center" gap={10}>
              <Text>Pomodoro</Text>

              <Text c="gray.7" size="64px" fw="bold">
                {addZeroBefore(minutes)} : {addZeroBefore(seconds)}
              </Text>

              <Box h={20} />
            </Flex>

            <IconChevronRight color="#909296" />
          </Flex>

          <Button
            onClick={() => {
              playToggleTimerSound()
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
