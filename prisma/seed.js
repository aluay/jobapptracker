import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	await prisma.jobApplication.deleteMany(); // Clear existing data

	const jobApplications = [
		{
			userId: "cm86otuxs0000wa3gwew40ael",
			company: "Google",
			jobTitle: "Software Engineer",
			location: "Mountain View, CA",
			status: "saved",
			appliedDate: new Date().toISOString(),
			salary: "$120,000 - $150,000",
			jobDescription: "Developing scalable applications.",
			recruiterName: "John Doe",
			recruiterEmail: "john.doe@google.com",
			recruiterPhone: "123-456-7890",
			notes: "Focus on data structures and algorithms.",
			interviewDate: null,
			followUpDate: null,
		},
		{
			userId: "cm86otuxs0000wa3gwew40ael",
			company: "Facebook",
			jobTitle: "Frontend Developer",
			location: "Menlo Park, CA",
			status: "saved",
			appliedDate: new Date().toISOString(),
			salary: "$130,000 - $160,000",
			jobDescription: "Building interactive UIs.",
			recruiterName: "Jane Smith",
			recruiterEmail: "jane.smith@facebook.com",
			recruiterPhone: "234-567-8901",
			notes: "React.js experience required.",
			interviewDate: null,
			followUpDate: null,
		},
		{
			userId: "cm86otuxs0000wa3gwew40ael",
			company: "Microsoft",
			jobTitle: "Cloud Engineer",
			location: "Redmond, WA",
			status: "saved",
			appliedDate: new Date().toISOString(),
			salary: "$140,000 - $170,000",
			jobDescription: "Cloud infrastructure development.",
			recruiterName: "Robert Brown",
			recruiterEmail: "robert.brown@microsoft.com",
			recruiterPhone: "345-678-9012",
			notes: "Azure experience preferred.",
			interviewDate: null,
			followUpDate: null,
		},
		{
			userId: "cm86otuxs0000wa3gwew40ael",
			company: "Amazon",
			jobTitle: "Backend Engineer",
			location: "Seattle, WA",
			status: "saved",
			appliedDate: new Date().toISOString(),
			salary: "$125,000 - $155,000",
			jobDescription: "Backend services and APIs.",
			recruiterName: "Alice Johnson",
			recruiterEmail: "alice.johnson@amazon.com",
			recruiterPhone: "456-789-0123",
			notes: "System design questions in interview.",
			interviewDate: null,
			followUpDate: null,
		},
		{
			userId: "cm86otuxs0000wa3gwew40ael",
			company: "Netflix",
			jobTitle: "Data Scientist",
			location: "Los Gatos, CA",
			status: "saved",
			appliedDate: new Date().toISOString(),
			salary: "$135,000 - $165,000",
			jobDescription: "Data analysis and ML modeling.",
			recruiterName: "Michael Lee",
			recruiterEmail: "michael.lee@netflix.com",
			recruiterPhone: "567-890-1234",
			notes: "Python and SQL required.",
			interviewDate: null,
			followUpDate: null,
		},
		{
			userId: "cm86otuxs0000wa3gwew40ael",
			company: "Twitter",
			jobTitle: "Product Manager",
			location: "San Francisco, CA",
			status: "saved",
			appliedDate: new Date().toISOString(),
			salary: "$140,000 - $175,000",
			jobDescription: "Driving product strategy.",
			recruiterName: "Emily White",
			recruiterEmail: "emily.white@twitter.com",
			recruiterPhone: "678-901-2345",
			notes: "Focus on user engagement.",
			interviewDate: null,
			followUpDate: null,
		},
		{
			userId: "cm86otuxs0000wa3gwew40ael",
			company: "Tesla",
			jobTitle: "AI Engineer",
			location: "Palo Alto, CA",
			status: "saved",
			appliedDate: new Date().toISOString(),
			salary: "$145,000 - $180,000",
			jobDescription: "Developing AI for self-driving.",
			recruiterName: "David Clark",
			recruiterEmail: "david.clark@tesla.com",
			recruiterPhone: "789-012-3456",
			notes: "Python and TensorFlow required.",
			interviewDate: null,
			followUpDate: null,
		},
		{
			userId: "cm86otuxs0000wa3gwew40ael",
			company: "Apple",
			jobTitle: "iOS Developer",
			location: "Cupertino, CA",
			status: "saved",
			appliedDate: new Date().toISOString(),
			salary: "$130,000 - $160,000",
			jobDescription: "Building iOS applications.",
			recruiterName: "Olivia Martinez",
			recruiterEmail: "olivia.martinez@apple.com",
			recruiterPhone: "890-123-4567",
			notes: "Swift experience required.",
			interviewDate: null,
			followUpDate: null,
		},
		{
			userId: "cm86otuxs0000wa3gwew40ael",
			company: "Spotify",
			jobTitle: "UX Designer",
			location: "New York, NY",
			status: "saved",
			appliedDate: new Date().toISOString(),
			salary: "$110,000 - $140,000",
			jobDescription: "Enhancing user experience.",
			recruiterName: "Daniel Garcia",
			recruiterEmail: "daniel.garcia@spotify.com",
			recruiterPhone: "901-234-5678",
			notes: "Portfolio review in interview.",
			interviewDate: null,
			followUpDate: null,
		},
		{
			userId: "cm86otuxs0000wa3gwew40ael",
			company: "Airbnb",
			jobTitle: "Security Engineer",
			location: "San Francisco, CA",
			status: "saved",
			appliedDate: new Date().toISOString(),
			salary: "$135,000 - $170,000",
			jobDescription: "Securing cloud infrastructure.",
			recruiterName: "Sophia Wilson",
			recruiterEmail: "sophia.wilson@airbnb.com",
			recruiterPhone: "012-345-6789",
			notes: "Penetration testing experience required.",
			interviewDate: null,
			followUpDate: null,
		},
	];

	// Duplicating jobs to reach 20
	for (let i = 0; i < 10; i++) {
		jobApplications.push({
			...jobApplications[i % jobApplications.length],
			company:
				jobApplications[i % jobApplications.length].company + " (Duplicate)",
		});
	}

	await prisma.jobApplication.createMany({
		data: jobApplications,
	});

	console.log("✅ 20 Job Applications Seeded!");

	await prisma.$disconnect();
}

main().catch((error) => {
	console.error("Error seeding job applications:", error);
	prisma.$disconnect();
	process.exit(1);
});
