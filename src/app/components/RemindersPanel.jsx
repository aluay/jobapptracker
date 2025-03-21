"use client";

import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import ReminderDetailsDialog from "./ReminderDetailsDialog";

export default function RemindersPanel({ onClose }) {
	const [reminders, setReminders] = useState([]);
	const [selectedReminder, setSelectedReminder] = useState(null);

	useEffect(() => {
		fetch("/api/reminders")
			.then((res) => res.json())
			.then((data) => setReminders(data))
			.catch((err) => console.error("Error fetching reminders:", err));
	}, []);

	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Reminders</DialogTitle>
				</DialogHeader>
				{selectedReminder ? (
					// Render the details dialog when a reminder is selected
					<ReminderDetailsDialog
						reminder={selectedReminder}
						onClose={() => setSelectedReminder(null)}
						onReminderUpdated={(updated) =>
							setReminders((prev) =>
								prev.map((r) => (r.id === updated.id ? updated : r))
							)
						}
						onReminderDeleted={(deletedId) =>
							setReminders((prev) => prev.filter((r) => r.id !== deletedId))
						}
					/>
				) : (
					<div>
						{reminders.length === 0 ? (
							<p className="text-gray-500">
								Your reminder list is emptier than my fridge on a Sunday!
							</p>
						) : (
							<ul className="space-y-2">
								{reminders.map((reminder) => (
									<li
										key={reminder.id}
										className="cursor-pointer p-2 border rounded hover:bg-gray-100"
										onClick={() => setSelectedReminder(reminder)}>
										<p className="font-medium">
											{reminder.title || "Reminder"}
										</p>
										<p className="text-sm text-gray-500">
											{format(new Date(reminder.reminderDate), "PPP")}
										</p>
									</li>
								))}
							</ul>
						)}
						<div className="mt-4 flex justify-end">
							<Button variant="outline" onClick={onClose}>
								Close
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
