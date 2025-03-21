"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Profile from "../components/Profile";
import ReminderDetailsDialog from "../components/ReminderDetailsDialog";
import ApplicationSearch from "./ApplicationSearch";
import { Plus } from "lucide-react";
import { RemindersAndNotifications } from "./RemindersAndNotifications";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Navbar({
	onAddApplication,
	showForm,
	applications = [],
}) {
	const { data: session, status } = useSession();
	const router = useRouter();

	// Notifications state
	const [notifications, setNotifications] = useState([]);
	const [unreadCount, setUnreadCount] = useState(0);

	// Reminders state
	const [reminders, setReminders] = useState([]);
	const [showReminderModal, setShowReminderModal] = useState(false);
	const [selectedReminder, setSelectedReminder] = useState(null);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/");
		}
	}, [status, router]);

	// Fetch notifications and reminders on mount if user is logged in
	useEffect(() => {
		if (session) {
			fetchNotifications();
			fetchReminders();
		}
	}, [session]);

	// Poll for notifications every 30 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			fetchNotifications();
		}, 30000);
		return () => clearInterval(interval);
	}, []);

	const fetchNotifications = () => {
		fetch("/api/notifications")
			.then((res) => res.json())
			.then((data) => {
				setNotifications(data);
				setUnreadCount(data.filter((n) => !n.isRead).length);
			})
			.catch((err) => console.error("Error fetching notifications:", err));
	};

	const fetchReminders = () => {
		fetch("/api/reminders")
			.then((res) => res.json())
			.then((data) => setReminders(data))
			.catch((err) => console.error("Error fetching reminders:", err));
	};

	const markNotificationAsRead = async (notificationId) => {
		try {
			const res = await fetch("/api/notifications/read", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ notificationId }),
			});
			if (!res.ok) throw new Error("Failed to mark notification as read.");
			// Update local state
			setNotifications((prev) =>
				prev.map((notification) =>
					notification.id === notificationId
						? { ...notification, isRead: true }
						: notification
				)
			);
			setUnreadCount((prev) => Math.max(prev - 1, 0));
		} catch (error) {
			console.error("Error marking notification as read:", error);
		}
	};

	if (status === "loading") return <p className="p-6">Loading...</p>;

	return (
		<>
			<nav className="sticky top-0 z-50 w-full border-b px-4 shadow-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="flex justify-between h-14 items-center">
					{/* Logo */}
					<Image
						className="dark:invert"
						src="/tracker-icon.svg"
						alt="Job App Tracker logo"
						width={30}
						height={30}
						priority
					/>

					{/* Right Side Buttons */}
					<div className="flex items-center gap-4">
						{session && !showForm && (
							<div className="flex gap-4 items-center">
								{/* Reminders and Notifications unified menu */}

								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<RemindersAndNotifications
												notifications={notifications}
												unreadCount={unreadCount}
												markNotificationAsRead={markNotificationAsRead}
												reminders={reminders}
												showReminderModal={showReminderModal}
												setShowReminderModal={setShowReminderModal}
												setReminders={setReminders}
												setSelectedReminder={setSelectedReminder}
												applications={applications}
											/>
										</TooltipTrigger>
										<TooltipContent>
											<p>Add to library</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								{/* Application Search */}
								<ApplicationSearch applications={applications} />

								{/* Add Application Button */}

								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												onClick={onAddApplication}
												variant="outline"
												size="icon"
												className="relative rounded">
												<Plus />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Add Application</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								{/* Notifications */}
								{/* <Notifications
									notifications={notifications}
									unreadCount={unreadCount}
									markNotificationAsRead={markNotificationAsRead}
								/> */}

								{/* Reminders */}
								{/* <Reminders
									reminders={reminders}
									showReminderModal={showReminderModal}
									setShowReminderModal={setShowReminderModal}
									setReminders={setReminders}
									setSelectedReminder={setSelectedReminder}
									applications={applications}
								/> */}

								{/* Profile */}
								<Profile session={session} />
							</div>
						)}
					</div>
				</div>
			</nav>

			{/* Render Reminder Details Dialog if a reminder is selected */}
			{selectedReminder && (
				<ReminderDetailsDialog
					reminder={selectedReminder}
					onClose={() => setSelectedReminder(null)}
					onReminderUpdated={(updated) =>
						setReminders((prev) =>
							prev.map((r) => (r.id === updated.id ? updated : r))
						)
					}
					onReminderDeleted={(deletedId) => {
						setReminders((prev) => prev.filter((r) => r.id !== deletedId));
						setSelectedReminder(null);
						// Re-fetch notifications
						fetchNotifications();
					}}
				/>
			)}
		</>
	);
}
