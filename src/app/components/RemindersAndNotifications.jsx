"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Notifications from "./Notifications";
import Reminders from "./Reminders";
import ReminderModal from "./ReminderModal";
import { Badge } from "@/components/ui/badge";

export function RemindersAndNotifications({
	notifications,
	unreadCount,
	markNotificationAsRead,
	reminders,
	showReminderModal,
	setShowReminderModal,
	setReminders,
	setSelectedReminder,
	applications,
}) {
	const [open, setOpen] = useState(false);
	const [sortedAllItems, setSortedAllItems] = useState([]);

	useEffect(() => {
		// Create a combined array with an extra "type" property
		const allItems = [
			...notifications.map((n) => ({ ...n, type: "notification" })),
			...reminders.map((r) => ({ ...r, type: "reminder" })),
		];

		// Sort by createdAt descending
		const sortedAll = allItems.sort(
			(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
		);

		setSortedAllItems(sortedAll);
	}, [notifications, reminders]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="relative rounded"
					aria-label="Activity">
					<Activity />
					{unreadCount > 0 && (
						<Badge
							variant="destructive"
							className="absolute -top-2 -right-3 flex h-5 w-4 items-center justify-center rounded-full">
							{unreadCount}
						</Badge>
					)}
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-96">
				<ReminderModal
					applications={applications}
					open={showReminderModal}
					onOpenChange={setShowReminderModal}
					onReminderCreated={(newReminder) =>
						setReminders((prev) => [...prev, newReminder])
					}
				/>

				<ScrollArea className="h-96">
					{/* Map over the combined + sorted array */}
					{sortedAllItems.map((item) => {
						// If it's a notification, render the Notifications component
						if (item.type === "notification") {
							// Pass a single-element array to keep the existing Notifications logic intact
							return (
								<Notifications
									key={item.id}
									notifications={[item]}
									unreadCount={unreadCount}
									markNotificationAsRead={markNotificationAsRead}
								/>
							);
						}
						// Otherwise, it's a reminder
						return (
							<Reminders
								key={item.id}
								reminders={[item]}
								setSelectedReminder={setSelectedReminder}
							/>
						);
					})}
				</ScrollArea>
			</PopoverContent>
		</Popover>
	);
}
