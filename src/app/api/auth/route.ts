import { getSession } from "@workos-inc/authkit-nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  return NextResponse.json(session);
} 