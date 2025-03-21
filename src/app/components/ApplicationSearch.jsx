import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

export default function ApplicationSearch({ applications }) {
	const [searchTerm, setSearchTerm] = useState("");
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [selectedApp, setSelectedApp] = useState(null);

	// Filter applications based on search term (case-insensitive)
	const filteredApplications = applications.filter((app) => {
		if (!searchTerm.trim()) return false;

		// Check each field individually
		const matchesCompany = (app.company || "")
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesTitle = (app.jobTitle || "")
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesDescription = (app.jobDescription || "")
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesNotes = (app.notes || "")
			.toLowerCase()
			.includes(searchTerm.toLowerCase());

		return matchesCompany || matchesTitle || matchesDescription || matchesNotes;
	});

	// Format the application date
	const formatDate = (dateString) => {
		try {
			return formatDistanceToNow(new Date(dateString), { addSuffix: true });
		} catch (e) {
			return dateString;
		}
	};

	// Open app details dialog
	const openAppDetails = (app) => {
		setSelectedApp(app);
	};

	return (
		<>
			{/* Search Button Trigger */}
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							size="icon"
							variant="outline"
							className="relative rounded"
							onClick={() => setIsSearchOpen(true)}>
							<SearchIcon size={16} aria-hidden="true" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Search</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			{/* Search Modal */}
			<Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
				<DialogContent className="sm:max-w-md md:max-w-xl lg:max-w-2xl">
					<DialogHeader className="sm:text-left flex justify-between items-center mt-4">
						<DialogTitle className="sr-only">Search Applications</DialogTitle>
						<div className="relative w-full flex-1">
							<SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search applications..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-9 focus-visible:ring-0"
								autoFocus
							/>
							{searchTerm && (
								<Button
									variant="ghost"
									size="icon"
									className="absolute right-1 top-1 h-7 w-7"
									onClick={() => setSearchTerm("")}>
									<X className="h-4 w-4" />
								</Button>
							)}
						</div>
						<DialogClose className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none" />
					</DialogHeader>

					<ScrollArea className="max-h-[60vh] overflow-y-auto px-1">
						{searchTerm.trim() === "" ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<SearchIcon className="mb-4 h-8 w-8 text-muted-foreground" />
								<p className="text-lg font-medium">Search for applications</p>
								<p className="text-sm text-muted-foreground">
									Enter a keyword to search job titles, companies, descriptions,
									and notes
								</p>
							</div>
						) : filteredApplications.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<p className="text-lg font-medium">No applications found</p>
								<p className="text-sm text-muted-foreground">
									No applications matching "{searchTerm}"
								</p>
							</div>
						) : (
							<div className="divide-y">
								{filteredApplications.map((app) => (
									<div
										key={app.id}
										className="flex items-start p-3 hover:bg-accent/50 rounded-md cursor-pointer transition-colors"
										onClick={() => {
											openAppDetails(app);
											setIsSearchOpen(false);
										}}>
										<div className="flex-1">
											<div className="font-medium">{app.jobTitle}</div>
											<div className="text-sm text-muted-foreground">
												{app.company}
											</div>
											<div className="flex flex-wrap gap-1 mt-1">
												<Badge
													variant="outline"
													className="bg-red-900 text-foreground">
													{app.location}
												</Badge>
												<Badge
													variant="outline"
													className="bg-green-900 text-foreground">
													{app.company}
												</Badge>
												<Badge
													variant="outline"
													className="bg-yellow-900 text-foreground">
													{app.status}
												</Badge>
												<Badge
													variant="outline"
													className="bg-violet-900 text-foreground">
													{formatDistanceToNow(new Date(app.appliedDate), {
														addSuffix: true,
													})}
												</Badge>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</ScrollArea>
				</DialogContent>
			</Dialog>

			{/* Application Details Modal */}
			<Dialog
				open={!!selectedApp}
				onOpenChange={(open) => !open && setSelectedApp(null)}>
				<DialogContent className="sm:max-w-lg">
					{selectedApp && (
						<>
							<DialogHeader>
								<DialogTitle className="text-lg">
									{selectedApp.jobTitle}
								</DialogTitle>
								<DialogDescription>
									{selectedApp.company}{" "}
									{selectedApp.location && `— ${selectedApp.location}`}
								</DialogDescription>
							</DialogHeader>

							<div className="space-y-4 mt-2">
								<div className="flex flex-wrap gap-2">
									<Badge variant="secondary">{selectedApp.status}</Badge>
									<Badge variant="outline">
										Applied {formatDate(selectedApp.appliedDate)}
									</Badge>
								</div>

								{selectedApp.jobDescription && (
									<div>
										<h4 className="text-sm font-medium mb-1">
											Job Description
										</h4>
										<p className="text-sm">{selectedApp.jobDescription}</p>
									</div>
								)}

								{selectedApp.notes && (
									<div>
										<h4 className="text-sm font-medium mb-1">Notes</h4>
										<p className="text-sm">{selectedApp.notes}</p>
									</div>
								)}
							</div>

							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">Close</Button>
								</DialogClose>
							</DialogFooter>
						</>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
