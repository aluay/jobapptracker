import { prisma } from "@/app/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

/**
 * GET: Fetch all notifications for the logged-in user.
 */
export async function GET(req) {
	// Get the current session; if not authenticated, return 401.
	const session = await getServerSession(authOptions);
	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	try {
		// Fetch notifications for the user, ordered by creation date (newest first)
		const notifications = await prisma.notification.findMany({
			where: { userId: session.user.id },
			orderBy: { createdAt: "desc" },
		});
		return NextResponse.json(notifications ?? [], { status: 200 });
		// return NextResponse.json(notifications, { status: 200 });
	} catch (error) {
		console.error("Error fetching notifications:", error);
		return NextResponse.json(
			{ error: "Failed to fetch notifications" },
			{ status: 500 }
		);
	}
}

/**
 * PUT: Mark a specific notification as read.
 * Expects a JSON body with a property "notificationId".
 */
export async function PUT(req) {
	// Get the current session; if not authenticated, return 401.
	const session = await getServerSession(authOptions);
	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	try {
		const { notificationId } = await req.json();
		if (!notificationId) {
			return NextResponse.json(
				{ error: "Notification ID is required" },
				{ status: 400 }
			);
		}

		// Update the notification to mark it as read
		const updatedNotification = await prisma.notification.update({
			where: { id: notificationId },
			data: { isRead: true },
		});
		return NextResponse.json(updatedNotification, { status: 200 });
	} catch (error) {
		console.error("Error updating notification:", error);
		return NextResponse.json(
			{
				error: "Failed to update notification",
				details: error.message || "Unknown error",
			},
			{ status: 500 }
		);
	}
}
