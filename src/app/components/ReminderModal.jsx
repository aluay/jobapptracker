"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus } from "lucide-react";

// Validation schema
const FormSchema = z.object({
	title: z.string().min(1, { message: "Reminder title is required." }),
	reminderDate: z.string().min(1, { message: "Reminder date is required." }),
	jobApplicationId: z.string().optional(),
	notes: z.string().optional(),
});

export default function ReminderModal({ applications, onReminderCreated }) {
	const [open, setOpen] = useState(false);

	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			jobApplicationId: "",
			title: "",
			reminderDate: "",
		},
	});

	const onSubmit = async (data) => {
		try {
			const response = await fetch("/api/reminders", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					applicationId: data.jobApplicationId,
					title: data.title,
					reminderDate: data.reminderDate,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create reminder.");
			}

			const newReminder = await response.json();
			onReminderCreated(newReminder);
			setOpen(false);
		} catch (error) {
			console.error("Error creating reminder:", error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost">
					<Plus />
				</Button>
			</DialogTrigger>

			<DialogContent
				className="sm:max-w-lg"
				onInteractOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}>
				<DialogHeader>
					<DialogTitle>Create Reminder</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Reminder Title</FormLabel>
									<FormControl>
										<Input
											{...field}
											onChange={field.onChange}
											placeholder="Enter reminder title"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="reminderDate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date & Time</FormLabel>
									<FormControl>
										<Input type="datetime-local" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{applications && applications.length > 0 && (
							<FormField
								control={form.control}
								name="jobApplicationId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Associated Application (optional)</FormLabel>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}>
												<SelectTrigger>
													<SelectValue placeholder="Select application" />
												</SelectTrigger>
												<SelectContent>
													{applications.map((app) => (
														<SelectItem key={app.id} value={app.id}>
															{app.company} - {app.jobTitle}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Notes (optional)</FormLabel>
									<FormControl>
										<Textarea placeholder="Add notes..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button type="submit">Create Reminder</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
