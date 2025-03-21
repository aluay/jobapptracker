import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
// import { Button } from "@/components/ui/button";
export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<div
			variant="ghost"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className="cursor-pointer">
			{theme === "dark" ? (
				<Sun className="h-5 w-5" />
			) : (
				// <p>Light Mode</p>
				// <Sun className="h-5 w-5" />
				<Moon className="h-5 w-5" />
			)}
		</div>
	);
}
