export declare const adRoute: import("hono/hono-base").HonoBase<import("hono/types").BlankEnv, {
    "/": {
        $get: {
            input: {
                query: {
                    search?: string | undefined;
                    type?: string | undefined;
                    breed?: string | undefined;
                    userId?: string | undefined;
                    page?: string | string[] | undefined;
                    sortBy?: "name" | "createdAt" | "breed" | "type" | "price" | undefined;
                    orderBy?: "asc" | "desc" | undefined;
                    cursor?: string | number | undefined;
                    cursorId?: string | undefined;
                    limit?: string | string[] | undefined;
                };
            };
            output: {
                error: {
                    type: "validation";
                    message: string;
                    original?: import("hono/utils/types").JSONValue | undefined;
                    issues?: {
                        [x: string]: string | string[];
                    } | undefined;
                };
                result?: null | undefined;
            };
            outputFormat: "json";
            status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
        } | {
            input: {
                query: {
                    search?: string | undefined;
                    type?: string | undefined;
                    breed?: string | undefined;
                    userId?: string | undefined;
                    page?: string | string[] | undefined;
                    sortBy?: "name" | "createdAt" | "breed" | "type" | "price" | undefined;
                    orderBy?: "asc" | "desc" | undefined;
                    cursor?: string | number | undefined;
                    cursorId?: string | undefined;
                    limit?: string | string[] | undefined;
                };
            };
            output: {
                result: {
                    readonly data: {
                        id: string;
                        name: string;
                        createdAt: string;
                        userId: string;
                        description: string;
                        isPublished: boolean | null;
                        breed: string;
                        type: string;
                        price: number;
                        user: {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            image: string | null;
                            createdAt: string;
                            updatedAt: string;
                        };
                    }[];
                    readonly nextCursor: {
                        readonly cursorId: string;
                        readonly cursor: string | number;
                    };
                };
                error?: null | undefined;
            } | {
                result: {
                    readonly data: {
                        id: string;
                        name: string;
                        createdAt: string;
                        userId: string;
                        description: string;
                        isPublished: boolean | null;
                        breed: string;
                        type: string;
                        price: number;
                        user: {
                            id: string;
                            name: string;
                            email: string;
                            emailVerified: boolean;
                            image: string | null;
                            createdAt: string;
                            updatedAt: string;
                        };
                    }[];
                    readonly nextCursor: null;
                };
                error?: null | undefined;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/:id": {
        $get: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: {
                    type: "validation";
                    message: string;
                    original?: import("hono/utils/types").JSONValue | undefined;
                    issues?: {
                        [x: string]: string | string[];
                    } | undefined;
                };
                result?: null | undefined;
            };
            outputFormat: "json";
            status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: {
                    type: "not_found";
                    message: string;
                    original?: import("hono/utils/types").JSONValue | undefined;
                    issues?: {
                        [x: string]: string | string[];
                    } | undefined;
                };
                result?: null | undefined;
            } | {
                result: {
                    id: string;
                    name: string;
                    createdAt: string;
                    userId: string;
                    description: string;
                    isPublished: boolean | null;
                    breed: string;
                    type: string;
                    price: number;
                };
                error?: null | undefined;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                form: {
                    name: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    type: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    price: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    description: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    breed: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    images: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    isPublished?: boolean | undefined;
                };
            };
            output: {
                error: {
                    type: "validation";
                    message: string;
                    original?: import("hono/utils/types").JSONValue | undefined;
                    issues?: {
                        [x: string]: string | string[];
                    } | undefined;
                };
                result?: null | undefined;
            };
            outputFormat: "json";
            status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
        } | {
            input: {
                form: {
                    name: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    type: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    price: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    description: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    breed: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    images: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    isPublished?: boolean | undefined;
                };
            };
            output: import("@purrfect_match/shared/lib/result").Err<"authentication", import("@purrfect_match/shared/lib/result").Issues>;
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                form: {
                    name: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    type: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    price: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    description: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    breed: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    images: import("hono/types").ParsedFormValue | import("hono/types").ParsedFormValue[];
                    isPublished?: boolean | undefined;
                };
            };
            output: {
                error: {
                    type: "unexpected";
                    message: string;
                    original?: import("hono/utils/types").JSONValue | undefined;
                    issues?: {
                        [x: string]: string | string[];
                    } | undefined;
                };
                result?: null | undefined;
            } | {
                result: {
                    id: string;
                };
                error?: null | undefined;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/:id": {
        $delete: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: {
                    type: "validation";
                    message: string;
                    original?: import("hono/utils/types").JSONValue | undefined;
                    issues?: {
                        [x: string]: string | string[];
                    } | undefined;
                };
                result?: null | undefined;
            };
            outputFormat: "json";
            status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: import("@purrfect_match/shared/lib/result").Err<"authentication", import("@purrfect_match/shared/lib/result").Issues>;
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                result: null;
                error?: null | undefined;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
} & {
    "/:id/publish": {
        $patch: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: {
                    type: "validation";
                    message: string;
                    original?: import("hono/utils/types").JSONValue | undefined;
                    issues?: {
                        [x: string]: string | string[];
                    } | undefined;
                };
                result?: null | undefined;
            };
            outputFormat: "json";
            status: 100 | 102 | 103 | 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 305 | 306 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | -1;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: import("@purrfect_match/shared/lib/result").Err<"authentication", import("@purrfect_match/shared/lib/result").Issues>;
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                error: {
                    type: "not_found";
                    message: string;
                    original?: import("hono/utils/types").JSONValue | undefined;
                    issues?: {
                        [x: string]: string | string[];
                    } | undefined;
                };
                result?: null | undefined;
            } | {
                result: {
                    id: string;
                    isPublished: boolean | null;
                };
                error?: null | undefined;
            };
            outputFormat: "json";
            status: import("hono/utils/http-status").ContentfulStatusCode;
        };
    };
}, "/", "/:id/publish">;
