import { NextResponse } from "next/server";
import { prisma } from "@/app/db";

export async function PUT(req, { params }) {
	const { status } = await req.json();
	const updatedApplication = await prisma.application.update({
		where: { id: Number(params.id) },
		data: { status },
	});
	return NextResponse.json(updatedApplication);
}

export async function DELETE(req, { params }) {
	await prisma.application.delete({ where: { id: Number(params.id) } });
	return NextResponse.json({}, { status: 204 });
}
