"use client";

import React, { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children, ...props }) {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	if (!isLoaded) {
		return null; // Prevents hydration mismatch
	}

	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// The code below causes hydration error due to ssr/client mismatch
// Comment #5552 in the link below fixes the issue
// https://github.com/shadcn-ui/ui/issues/5552#issuecomment-2437836976

// "use client";

// import { ThemeProvider as NextThemesProvider } from "next-themes";

// export function ThemeProvider({ children, ...props }) {
// 	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
// }
