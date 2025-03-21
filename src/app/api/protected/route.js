import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

/**
 * Example of a protected API route.
 * - Requires authentication via NextAuth.
 */
export async function GET(req) {
	// Get the session from NextAuth
	const session = await getServerSession(authOptions);

	// If no session, return 401 Unauthorized
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// Return protected content
	return NextResponse.json({
		message: "Protected content accessed!",
		user: session.user,
	});
}
