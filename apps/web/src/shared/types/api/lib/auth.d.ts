export declare const auth: import("better-auth").Auth<{
    experimental: {
        joins: true;
    };
    trustedOrigins(): string[];
    baseURL: string;
    secret: string;
    emailAndPassword: {
        enabled: true;
    };
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    plugins: [{
        id: "test-utils";
        version: string;
        init(ctx: import("better-auth").AuthContext): {
            context: {
                test: import("better-auth/plugins").TestHelpers;
            };
            options: {
                databaseHooks: {
                    verification: {
                        create: {
                            after(verification: {
                                identifier: string;
                                value: string;
                            } | null): Promise<void>;
                        };
                    };
                };
            } | undefined;
        };
        options: import("better-auth/plugins").TestUtilsOptions;
    }];
}>;
