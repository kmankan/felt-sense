import { handleAuth } from '@workos-inc/authkit-nextjs';
import { NextRequest } from 'next/server';
import { userQueries } from '@/lib/db/queries';
import { getSession } from '@workos-inc/authkit-nextjs';

export interface HandleAuthOptions {
  returnPathname?: string;
  baseURL?: string;
}

export async function GET(request: NextRequest) {
  // First handle the WorkOS auth to get the session
  const response = await handleAuth({ returnPathname: '/chat' })(request);
  
  // Get the session after auth
  const session = await getSession();
  console.log("Session:", session);
  const userId = session?.user?.id;
  console.log("User ID:", userId);

  if (!userId) {
    console.error("User ID not found");
    return response
  }

  // Try to find existing user
  let user = await userQueries.getUser(userId!);
  console.log("Existing User:", user);

  // If user doesn't exist, create new user
  if (!user) {
    user = await userQueries.createUser(userId!);
    console.log("User created:", user);
  }

  return response;
}



