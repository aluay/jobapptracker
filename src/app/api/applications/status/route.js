import { prisma } from "@/app/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { id, status } = await req.json();

		const updatedApplication = await prisma.jobApplication.update({
			where: { id },
			data: { status },
		});

		return Response.json(updatedApplication);
	} catch (error) {
		console.error("Failed to update application status:", error);
		return Response.json(
			{ error: "Failed to update application status" },
			{ status: 500 }
		);
	}
}
