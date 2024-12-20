"use client";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { getSessionInformation } from "@/app/auth/actions/getSession";
import { handleSignOut, getAuthUrls } from "@/app/auth/actions/loginActions";
import type { Session } from "@/types/index";
import { useEffect, useState } from 'react';

export function SignInButton({ large }: { large?: boolean }) {
  const [urls, setUrls] = useState({ signInUrl: '', signUpUrl: '' });
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchUrls = async () => {
      const authUrls = await getAuthUrls();
      setUrls(authUrls);
    };

    const fetchSession = async () => {
      const sessionInfo = await getSessionInformation();
      console.log("sessionInfo", sessionInfo);
      setSession(sessionInfo);
    };

    fetchUrls();
    fetchSession();
  }, []);

  if (!session?.user) {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button size={large ? "3" : "2"}>Account</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item className="hover:bg-neutral-50">
            <a href={urls.signInUrl}>Sign In {large && "with AuthKit"}</a>
          </DropdownMenu.Item>
          <DropdownMenu.Item className="hover:bg-neutral-50">
            <a href={urls.signUpUrl}>Sign Up {large && "with AuthKit"}</a>
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
      <DropdownMenu.Content>
        <DropdownMenu.Item className="hover:bg-neutral-50">
          <Button onClick={handleSignOut} variant="ghost" size={large ? "3" : "2"}>
            Sign Out
          </Button>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}