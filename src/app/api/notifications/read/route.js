// src/app/api/notifications/read/route.js
import { prisma } from "@/app/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// PUT: Mark a notification as read
export async function PUT(req) {
	// Get the current session; if not logged in, return 401.
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { notificationId } = await req.json();
		if (!notificationId) {
			return NextResponse.json(
				{ error: "Notification ID is required." },
				{ status: 400 }
			);
		}

		// Update the notification's isRead flag to true
		const updatedNotification = await prisma.notification.update({
			where: { id: notificationId },
			data: { isRead: true },
		});
		return NextResponse.json(updatedNotification, { status: 200 });
	} catch (error) {
		console.error("Error marking notification as read:", error);
		return NextResponse.json(
			{
				error: "Failed to update notification",
				details: error.message || "Unknown error",
			},
			{ status: 500 }
		);
	}
}
