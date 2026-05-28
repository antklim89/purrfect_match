import type { User } from 'better-auth';
import type { AdCreateType, AdFilterType, AdSelectType } from './types';
export declare function adCreateService({ userId, input }: {
    userId: User['id'];
    input: AdCreateType;
}): Promise<import("@purrfect_match/shared/lib/result").Err<"unexpected", import("@purrfect_match/shared/lib/result").Issues> | import("@purrfect_match/shared/lib/result").Ok<{
    id: string;
}>>;
export declare function adFindManyService({ breed, search, type, userId, page, sortBy, orderBy, cursorId, cursor, limit, }: AdFilterType, authorId?: string): Promise<import("@purrfect_match/shared/lib/result").Ok<{
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
            createdAt: Date;
            updatedAt: Date;
        };
    }[];
    readonly nextCursor: {
        readonly cursorId: string;
        readonly cursor: string | number;
    };
}> | import("@purrfect_match/shared/lib/result").Ok<{
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
            createdAt: Date;
            updatedAt: Date;
        };
    }[];
    readonly nextCursor: null;
}>>;
export declare function adFindOneService({ id }: {
    id: AdSelectType['id'];
}): Promise<import("@purrfect_match/shared/lib/result").Err<"not_found", import("@purrfect_match/shared/lib/result").Issues> | import("@purrfect_match/shared/lib/result").Ok<{
    id: string;
    name: string;
    createdAt: string;
    userId: string;
    description: string;
    isPublished: boolean | null;
    breed: string;
    type: string;
    price: number;
}>>;
export declare function adDeleteService({ userId, id }: {
    userId: User['id'];
    id: AdSelectType['id'];
}): Promise<import("@purrfect_match/shared/lib/result").Ok<null>>;
export declare function adPublishService({ userId, id }: {
    userId: User['id'];
    id: AdSelectType['id'];
}): Promise<import("@purrfect_match/shared/lib/result").Err<"not_found", import("@purrfect_match/shared/lib/result").Issues> | import("@purrfect_match/shared/lib/result").Ok<{
    id: string;
    isPublished: boolean | null;
}>>;
