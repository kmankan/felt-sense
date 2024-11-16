import { NextResponse } from 'next/server';
import { userQueries } from '../../../lib/db/queries';
import { getSession } from '@workos-inc/authkit-nextjs';

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
        }
        
        // Try to find existing user
        let user = await userQueries.getUser(userId);
        console.log("Existing User:", user);
        
        // If user doesn't exist, create new user
        if (!user) {
            user = await userQueries.createUser(userId);
            console.log("User created:", user);
        }
        
        return NextResponse.json(user);
    } catch (error) {
        console.error('Error in user init:', error);
        return NextResponse.json(
            { error: 'Failed to initialize user' },
            { status: 500 }
        );
    }
}