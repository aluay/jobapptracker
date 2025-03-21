"use client";

import { useMemo, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Schema Validation
const FormSchema = z.object({
	company: z.string().min(1, "Company name is required"),
	jobTitle: z.string().min(1, "Job title is required"),
	location: z.string().optional(),
	status: z.enum(["saved", "submitted", "interviewed", "offered", "rejected"]),
	appliedDate: z.string(),
	salary: z.string().optional(),
	jobDescription: z.string().optional(),
	recruiterName: z.string().optional(),
	recruiterEmail: z.string().optional(),
	recruiterPhone: z.string().optional(),
	notes: z.string().optional(),
	interviewDate: z.string().optional(),
	followUpDate: z.string().optional(),
});

export default function AddApplicationForm({
	onCancel,
	setApplications,
	existingApplication,
}) {
	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: useMemo(
			() => ({
				company: "",
				jobTitle: "",
				location: "",
				status: "saved",
				appliedDate: new Date().toISOString().split("T")[0],
				salary: "",
				jobDescription: "",
				recruiterName: "",
				recruiterEmail: "",
				recruiterPhone: "",
				notes: "",
				interviewDate: "",
				followUpDate: "",
			}),
			[]
		),
	});
	const { toast } = useToast();

	// Populate form with existing application data if available
	useEffect(() => {
		if (existingApplication) {
			form.reset({
				...existingApplication,
				appliedDate: existingApplication.appliedDate?.slice(0, 10) || "",
				interviewDate: existingApplication.interviewDate?.slice(0, 10) || "",
				followUpDate: existingApplication.followUpDate?.slice(0, 10) || "",
			});
		}
	}, [existingApplication, form]);

	const onSubmit = useCallback(
		async (data) => {
			const method = existingApplication ? "PUT" : "POST";
			const endpoint = "/api/applications";

			try {
				const res = await fetch(endpoint, {
					method,
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(
						existingApplication ? { ...data, id: existingApplication.id } : data
					),
				});

				// if (!res.ok) throw new Error("Failed to save application");

				if (method === "PUT") {
					if (!res.ok) {
						toast({
							title: "Failed to Update Application!",
							description: "Something went wrong, try again later!",
							duration: 3000,
							variant: "destructive",
						});
						throw new Error("Failed to update application.");
					} else {
						toast({
							title: "Success!",
							description: "Application Updated!",
							duration: 3000,
							variant: "success",
						});
					}
				} else {
					if (!res.ok) {
						toast({
							title: "Failed to Create Application!",
							description: "Something went wrong, try again later!",
							duration: 3000,
							variant: "destructive",
						});
						throw new Error("Failed to save application.");
					} else {
						toast({
							title: "Success!",
							description: "Application Created!",
							duration: 3000,
							variant: "success",
						});
					}
				}

				const responseBody = await res.json();
				setApplications((prev) =>
					existingApplication
						? prev.map((app) =>
								app.id === existingApplication.id ? responseBody : app
						  )
						: [...prev, responseBody]
				);
				onCancel();
			} catch (error) {
				alert("Error saving application. Check console for details.");
				console.error("Form Submission Error:", error);
			}
		},
		[existingApplication, setApplications, onCancel]
	);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Company Name */}
					<FormField
						control={form.control}
						name="company"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company</FormLabel>
								<FormControl>
									<Input required placeholder="Google" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Job Title */}
					<FormField
						control={form.control}
						name="jobTitle"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Job Title</FormLabel>
								<FormControl>
									<Input required placeholder="Software Engineer" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Location */}
					<FormField
						control={form.control}
						name="location"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Location</FormLabel>
								<FormControl>
									<Input placeholder="Remote / New York" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Status */}
					<FormField
						control={form.control}
						name="status"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Status</FormLabel>
								<Select
									key={field.value} // Force re-mount when value changes
									value={field.value}
									onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="saved">Saved</SelectItem>
										<SelectItem value="submitted">Submitted</SelectItem>
										<SelectItem value="interviewed">Interviewed</SelectItem>
										<SelectItem value="offered">Offered</SelectItem>
										<SelectItem value="rejected">Rejected</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Applied Date */}
					<FormField
						control={form.control}
						name="appliedDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Applied Date</FormLabel>
								<FormControl>
									<Input type="date" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Salary */}
					<FormField
						control={form.control}
						name="salary"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Salary</FormLabel>
								<FormControl>
									<Input placeholder="$100,000" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Recruiter Name */}
					<FormField
						control={form.control}
						name="recruiterName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Recruiter Name</FormLabel>
								<FormControl>
									<Input placeholder="John Doe" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Recruiter Email */}
					<FormField
						control={form.control}
						name="recruiterEmail"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Recruiter Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="recruiter@example.com"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Recruiter Phone */}
					<FormField
						control={form.control}
						name="recruiterPhone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Recruiter Phone</FormLabel>
								<FormControl>
									<Input
										type="tel"
										placeholder="+1 (555) 555-5555"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Interview Date */}
					<FormField
						control={form.control}
						name="interviewDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Interview Date</FormLabel>
								<FormControl>
									<Input type="date" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Follow-up Date */}
					<FormField
						control={form.control}
						name="followUpDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Follow-up Date</FormLabel>
								<FormControl>
									<Input type="date" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Job Description */}
				<FormField
					control={form.control}
					name="jobDescription"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Job Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Paste job description here..."
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Notes */}
				<FormField
					control={form.control}
					name="notes"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Additional Notes</FormLabel>
							<FormControl>
								<Textarea placeholder="Any additional notes..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Buttons */}
				<div className="flex justify-between">
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button type="submit">
						{existingApplication ? "Update" : "Save"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
