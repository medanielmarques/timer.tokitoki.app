import { CommandCenter } from "@/components/command-center"
import { Header } from "@/components/header"
import { TimerSection } from "@/components/timer/timer"
import { useCountdown } from "@/components/timer/timer-utils"

export default function Home() {
  useCountdown()

  return (
    <>
      <div className=" flex h-screen justify-center md:items-start">
        <div className="flex w-[600px] flex-col justify-between md:justify-start">
          <div className="flex h-screen flex-col justify-between">
            <div>
              <Header />
              <TimerSection />
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
