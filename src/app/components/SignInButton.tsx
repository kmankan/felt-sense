import { getSignInUrl, getSignUpUrl, withAuth, signOut } from "@workos-inc/authkit-nextjs";
import { Button, DropdownMenu } from "@radix-ui/themes";

export async function SignInButton({ large }: { large?: boolean }) {
  const { user } = await withAuth();
  const signInUrl = await getSignInUrl();
  const signUpUrl = await getSignUpUrl();

  if (user) {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button size={large ? "3" : "2"}>Account</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item className="hover:bg-neutral-50">
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button type="submit" variant="ghost" size={large ? "3" : "2"}>
                Sign Out
              </Button>
            </form>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button size={large ? "3" : "2"}>Account</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
      >
        <DropdownMenu.Item className="hover:bg-neutral-50">
          <a href={signInUrl}>Sign In {large && "with AuthKit"}</a>
        </DropdownMenu.Item>
        <DropdownMenu.Item className="hover:bg-neutral-50">
          <a href={signUpUrl}>Sign Up {large && "with AuthKit"}</a>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}