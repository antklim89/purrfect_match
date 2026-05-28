import { z } from 'zod/v4-mini';
export declare const AdCreateSchema: z.ZodMiniObject<{
    name: z.ZodMiniString<string>;
    type: z.ZodMiniString<string>;
    price: z.ZodMiniNumber<unknown>;
    description: z.ZodMiniString<string>;
    breed: z.ZodMiniString<string>;
    isPublished: z.ZodMiniOptional<z.ZodMiniBoolean<boolean>>;
    images: z.ZodMiniPipe<z.ZodMiniUnion<readonly [z.ZodMiniFile, z.ZodMiniArray<z.ZodMiniFile>]>, z.ZodMiniTransform<z.core.File[], z.core.File | z.core.File[]>>;
}, z.core.$strip>;
export declare const AdFilterSchema: z.ZodMiniObject<{
    search: z.ZodMiniOptional<z.ZodMiniString<string>>;
    type: z.ZodMiniOptional<z.ZodMiniString<string>>;
    breed: z.ZodMiniOptional<z.ZodMiniString<string>>;
    userId: z.ZodMiniOptional<z.ZodMiniString<string>>;
    page: z.ZodMiniOptional<z.ZodMiniNumber<unknown>>;
    sortBy: z.ZodMiniOptional<z.ZodMiniLiteral<"name" | "createdAt" | "breed" | "type" | "price">>;
    orderBy: z.ZodMiniOptional<z.ZodMiniEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    cursor: z.ZodMiniOptional<z.ZodMiniUnion<readonly [z.ZodMiniString<string>, z.ZodMiniNumber<number>]>>;
    cursorId: z.ZodMiniOptional<z.ZodMiniString<string>>;
    limit: z.ZodMiniOptional<z.ZodMiniNumber<unknown>>;
}, z.core.$strip>;
