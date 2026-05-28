import './lib/env';
export declare const app: import("hono/hono-base").HonoBase<{}, {
    api: {
        $get: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} | import("hono/types").MergeSchemaPath<import("hono").Schema, "api/ad"> | import("hono/types").MergeSchemaPath<import("hono").Schema, "api/auth">, "api", "api">;
export default app;
export type AppType = typeof app;
