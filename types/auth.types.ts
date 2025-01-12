export type LoginInput = {
    email: string;
    password: string;
};
export type LoginResponse = {
    access: string;
    refresh: string;
};
export type RefreshResponse = {
    access: string;
};