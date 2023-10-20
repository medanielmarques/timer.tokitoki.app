import { api } from "@/utils/api";
import { Button } from "@mantine/core";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "hello" });

  console.log(hello.data);

  // async function signIn() {
  //   await supabase.auth.signInWithOAuth({
  //     provider: "discord",
  //     // options
  //   });
  // }

  // async function signInWithEmail() {
  //   await supabase.auth.signInWithOtp({
  //     email: "me@danielmarques.dev",
  //     // options
  //   });
  // }

  return (
    <div>
      <Button color="red">test</Button>
    </div>
  );
}
