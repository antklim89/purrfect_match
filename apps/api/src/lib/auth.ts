import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { account, session, user, verification } from "@/api/auth/schema";
import { db } from "./db";
import { env } from "./env";

export const auth = betterAuth({
	trustedOrigins() {
		return ["http://127.0.0.1:3000"];
	},
	baseURL: env.API_URL,
	secret: env.BETTER_AUTH_SECRET,
	emailAndPassword: {
		enabled: true,
	},
	database: drizzleAdapter(db, {
		provider: "sqlite",
		schema: { user, account, session, verification },
	}),
});
