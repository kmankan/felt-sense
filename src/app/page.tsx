import React from "react";
import Link from 'next/link';
import { getSignInUrl, getSignUpUrl, withAuth, signOut } from '@workos-inc/authkit-nextjs';

export default async function Home() {
  // Retrieves the user from the session or returns `null` if no user is signed in
  const { user } = await withAuth();

  if (!user) {
    // Get the URL to redirect the user to AuthKit to sign in
    const signInUrl = await getSignInUrl();

    // Get the URL to redirect the user to AuthKit to sign up
    const signUpUrl = await getSignUpUrl();

    return (
      <div className="wrapper flex flex-col items-center justify-center min-h-screen text-center px-4">
        <Link href={signInUrl}>Log in</Link>
        <Link href={signUpUrl}>Sign Up</Link>
      </div>
    );
  }


  return (
    <div className="wrapper">

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-5xl font-bold mb-6">
          Voice AI for <span className="text-blue-600">Emotional Work</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Guide yourself through emotional blocks and into flow.
        </p>
        <a href="/start" className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700">
          Start Your Journey
        </a>
        <p className="mt-4 text-gray-500">Your first 60 minutes are free</p>
      </div>
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <p>Welcome back {user?.firstName && `, ${user?.firstName}`}</p>
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
}
