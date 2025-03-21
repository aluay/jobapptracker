"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Define validation schema using zod
const ReminderSchema = z.object({
	title: z.string().min(1, { message: "Reminder title is required." }),
	reminderDate: z.string().min(1, { message: "Reminder date is required." }),
});

export default function ReminderDetailsDialog({
	reminder,
	onClose,
	onReminderUpdated,
	onReminderDeleted,
}) {
	const form = useForm({
		resolver: zodResolver(ReminderSchema),
		defaultValues: {
			title: reminder.title,
			reminderDate: reminder.reminderDate.split("T")[0],
		},
	});

	const onSubmit = async (data) => {
		try {
			const res = await fetch("/api/reminders", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: reminder.id, ...data }),
			});
			if (!res.ok) throw new Error("Failed to update reminder.");
			const updatedReminder = await res.json();
			onReminderUpdated(updatedReminder);
			toast.success("Reminder updated!");
			onClose();
		} catch (error) {
			console.error("Error updating reminder:", error);
			toast.error("Error updating reminder.");
		}
	};

	const handleDelete = async () => {
		try {
			const res = await fetch("/api/reminders", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: reminder.id }),
			});
			if (!res.ok) throw new Error("Failed to delete reminder.");
			onReminderDeleted(reminder.id);
			toast.success("Reminder deleted!");
			onClose();
		} catch (error) {
			console.error("Error deleting reminder:", error);
			toast.error("Error deleting reminder.");
		}
	};

	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent
				className="sm:max-w-md"
				onInteractOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}>
				<DialogHeader>
					<DialogTitle>Edit Reminder</DialogTitle>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<label className="block text-sm font-semibold">
							Reminder Title
						</label>
						<Input
							{...form.register("message")}
							placeholder="Enter reminder title"
						/>
						{form.formState.errors.message && (
							<p className="text-red-500 text-xs">
								{form.formState.errors.message.message}
							</p>
						)}
					</div>
					<div className="space-y-2">
						<label className="block text-sm font-semibold">Date & Time</label>
						<Input type="datetime-local" {...form.register("reminderDate")} />
						{form.formState.errors.reminderDate && (
							<p className="text-red-500 text-xs">
								{form.formState.errors.reminderDate.message}
							</p>
						)}
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button type="button" variant="destructive" onClick={handleDelete}>
							Delete
						</Button>
						<Button type="submit">Save Changes</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
