'use server'
import { signOut, getSignInUrl, getSignUpUrl } from "@workos-inc/authkit-nextjs";

export async function handleSignOut() {
  await signOut();
}

export async function getAuthUrls() {
  const signInUrl = await getSignInUrl();
  const signUpUrl = await getSignUpUrl();
  return { signInUrl, signUpUrl };
}