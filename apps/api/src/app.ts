import "./lib/env";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { authRoutes } from "@/api/auth/route";
import { env } from "@/api/lib/env";

const app = new Hono()
	.basePath("api")
	.use(
		"*",
		cors({
			origin: env.WEB_URL,
			credentials: true,
			allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		}),
	)
	.route("auth", authRoutes)
	.get("/", async (c) => c.json({ message: "ok" }));

export default app;
export type AppType = typeof app;
