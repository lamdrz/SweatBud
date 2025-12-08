export interface User {
    id: string;
    username: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface AuthState {
    accessToken?: string;
    user?: User;
}

export interface RegisterPayload {
    username: string;
    password: string;
}