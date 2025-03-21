"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ApplicationsList from "../components/ApplicationsList";
import AddApplicationForm from "../components/AddApplicationForm";
import Navbar from "../components/Navbar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";
import ApplicationsPieChart from "../components/ApplicationsPieChart";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { LoaderIcon } from "lucide-react";

export default function Dashboard() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingApplication, setEditingApplication] = useState(null);
	const [deleteId, setDeleteId] = useState(null);
	const { toast } = useToast();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/");
		}
	}, [status, router]);

	useEffect(() => {
		if (session) {
			fetch("/api/applications")
				.then((res) => res.json())
				.then((data) => {
					setApplications(Array.isArray(data) ? data : []);
					setLoading(false);
				})
				.catch(() => setLoading(false));
		}
	}, [session]);

	const handleEdit = (application) => {
		setEditingApplication(application);
		setShowForm(true);
	};

	const handleDelete = async (id) => {
		setDeleteId(id);
	};

	const confirmDelete = async () => {
		const res = await fetch("/api/applications", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: deleteId }),
		});

		if (res.ok) {
			setApplications((prev) => prev.filter((app) => app.id !== deleteId));
			toast({
				title: "Success!",
				description: "Application Deleted!",
				duration: 3000,
				variant: "success",
			});
		} else {
			alert("Error deleting application.");
			toast({
				title: "Failed to Create Application!",
				description: "Something went wrong, try again later!",
				duration: 3000,
				variant: "destructive",
			});
		}
		setDeleteId(null); // Reset deleteId after operation
	};

	if (status === "loading" || loading)
		return (
			<div className="h-screen flex justify-center items-center">
				<LoaderIcon className="animate-spin" />
			</div>
		);

	return (
		<div>
			<Navbar
				applications={applications}
				showForm={showForm}
				onAddApplication={() => {
					setShowForm(true);
					setEditingApplication(null);
				}}
			/>
			{/* <PipelineTableLayout
				applications={applications}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/> */}
			<ApplicationsList
				applications={applications}
				setApplications={setApplications}
				onEdit={handleEdit}
				onDelete={handleDelete}
			/>
			<Toaster />
			{/* <ApplicationsPieChart applications={applications} /> */}
			<Dialog
				open={showForm}
				onOpenChange={(open) => open || setShowForm(false)}
				modal>
				<DialogContent
					className="max-h-[calc(100vh-2rem)] overflow-y-auto"
					onInteractOutside={(e) => e.preventDefault()}
					onEscapeKeyDown={(e) => e.preventDefault()}>
					<DialogHeader className="flex justify-between items-center">
						<DialogTitle>
							{editingApplication ? "Edit Application" : "Add New Application"}
						</DialogTitle>
					</DialogHeader>
					<AddApplicationForm
						onCancel={() => {
							setShowForm(false);
							setEditingApplication(null);
						}}
						existingApplication={editingApplication}
						setApplications={setApplications}
						applications={applications}
					/>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={!!deleteId}
				onOpenChange={(open) => !open && setDeleteId(null)}>
				<AlertDialogTrigger asChild></AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
					</AlertDialogHeader>
					<p>Are you sure you want to delete this application?</p>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setDeleteId(null)}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction onClick={confirmDelete}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
