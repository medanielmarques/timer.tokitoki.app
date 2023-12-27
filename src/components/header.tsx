import { BackGroundSoundsMenu } from "@/components/bg-sounds-menu"
import { DevModeTimer } from "@/components/dev-mode-timer"
import { SettingsMenu } from "@/components/settings-menu"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { signInWithDiscord, signInWithGoogle, signOut } from "@/utils/supabase"
import {
  GoogleLogo,
  SignIn as SignInIcon,
  SignOut as SignOutIcon,
} from "@phosphor-icons/react"
import { DiscordLogo } from "@phosphor-icons/react/dist/ssr"
import { useSession } from "@supabase/auth-helpers-react"

export function Header() {
  const session = useSession()
  const isSignedIn = !!session

  return (
    <div className="flex justify-between p-5">
      <div className="flex items-center gap-4">
        <SettingsMenu />
        <BackGroundSoundsMenu />

        {process.env.NODE_ENV === "development" && <DevModeTimer />}
      </div>

      <div className="gap-4 flex-center">
        {isSignedIn ? <SignOutButton /> : <SignInModal />}
      </div>
    </div>
  )
}

function SignOutButton() {
  return (
    <Button variant="outline" onClick={signOut}>
      <SignOutIcon className="mr-2 h-4 w-4" />
      <span>Sign out</span>
    </Button>
  )
}

function SignInModal() {
  return (
    <Dialog>
      <DialogTrigger asChild className="flex-center">
        <Button variant="outline">
          <SignInIcon className="mr-2 h-4 w-4" />
          <span>Sign in</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="py-10">
        <DialogHeader>
          <DialogDescription>
            <div className="flex-col gap-5 flex-center">
              <span className="font-medium text-gray-500">Sign in with</span>

              <div className="gap-3 flex-center">
                <Button
                  onClick={() => signInWithDiscord()}
                  variant="outline"
                  className="gap-2 p-5 flex-center"
                >
                  <DiscordLogo className="h-5 w-5" />
                  Discord
                </Button>

                <Button
                  onClick={() => signInWithGoogle()}
                  variant="outline"
                  className="gap-2 p-5 flex-center"
                >
                  <GoogleLogo className="h-5 w-5" />
                  Google
                </Button>
              </div>
            </div>

            {/* <div>
            By signing in, you agree to our Terms of Service and Privacy Policy.
            </div> */}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
