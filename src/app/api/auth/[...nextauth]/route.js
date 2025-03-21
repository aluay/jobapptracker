import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/app/db";

/**
 * Extracts first and last name from Google OAuth profile.
 * @param {string} fullName - The full name returned by Google OAuth.
 * @returns {Object} An object containing `firstName` and `lastName`.
 */
function splitFullName(fullName) {
	if (!fullName) return { firstName: "", lastName: "" };

	const nameParts = fullName.trim().split(" ");
	const firstName = nameParts[0] || "";
	const lastName = nameParts.slice(1).join(" ") || ""; // Handles multi-word last names

	return { firstName, lastName };
}

/**
 * NextAuth configuration for authentication.
 * - Uses Google OAuth for login.
 * - Stores user sessions in Prisma (PostgreSQL).
 * - Protects API routes using session authentication.
 */
export const authOptions = {
	// Configure the authentication provider (Google)
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: { state: true },
			},
			/**
			 * Custom profile function to extract structured user data.
			 * - Extracts first and last name separately.
			 */
			profile(profile) {
				const { firstName, lastName } = splitFullName(profile.name);
				return {
					id: profile.sub, // Google unique user ID
					firstName, // Extracted first name
					lastName, // Extracted last name
					email: profile.email, // User email
					image: profile.picture, // Profile picture
				};
			},
		}),
	],

	// Adapter to store users in Prisma
	adapter: PrismaAdapter(prisma),

	// Enable session-based authentication
	session: {
		strategy: "jwt", // Uses JWT instead of database sessions
	},

	// Security options
	secret: process.env.NEXTAUTH_SECRET,

	// Redirect user to dashboard after successful login
	pages: {
		signIn: "/", // Default sign-in page
		newUser: "/dashboard", // Redirect new users to dashboard
	},

	// Callbacks to ensure proper token & session structure
	callbacks: {
		/**
		 * JWT Callback - Runs when a token is created or updated.
		 * - Stores firstName and lastName in JWT token.
		 */
		async jwt({ token, account, user }) {
			if (account && user) {
				token.id = user.id;
				token.firstName = user.firstName;
				token.lastName = user.lastName;
				token.email = user.email;
				token.image = user.image;
			}
			return token;
		},

		/**
		 * Session Callback - Runs when a session is created or accessed.
		 * - Ensures session contains first and last name.
		 */
		async session({ session, token }) {
			if (token?.id) {
				session.user.id = token.id;
				session.user.firstName = token.firstName;
				session.user.lastName = token.lastName;
				session.user.email = token.email;
				session.user.image = token.image;
			}
			return session;
		},

		/**
		 * Redirect Callback - Ensures users always get redirected to the dashboard.
		 */
		async redirect({ url, baseUrl }) {
			return "/dashboard"; // Force redirect to dashboard
		},
	},

	// Enable debug mode in development
	debug: process.env.NODE_ENV === "development",
};

// Create and export the NextAuth handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
