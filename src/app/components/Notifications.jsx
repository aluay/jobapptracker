"use client";

import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

/**
 * Props:
 * - notifications: array of notification objects
 * - unreadCount: number of unread notifications
 * - markNotificationAsRead: function to mark a notification as read
 */
export default function Notifications({
	notifications,
	markNotificationAsRead,
}) {
	return (
		<>
			{notifications.map((notification) => (
				<div key={notification.id} className="p-2 border rounded w-full">
					<div className="flex gap-2">
						<div className="flex grow gap-3">
							<Bell className="text-indigo-500" size={16} aria-hidden="true" />
							<div className="flex w-full justify-between">
								<div className="space-y-1">
									<p className="text-sm font-medium leading-none">
										{notification.title}
									</p>

									<span className="text-xs text-muted-foreground">
										{formatDistanceToNow(new Date(notification.createdAt), {
											addSuffix: true,
										})}
									</span>
								</div>
								<div className="flex gap-2">
									{!notification.isRead && (
										<Button
											type="button"
											variant="outline"
											size="icon"
											onClick={(e) => {
												e.stopPropagation(); // Prevent parent onClick from firing
												markNotificationAsRead(notification.id);
											}}>
											<Check />
										</Button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</>
	);
}
