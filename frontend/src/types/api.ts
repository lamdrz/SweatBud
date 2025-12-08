export interface ApiResponse<T> {
    data: T | null;
    error: Error | null;
    loading: boolean;
    execute: (body?: any) => Promise<void>; // Pour déclencher manuellement (Login/Post)
}

export interface ApiOptions extends RequestInit {
    headers?: HeadersInit;
    autoRun?: boolean; // Pour choisir si on lance la requête tout de suite ou pas
}