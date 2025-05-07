export const ProviderEnum = {
    GOOGLE: 'GOOGLE',
    GITHUB: 'GITHUB',
    EMAIL: 'EMail',
};

export type ProviderEnumType = keyof typeof ProviderEnum;