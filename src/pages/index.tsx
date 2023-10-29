import { Button, Flex, Text } from "@mantine/core"
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
} from "@tabler/icons-react"
import NextHead from "next/head"
import { useTimer } from "react-timer-hook"

const addZeroBefore = (time: number) => ("0" + time.toString()).slice(-2)

export default function Home() {
  const time = new Date()
  time.setSeconds(time.getSeconds() + 60 * 25) // 60 seconds * 25 = 25 minutes

  const { minutes, seconds, isRunning, pause, resume } = useTimer({
    expiryTimestamp: time,
    autoStart: false,
  })

  return (
    <>
      <NextHead>
        <title>{`${minutes}:${addZeroBefore(seconds)} - Toki`}</title>
      </NextHead>

      <Flex
        gap={200}
        direction="column"
        justify="center"
        align="center"
        h="100vh"
      >
        <Text c="gray.7" size="64px" fw="bold">
          {/* 25:00 */}
          {minutes} : {addZeroBefore(seconds)}
        </Text>

        <Button
          onClick={() => {
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
    </>
  )
}
