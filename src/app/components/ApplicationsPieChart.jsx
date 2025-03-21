"use client";

import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register Chart.js modules for the Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Displays a Pie Chart of applications by status
 *
 * Props:
 * - applications: Array of job application objects, each with a `status` field
 */
export default function ApplicationsPieChart({ applications = [] }) {
	// 1. Aggregate applications by status
	const statusCounts = applications.reduce((acc, app) => {
		const status = app.status || "Unknown";
		acc[status] = (acc[status] || 0) + 1;
		return acc;
	}, {});

	// 2. Prepare data for Chart.js
	const data = {
		labels: Object.keys(statusCounts),
		datasets: [
			{
				data: Object.values(statusCounts),
				backgroundColor: [
					"#4C51BF",
					"#48BB78",
					"#F56565",
					"#ED8936",
					"#ECC94B",
					"#A0AEC0",
				],
				borderColor: "#FFFFFF",
				borderWidth: 2,
			},
		],
	};

	// 3. Chart configuration
	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "bottom",
			},
		},
	};

	return (
		<Card className="flex flex-col">
			<CardHeader>
				<CardTitle>Applications by Status</CardTitle>
				<CardDescription>Distribution of your job applications</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				{Object.keys(statusCounts).length > 0 ? (
					<Pie data={data} options={options} />
				) : (
					<p className="text-sm text-muted-foreground">No data available.</p>
				)}
			</CardContent>
		</Card>
	);
}
