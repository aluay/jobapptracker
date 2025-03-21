"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginButton from "./components/LoginButton";
import ThemeToggle from "./components/ThemeToggle";
import "./globals.css";

export default function Home() {
	const { data: session, status } = useSession();
	const router = useRouter();

	// Redirect to dashboard if already logged in
	useEffect(() => {
		if (status === "authenticated") {
			router.push("/dashboard");
		}
	}, [status, router]);

	return (
		<div className="flex flex-col min-h-screen">
			<header className="flex w-full justify-center items-center">
				<div className="container p-2 flex items-center justify-between md:max-w-5xl border-r border-l border-b border-dashed">
					<a className="items-center space-x-2 md:flex" href="/">
						<svg
							className="w-6 h-6 text-black dark:text-white"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="currentColor"
							viewBox="0 0 24 24">
							<path
								fillRule="evenodd"
								d="M20.337 3.664c.213.212.354.486.404.782.294 1.711.657 5.195-.906 6.76-1.77 1.768-8.485 5.517-10.611 6.683a.987.987 0 0 1-1.176-.173l-.882-.88-.877-.884a.988.988 0 0 1-.173-1.177c1.165-2.126 4.913-8.841 6.682-10.611 1.562-1.563 5.046-1.198 6.757-.904.296.05.57.191.782.404ZM5.407 7.576l4-.341-2.69 4.48-2.857-.334a.996.996 0 0 1-.565-1.694l2.112-2.111Zm11.357 7.02-.34 4-2.111 2.113a.996.996 0 0 1-1.69-.565l-.422-2.807 4.563-2.74Zm.84-6.21a1.99 1.99 0 1 1-3.98 0 1.99 1.99 0 0 1 3.98 0Z"
								clipRule="evenodd"
							/>
						</svg>
					</a>
					<div className="flex gap-4 items-center">
						<ThemeToggle />
						{/* <nav className="gap-4 items-center hidden md:flex">
							<LoginButton />
						</nav> */}
					</div>
				</div>
			</header>
			<main className="flex flex-col flex-1 w-full items-center">
				<section className="container flex justify-center space-y-6 py-32 md:py-48 lg:py-52 md:max-w-5xl border-r border-l border-dashed">
					<div className="container flex flex-col items-center gap-4">
						<h1 className="font-bold text-3xl md:text-6xl">
							Track. Organize. Get Hired.
						</h1>
						<p className="leading-normal text-muted-foreground sm:text-xl sm:leading-8">
							Centralize the management of your job applications.
						</p>
						<div className="flex gap-4 flex-wrap justify-center">
							<LoginButton />
							<a
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 rounded-md px-8"
								href="https://github.com/aluay">
								GitHub
							</a>
						</div>
					</div>
				</section>
				<section className="container flex flex-col p-4 space-y-6 md:max-w-5xl border-r border-l border-dashed">
					<div className="mx-auto flex max-w-6xl flex-col items-center space-y-4 text-center">
						<h2 className="text-3xl md:text-4xl font-semibold">Features</h2>
						<p className="max-w-[85%] text-muted-foreground sm:text-lg">
							I made this project to strengthen my coding skills and to
							experiment with new technology.
						</p>
					</div>
					<div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-5xl md:grid-cols-3 text-left">
						<div className="relative overflow-hidden rounded-lg border bg-background p-2">
							<div className="flex h-[180px] flex-col justify-between rounded-md p-6">
								<svg
									className="w-[48px] h-[48px] text-gray-800 dark:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="currentColor"
									viewBox="0 0 24 24">
									<path d="M12.356 3.066a1 1 0 0 0-.712 0l-7 2.666A1 1 0 0 0 4 6.68a17.695 17.695 0 0 0 2.022 7.98 17.405 17.405 0 0 0 5.403 6.158 1 1 0 0 0 1.15 0 17.406 17.406 0 0 0 5.402-6.157A17.694 17.694 0 0 0 20 6.68a1 1 0 0 0-.644-.949l-7-2.666Z" />
								</svg>

								<div className="space-y-2">
									<h3 className="font-bold">Authentication</h3>
									<p className="text-sm text-muted-foreground">
										Authentication using Google Auth.
									</p>
								</div>
							</div>
						</div>
						<div className="relative overflow-hidden rounded-lg border bg-background p-2">
							<div className="flex h-[180px] flex-col rounded-md p-6 gap-4">
								<svg
									className="w-[48px] h-[48px] text-gray-800 dark:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="currentColor"
									viewBox="0 0 24 24">
									<path
										fillRule="evenodd"
										d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7.414A2 2 0 0 0 20.414 6L18 3.586A2 2 0 0 0 16.586 3H5Zm10 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7V5h8v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1Z"
										clipRule="evenodd"
									/>
								</svg>

								<div className="space-y-2">
									<h3 className="font-bold">Save Applications</h3>
									<p className="text-sm text-muted-foreground">
										Track your applications in one central place.
									</p>
								</div>
							</div>
						</div>
						<div className="relative overflow-hidden rounded-lg border bg-background p-2">
							<div className="flex h-[180px] flex-col rounded-md p-6 gap-4">
								<svg
									className="w-[48px] h-[48px] text-gray-800 dark:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="currentColor"
									viewBox="0 0 24 24">
									<path
										fillRule="evenodd"
										d="M11.906 1.994a8.002 8.002 0 0 1 8.09 8.421 7.996 7.996 0 0 1-1.297 3.957.996.996 0 0 1-.133.204l-.108.129c-.178.243-.37.477-.573.699l-5.112 6.224a1 1 0 0 1-1.545 0L5.982 15.26l-.002-.002a18.146 18.146 0 0 1-.309-.38l-.133-.163a.999.999 0 0 1-.13-.202 7.995 7.995 0 0 1 6.498-12.518ZM15 9.997a3 3 0 1 1-5.999 0 3 3 0 0 1 5.999 0Z"
										clipRule="evenodd"
									/>
								</svg>
								<div className="space-y-2">
									<h3 className="font-bold">Track Progress</h3>
									<p className="text-sm text-muted-foreground">
										Monitor status from submission to interview.
									</p>
								</div>
							</div>
						</div>
						<div className="relative overflow-hidden rounded-lg border bg-background p-2">
							<div className="flex h-[180px] flex-col rounded-md p-6 gap-4">
								<svg
									className="w-[48px] h-[48px] text-gray-800 dark:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="currentColor"
									viewBox="0 0 24 24">
									<path
										fillRule="evenodd"
										d="M10 5a2 2 0 0 0-2 2v3h2.4A7.48 7.48 0 0 0 8 15.5a7.48 7.48 0 0 0 2.4 5.5H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1V7a4 4 0 1 1 8 0v1.15a7.446 7.446 0 0 0-1.943.685A.999.999 0 0 1 12 8.5V7a2 2 0 0 0-2-2Z"
										clipRule="evenodd"
									/>
									<path
										fillRule="evenodd"
										d="M10 15.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0Zm6.5-1.5a1 1 0 1 0-2 0v1.5a1 1 0 0 0 .293.707l1 1a1 1 0 0 0 1.414-1.414l-.707-.707V14Z"
										clipRule="evenodd"
									/>
								</svg>

								<div className="space-y-2">
									<h3 className="font-bold">Follow Deadlines</h3>
									<p className="text-sm text-muted-foreground">
										Watch application timeline & follow up.
									</p>
								</div>
							</div>
						</div>
						<div className="relative overflow-hidden rounded-lg border bg-background p-2">
							<div className="flex h-[180px] flex-col rounded-md p-6 gap-4">
								<svg
									className="w-[48px] h-[48px] text-gray-800 dark:text-white"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									fill="none"
									viewBox="0 0 24 24">
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="1"
										d="M3 15v4m6-6v6m6-4v4m6-6v6M3 11l6-5 6 5 5.5-5.5"
									/>
								</svg>
								<div className="space-y-2">
									<h3 className="font-bold">Visualize Trends</h3>
									<p className="text-sm text-muted-foreground">
										Spot patterns and optimize your strategy.
									</p>
								</div>
							</div>
						</div>
						<div className="relative overflow-hidden rounded-lg border bg-background p-2">
							<div className="flex h-[180px] flex-col rounded-md p-6 gap-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-component h-12 w-12">
									<path d="M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"></path>
									<path d="M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z"></path>
									<path d="M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z"></path>
									<path d="M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"></path>
								</svg>
								<div className="space-y-2">
									<h3 className="font-bold">Intuitive Design</h3>
									<p className="text-sm text-muted-foreground">
										Easy to use UI and features.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
			<footer className="flex items-center flex-col w-full">
				<div className="flex justify-center w-full text-center py-4 md:max-w-5xl border-r border-l border-t border-dashed">
					<span className="text-sm text-muted-foreground">
						Made by Abdullah Luay
					</span>
				</div>
			</footer>
		</div>
	);
}
