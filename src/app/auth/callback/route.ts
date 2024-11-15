import { handleAuth } from '@workos-inc/authkit-nextjs';
import { NextRequest } from 'next/server';
import { userQueries } from '../../../lib/db/queries';

export interface HandleAuthOptions {
  returnPathname?: string;
  baseURL?: string;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  
  if (code) {
    const userId = `user_${code}`
    // Try to find existing user
    let user = await userQueries.getUser(userId);
    console.log("Existing User:", user);
    
    // If user doesn't exist, create new user
    if (!user) {
        user = await userQueries.createUser(userId);
        console.log("User created:", user);
    }
  }

  // Then proceed with WorkOS auth handling
  return handleAuth({ returnPathname: '/' })(request);

}