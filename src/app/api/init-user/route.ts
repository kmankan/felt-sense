import { NextResponse } from 'next/server';
import { userQueries } from '../../../lib/db/queries';

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();
        console.log("User ID:", userId);
        
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