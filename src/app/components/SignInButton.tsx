"use client";
import { getSignInUrl, getSignUpUrl, signOut } from "@workos-inc/authkit-nextjs";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { getSessionInformation } from "@/app/auth/actions/getSession";
import type { Session } from "@/types/index";

export async function SignInButton({ large }: { large?: boolean }) {

  const signInUrl = await getSignInUrl();
  const signUpUrl = await getSignUpUrl();

  const session: Session = await getSessionInformation();

  if (!session.user) {
    console.log("user is not signed in", session.user);
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button size={large ? "3" : "2"}>Account</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item className="hover:bg-neutral-50">
            <Button
              onClick={signOut}  // Directly pass signOut as a reference
              variant="ghost"
              size={large ? "3" : "2"}
            >
              Sign Out
            </Button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  }

  console.log("user is signed in", session.user);
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