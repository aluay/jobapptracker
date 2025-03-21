import { prisma } from "@/app/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// GET: Fetch reminders
export async function GET(req) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const reminders = await prisma.reminder.findMany({
			where: { userId: session.user.id },
			orderBy: { reminderDate: "asc" },
		});
		// Default to [] if null (though findMany typically returns an array)
		return NextResponse.json(reminders ?? [], { status: 200 });
	} catch (error) {
		console.error("Error fetching reminders:", error);
		return NextResponse.json(
			{ error: "Failed to fetch reminders" },
			{ status: 500 }
		);
	}
}

// POST: Create a new reminder
export async function POST(req) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	try {
		const body = await req.json();

		// Check that the request body is valid
		if (!body || Object.keys(body).length === 0) {
			return NextResponse.json(
				{ error: "Request body is missing or invalid." },
				{ status: 400 }
			);
		}

		const { applicationId, title, reminderDate } = body;
		if (!reminderDate) {
			return NextResponse.json(
				{ error: "Missing required fields." },
				{ status: 400 }
			);
		}

		const parsedDate = new Date(reminderDate);
		if (isNaN(parsedDate.getTime())) {
			return NextResponse.json(
				{ error: "Invalid reminder date." },
				{ status: 400 }
			);
		}

		// Create the reminder; if no applicationId provided, store null.
		const newReminder = await prisma.reminder.create({
			data: {
				userId: session.user.id,
				applicationId:
					applicationId && applicationId.trim() !== "" ? applicationId : null,
				title: title || "",
				reminderDate: parsedDate,
			},
		});

		return NextResponse.json(newReminder, { status: 201 });
	} catch (error) {
		console.error("Error creating reminder:", error);
		return NextResponse.json(
			{ error: "Failed to create reminder" },
			{ status: 500 }
		);
	}
}
// export async function POST(req) {
// 	const session = await getServerSession(authOptions);
// 	if (!session) {
// 		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// 	}
// 	try {
// 		const body = await req.json();

// 		// Check that the request body is valid
// 		if (!body || Object.keys(body).length === 0) {
// 			return NextResponse.json(
// 				{ error: "Request body is missing or invalid." },
// 				{ status: 400 }
// 			);
// 		}

// 		const { applicationId, message, reminderDate } = body;
// 		if (!applicationId || !reminderDate) {
// 			return NextResponse.json(
// 				{ error: "Missing required fields." },
// 				{ status: 400 }
// 			);
// 		}

// 		const parsedDate = new Date(reminderDate);
// 		if (isNaN(parsedDate.getTime())) {
// 			return NextResponse.json(
// 				{ error: "Invalid reminder date." },
// 				{ status: 400 }
// 			);
// 		}

// 		// Create the reminder (ensure that your Reminder model in Prisma is correct)
// 		const newReminder = await prisma.reminder.create({
// 			data: {
// 				userId: session.user.id, // Replace with session.user.id once authentication is set up
// 				applicationId,
// 				message: message || "",
// 				reminderDate: parsedDate,
// 			},
// 		});

// 		return NextResponse.json(newReminder, { status: 201 });
// 	} catch (error) {
// 		console.error("Error creating reminder:", error);
// 		// Return a simple error object to avoid null payload issues
// 		return NextResponse.json(
// 			{ error: "Failed to create reminder" },
// 			{ status: 500 }
// 		);
// 	}
// }

// PUT: Update an existing reminder
export async function PUT(req) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { id, reminderDate, title } = await req.json();

		if (!id) {
			return NextResponse.json(
				{ error: "Reminder ID is required." },
				{ status: 400 }
			);
		}

		// If reminderDate is provided, parse it; otherwise leave it unchanged.
		const dataToUpdate = {
			title,
			...(reminderDate ? { reminderDate: new Date(reminderDate) } : {}),
		};

		const updatedReminder = await prisma.reminder.update({
			where: { id },
			data: dataToUpdate,
		});

		return NextResponse.json(updatedReminder, { status: 200 });
	} catch (error) {
		console.error("Error updating reminder:", error);
		const errMessage = error?.message || "Unknown error";
		return NextResponse.json(
			{ error: "Failed to update reminder", details: errMessage },
			{ status: 500 }
		);
	}
}

// DELETE: Remove a reminder
export async function DELETE(req) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { id } = await req.json();

		if (!id) {
			return NextResponse.json(
				{ error: "Reminder ID is required." },
				{ status: 400 }
			);
		}

		await prisma.reminder.delete({ where: { id } });
		return NextResponse.json({ message: "Reminder deleted" }, { status: 200 });
	} catch (error) {
		console.error("Error deleting reminder:", error);
		const errMessage = error?.message || "Unknown error";
		return NextResponse.json(
			{ error: "Failed to delete reminder", details: errMessage },
			{ status: 500 }
		);
	}
}
