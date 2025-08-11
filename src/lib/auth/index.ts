import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { compare } from "bcrypt";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users } from "@/lib/db/schema";
import { DrizzleAdapter } from "@/lib/auth/drizzle-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(), // Pass database instance
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          const error = new Error("Email and password required");
          error.message = "Email and password required";
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));

        if (!user.length || !user[0].password) {
          const error = new Error("No user found with this email");
          error.message = "No user found with this email";
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user[0].password
        );

        if (!isPasswordValid) {
          const error = new Error("Incorrect password");
          error.message = "Incorrect password";
          return null;
        }

        return user[0];
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  trustHost: true,
  pages: {
    signIn: "/auth/signin",
    signOut: "/",
    error: "/auth/signin",
    newUser: "/auth/complete-profile",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email || null;
        token.name = user.name || null;
        token.role = user.role || "customer";
        token.phoneNumber = user.phoneNumber;
        token.phoneNumberVerified = user.phoneNumberVerified;
      }
      // If token exists but doesn't have role, fetch from database
      if (token.email && !token.role) {
        const dbUser = await db
          .select({
            role: users.role,
            phoneNumber: users.phoneNumber,
            phoneNumberVerified: users.phoneNumberVerified,
          })
          .from(users)
          .where(eq(users.email, token.email))
          .limit(1);

        if (dbUser.length > 0 && dbUser[0].role) {
          token.role = dbUser[0].role;
          token.phoneNumber = dbUser[0].phoneNumber;
          token.phoneNumberVerified = dbUser[0].phoneNumberVerified;
        }
      }

      // Handle session updates (if you need to update role dynamically)
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.phoneNumber=token.phoneNumber;
        session.user.phoneNumberVerified=token.phoneNumberVerified
      }
      return session;
    },
  },
  debug: false,
  secret: process.env.NEXTAUTH_SECRET,
});
