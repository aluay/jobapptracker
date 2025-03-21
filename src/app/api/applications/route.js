import { prisma } from "@/app/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Handles CRUD operations for job applications.
 * - GET: Fetch all applications for the logged-in user.
 * - POST: Add a new job application.
 * - PUT: Update an application.
 * - DELETE: Delete an application.
 */

// GET: Fetch all job applications for the logged-in user
export async function GET(req) {
	const session = await getServerSession(authOptions);
	if (!session)
		return Response.json({ error: "Unauthorized" }, { status: 401 });

	try {
		const applications = await prisma.jobApplication.findMany({
			where: { userId: session.user.id },
			orderBy: { appliedDate: "desc" },
		});

		return Response.json(applications);
	} catch (error) {
		return Response.json(
			{ error: "Failed to fetch applications" },
			{ status: 500 }
		);
	}
}

// POST: Add a new job application
export async function POST(req) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const data = await req.json();
		const newApplication = await prisma.jobApplication.create({
			data: {
				userId: session.user.id,
				...data, // Spreads the data, ensuring required fields are validated by Prisma
				appliedDate: new Date(data.appliedDate),
				interviewDate: data.interviewDate ? new Date(data.interviewDate) : null,
				followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
			},
		});

		return Response.json(newApplication, { status: 201 });
	} catch (error) {
		return Response.json(
			{ error: "Failed to add application" },
			{ status: 500 }
		);
	}
}

// PUT: Update an application
export async function PUT(req) {
	const session = await getServerSession(authOptions);
	if (!session)
		return Response.json({ error: "Unauthorized" }, { status: 401 });

	try {
		const { id, ...data } = await req.json();

		// Ensure the application belongs to the logged-in user
		const existingApplication = await prisma.jobApplication.findFirst({
			where: { id, userId: session.user.id },
		});
		if (!existingApplication) {
			return Response.json({ error: "Application not found" }, { status: 404 });
		}

		const updatedApplication = await prisma.jobApplication.update({
			where: { id },
			data: {
				...data,
				appliedDate: new Date(data.appliedDate),
				interviewDate: data.interviewDate ? new Date(data.interviewDate) : null,
				followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
			},
		});

		return Response.json(updatedApplication);
	} catch (error) {
		return Response.json(
			{ error: "Failed to update application" },
			{ status: 500 }
		);
	}
}

// DELETE: Remove a job application
export async function DELETE(req) {
	const session = await getServerSession(authOptions);
	if (!session)
		return Response.json({ error: "Unauthorized" }, { status: 401 });

	try {
		const { id } = await req.json();

		// Ensure the application belongs to the logged-in user
		const existingApplication = await prisma.jobApplication.findFirst({
			where: { id, userId: session.user.id },
		});
		if (!existingApplication) {
			return Response.json({ error: "Application not found" }, { status: 404 });
		}

		await prisma.jobApplication.delete({
			where: { id },
		});

		return Response.json({ message: "Application deleted" });
	} catch (error) {
		return Response.json(
			{ error: "Failed to delete application" },
			{ status: 500 }
		);
	}
}

// PATCH: Toggle pinning of a job application
export async function PATCH(req) {
	const session = await getServerSession(authOptions);
	if (!session)
		return Response.json({ error: "Unauthorized" }, { status: 401 });

	try {
		const { id, pinned } = await req.json();

		// Ensure the application belongs to the logged-in user
		const existingApplication = await prisma.jobApplication.findFirst({
			where: { id, userId: session.user.id },
		});
		if (!existingApplication) {
			return Response.json({ error: "Application not found" }, { status: 404 });
		}

		const updatedApplication = await prisma.jobApplication.update({
			where: { id },
			data: { pinned },
		});

		return Response.json(updatedApplication);
	} catch (error) {
		return Response.json(
			{ error: "Failed to update application pin status" },
			{ status: 500 }
		);
	}
}
