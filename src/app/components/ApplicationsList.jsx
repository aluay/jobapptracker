"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import HorizontalCard from "./HorizontalCard";

const statuses = [
	{ key: "saved", label: "Saved", color: "bg-blue-500" },
	{ key: "submitted", label: "Submitted", color: "bg-green-500" },
	{ key: "interviewed", label: "Interviewed", color: "bg-yellow-500" },
	{ key: "offered", label: "Offered", color: "bg-violet-500" },
	{ key: "rejected", label: "Rejected", color: "bg-red-500" },
];

export default function ApplicationsList({
	applications,
	onEdit,
	onDelete,
	setApplications,
}) {
	if (!setApplications) {
		console.error("setApplications prop is missing!");
		return null;
	}

	const [groupedApps, setGroupedApps] = useState(
		statuses.reduce((acc, { key }) => {
			acc[key] = applications
				.filter((app) => app.status === key)
				.sort((a, b) => (b.pinned ? 1 : -1));
			return acc;
		}, {})
	);

	useEffect(() => {
		const grouped = statuses.reduce((acc, { key }) => {
			acc[key] = applications
				.filter((app) => app.status === key)
				.sort((a, b) => (b.pinned ? 1 : -1));
			return acc;
		}, {});
		setGroupedApps(grouped);
	}, [applications]);

	const onDragEnd = async (result) => {
		const { source, destination } = result;
		if (!destination) return;

		const sourceStatus = source.droppableId;
		const destinationStatus = destination.droppableId;

		if (sourceStatus === destinationStatus) {
			const updatedApps = Array.from(groupedApps[sourceStatus]);
			const [movedApp] = updatedApps.splice(source.index, 1);
			updatedApps.splice(destination.index, 0, movedApp);
			setGroupedApps((prev) => ({ ...prev, [sourceStatus]: updatedApps }));
		} else {
			const sourceApps = Array.from(groupedApps[sourceStatus]);
			const [movedApp] = sourceApps.splice(source.index, 1);
			const destinationApps = Array.from(groupedApps[destinationStatus]);
			destinationApps.splice(destination.index, 0, {
				...movedApp,
				status: destinationStatus,
			});

			setGroupedApps((prev) => ({
				...prev,
				[sourceStatus]: sourceApps,
				[destinationStatus]: destinationApps,
			}));

			try {
				const res = await fetch("/api/applications/status", {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ id: movedApp.id, status: destinationStatus }),
				});
				if (!res.ok) throw new Error("Failed to persist status change.");
			} catch (error) {
				console.error("Error saving status:", error);
				alert("Failed to save status. Please try again.");
			}

			setApplications((prevApps) =>
				prevApps.map((app) =>
					app.id === movedApp.id ? { ...app, status: destinationStatus } : app
				)
			);
		}
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mt-4 mx-auto max-w-[1400px]">
				{statuses.map(({ key, label, color }) => (
					<div key={key} className="flex flex-col m-2">
						<div className="flex items-center bg-zinc-900 p-2 rounded-t">
							<div className={`w-4 h-4 rounded-full ${color}`}></div>
							<h2 className="ml-2 text-muted-foreground">{label}</h2>
						</div>
						<Droppable droppableId={key} direction="vertical">
							{(provided) => (
								<div
									ref={provided.innerRef}
									{...provided.droppableProps}
									className="bg-zinc-900 rounded-b p-2 min-h-[50px] w-full">
									{groupedApps[key].map((application, index) => (
										<Draggable
											key={application.id}
											draggableId={application.id}
											index={index}>
											{(provided) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													className="cursor-default select-none">
													<HorizontalCard
														application={application}
														onEdit={onEdit}
														onDelete={onDelete}
														setApplications={setApplications}
														handleProps={provided.dragHandleProps}
													/>
												</div>
											)}
										</Draggable>

										// <Draggable
										// 	key={application.id}
										// 	draggableId={application.id}
										// 	index={index}>
										// 	{(provided) => (
										// 		<div
										// 			ref={provided.innerRef}
										// 			{...provided.draggableProps}
										// 			{...provided.dragHandleProps}
										// 			className="cursor-grab active:cursor-grabbing select-none">
										// 			<HorizontalCard
										// 				application={application}
										// 				onEdit={onEdit}
										// 				onDelete={onDelete}
										// 			/>
										// 		</div>
										// 	)}
										// </Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</div>
				))}
			</div>
		</DragDropContext>
	);
}
