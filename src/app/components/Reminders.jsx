"use client";

import { CalendarClock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

/**
 * Props:
 * - reminders: array of reminder objects
 * - showReminderModal: boolean for opening/closing the reminder modal
 * - setShowReminderModal: setter for showReminderModal
 * - setReminders: setter to update the reminders array in the parent
 * - setSelectedReminder: setter for the currently selected reminder (for details dialog)
 * - applications: array of job applications (passed to ReminderModal)
 */
export default function Reminders({ reminders, setSelectedReminder }) {
	return (
		<>
			{reminders.map((reminder) => (
				<div key={reminder.id} className="p-2 border rounded w-full">
					<div className="flex gap-2">
						<div className="flex grow gap-3">
							<CalendarClock
								className="text-red-500"
								size={16}
								aria-hidden="true"
							/>
							<div className="flex grow flex-col gap-3">
								<div
									key={reminder.id}
									onClick={() => setSelectedReminder(reminder)}>
									<div className="space-y-1">
										<p className="text-sm font-medium leading-none">
											{reminder.title}
										</p>

										<span className="text-xs text-muted-foreground">
											{formatDistanceToNow(new Date(reminder.createdAt), {
												addSuffix: true,
											})}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</>
	);
}
