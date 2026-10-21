export const genders = ['male', 'female'] as const;
export type GenderType = (typeof genders)[number];
