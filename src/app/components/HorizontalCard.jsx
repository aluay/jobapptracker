"use client";
import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EllipsisVertical, Grip, Pin, PinOff } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// className={`rounded p-2 mt-1 border ${
// 	status === "saved"
// 		? "border-blue-900"
// 		: status === "submitted"
// 		? "border-green-900"
// 		: status === "interviewed"
// 		? "border-yellow-900"
// 		: status === "offered"
// 		? "border-violet-900"
// 		: status === "rejected"
// 		? "border-red-900"
// 		: "border-gray-900" // Fallback color
// }`}

// Job Application Horizontal Card
export default function HorizontalCard({
	application,
	onEdit,
	onDelete,
	setApplications,
	handleProps,
}) {
	const {
		company,
		jobTitle,
		location,
		status,
		appliedDate,
		salary,
		updatedAt,
		createdAt,
		jobDescription,
		notes,
	} = application;
	const { toast } = useToast();
	// Add handlePinToggle function to the component
	const handlePinToggle = async () => {
		const { id, pinned } = application;

		try {
			const res = await fetch("/api/applications", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id, pinned: !pinned }),
			});

			if (!res.ok) {
				toast({
					title: "Failed!",
					description: "Something went wrong, try again later!",
					duration: 3000,
					variant: "destructive",
				});
				throw new Error("Failed to update pin status.");
			} else if (pinned) {
				toast({
					title: "Success!",
					description: "Application Unpinned.",
					duration: 3000,
					variant: "success",
				});
			} else {
				toast({
					title: "Success!",
					description: "Applications Pinned.",
					duration: 3000,
					variant: "success",
				});
			}

			setApplications((prevApps) =>
				prevApps.map((app) =>
					app.id === id ? { ...app, pinned: !pinned } : app
				)
			);
		} catch (error) {
			console.error("Error updating pin status:", error);
			alert("Failed to update pin status. Please try again.");
		}
	};

	return (
		<Card
			className={`rounded p-2 mt-1 border ${
				application.pinned ? "border border-dashed border-sky-300" : ""
			}`}>
			<CardHeader>
				<div className="flex items-center justify-between w-full">
					<div
						{...handleProps}
						className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-zinc-900">
						<Grip size={16} />
					</div>
					<div className="flex items-center space-x-2">
						{/* <Button
							variant="outline"
							size="icon"
							className="p-0 m-0 border-none"
							onClick={handlePinToggle}
							aria-label={application.pinned ? "Unpin" : "Pin"}>
							{application.pinned ? <PinOff /> : <Pin />}
						</Button> */}
						{/* <label
							htmlFor={`pin-${application.id}`}
							className="text-sm text-muted-foreground">
							Pin
						</label>
						<input
							id={`pin-${application.id}`}
							type="checkbox"
							className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
							checked={application.pinned}
							onChange={(e) =>
								handlePinToggle(application.id, e.target.checked)
							}
						/> */}
						<DropdownMenu>
							<DropdownMenuTrigger className="p-1 rounded hover:bg-zinc-900">
								<EllipsisVertical size={16} />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem onClick={() => onEdit(application)}>
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => onDelete(application.id)}>
									Delete
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={handlePinToggle}
									aria-label={application.pinned ? "Unpin" : "Pin"}>
									{application.pinned ? "Unpin" : "Pin"}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<div className="mb-1">
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="link" className="p-0 text-left">
								<span className="font-bold text-foreground/75">{jobTitle}</span>
							</Button>
						</DialogTrigger>

						<DialogContent className="sm:max-w-lg">
							<DialogHeader>
								<DialogTitle className="text-lg">{jobTitle}</DialogTitle>
								<DialogDescription>
									{company} — {location}
								</DialogDescription>
							</DialogHeader>

							<div className="space-y-4 mt-2">
								<p className="text-sm">
									<strong>Status:</strong> {status}
								</p>
							</div>

							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">Close</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
				<div className="flex flex-wrap gap-2">
					<Badge
						variant="outline"
						className="bg-green-900 text-green-300 border-none">
						{company}
					</Badge>
					{location && (
						<div className="max-w-full">
							<Badge
								variant="outline"
								className="inline-block max-w-full bg-red-900 text-red-300 border-none">
								<span className="truncate block">{location}</span>
							</Badge>
						</div>
					)}
					{salary && (
						<div className="max-w-full">
							<Badge
								variant="outline"
								className="inline-block max-w-full bg-yellow-900 text-yellow-300 border-none">
								<span className="truncate block">${salary}</span>
							</Badge>
						</div>
					)}
					{appliedDate && (
						<div className="max-w-full">
							<Badge
								variant="outline"
								className="inline-block max-w-full bg-violet-900 text-violet-300 border-none">
								<span className="truncate block">
									{formatDistanceToNow(new Date(appliedDate), {
										addSuffix: true,
									})}
								</span>
							</Badge>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
