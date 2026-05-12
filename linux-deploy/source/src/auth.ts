import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            async authorize(credentials) {
                try {
                    console.log("Authorize called with:", credentials?.email);

                    const parsedCredentials = z
                        .object({ email: z.string().email(), password: z.string().min(6) })
                        .safeParse(credentials);

                    if (parsedCredentials.success) {
                        const { email, password } = parsedCredentials.data;
                        console.log("Searching for user:", email);

                        const user = await prisma.user.findUnique({ where: { email } });
                        console.log("User found:", user ? "YES" : "NO", user?.id);

                        if (!user) {
                            console.log("User not found in DB.");
                            return null;
                        }

                        // Check if password exists (it might be null if created via OAuth in future, but here we expect it)
                        if (!user.password) {
                            console.log("User has no password set.");
                            return null;
                        }

                        console.log("Comparing passwords...");
                        const passwordsMatch = await bcrypt.compare(password, user.password);
                        console.log("Password match:", passwordsMatch);

                        if (passwordsMatch) return user;
                    } else {
                        console.log("Zod validation failed:", parsedCredentials.error);
                    }

                    console.log("Invalid credentials");
                    return null;
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
});
