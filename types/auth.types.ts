export type LoginInput = {
    email: string;
    password: string;
};
export type LoginResponse = {
    access: string;
    refresh: string;
    requires_2fa: boolean;
    temp_token: string;
};
export type RefreshResponse = {
    access: string;
};