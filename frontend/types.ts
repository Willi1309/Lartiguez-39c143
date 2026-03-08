export interface User {
    _id_user: number;
    user: string;
}

export interface AuthResponse {
    body: {
        user: User;
        accessToken: string;
        refreshToken: string;
    }
}

export interface AuthProviderProps {
    children: React.ReactNode
}

export interface Categories {
    category: string
}

export interface Note{
    id_note: number,
    title: string,
    body: string,
    category: string,
    archived?: boolean;
}