// scheduler.js
import cron from "node-cron";
import { prisma } from "./app/db.js";

// Schedule the task to run every minute
cron.schedule("* * * * *", async () => {
	console.log("Running scheduled reminder check...");
	const now = new Date();

	// Query reminders that are due (i.e. reminderDate <= now)
	const dueReminders = await prisma.reminder.findMany({
		where: {
			reminderDate: { lte: now },
		},
	});

	for (const reminder of dueReminders) {
		try {
			// Check if a notification for this reminder already exists
			const existingNotification = await prisma.notification.findUnique({
				where: { reminderId: reminder.id },
			});

			if (!existingNotification) {
				// Create a new notification record for the reminder
				const notification = await prisma.notification.create({
					data: {
						userId: reminder.userId,
						reminderId: reminder.id,
						title: reminder.title || "You have a reminder!",
					},
				});
				console.log("Notification created for reminder:", reminder.id);
			} else {
				console.log(`Notification already exists for reminder ${reminder.id}`);
			}
		} catch (error) {
			console.error(`Error processing reminder ${reminder.id}:`, error);
		}
	}
});
