"use client";
import React, { useState } from "react";

import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function PipelineListLayout({
	applications = [],
	onEdit,
	onDelete,
}) {
	const statuses = ["all", "submitted", "interviewed", "offered", "rejected"];

	// Which status is currently selected?
	const [filterStatus, setFilterStatus] = useState("all");

	// Filtered list based on filterStatus
	const filteredApps =
		filterStatus === "all"
			? applications
			: applications.filter((app) => app.status === filterStatus);

	return (
		<div className="p-4 space-y-6">
			{/* 1) A single dropdown to pick the status filter */}
			<div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
				<h2 className="text-lg font-bold mb-3">Filter by Status</h2>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="border rounded px-3 py-2 font-medium hover:bg-accent hover:text-accent-foreground">
							{filterStatus === "all"
								? `all (${applications.length})`
								: `${filterStatus} (${
										applications.filter((app) => app.status === filterStatus)
											.length
								  })`}
						</button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align="start">
						{statuses.map((status) => {
							// If status === "all", show total count; otherwise, show count for that status
							const count =
								status === "all"
									? applications.length
									: applications.filter((app) => app.status === status).length;

							return (
								<DropdownMenuItem
									key={status}
									onClick={() => setFilterStatus(status)}
									className="cursor-pointer">
									{status} ({count})
								</DropdownMenuItem>
							);
						})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* 2) Mobile-friendly list of filtered applications */}
			<div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-2">
				{filteredApps.map((app) => (
					<div
						key={app.id}
						className="rounded-md border p-3 flex flex-col gap-2
                       sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="font-semibold">{app.company}</p>
							<p className="text-sm text-muted-foreground">{app.jobTitle}</p>
							<p className="text-xs text-muted-foreground">
								{app.status} &bull;{" "}
								{app.dateApplied
									? new Date(app.dateApplied).toLocaleDateString()
									: "N/A"}
							</p>
						</div>
						<div className="flex gap-2 self-start sm:self-center">
							<button
								className="rounded bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600"
								onClick={() => onEdit?.(app)}>
								Edit
							</button>
							<button
								className="rounded bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
								onClick={() => onDelete?.(app.id)}>
								Delete
							</button>
						</div>
					</div>
				))}

				{filteredApps.length === 0 && (
					<p className="p-4 text-center text-sm text-muted-foreground">
						No applications found for <strong>{filterStatus}</strong>.
					</p>
				)}
			</div>
		</div>
	);
}
