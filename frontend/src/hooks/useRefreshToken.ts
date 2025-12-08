import useAuth from './useAuth';

export const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const API_URL = import.meta.env.VITE_API_URL;

    return async (): Promise<string> => {
        const res = await fetch(API_URL + '/auth/refresh', { 
            method: 'POST',
            credentials: 'include' 
        });
        if (!res.ok) {
            throw new Error("Refresh failed");
        }
        
        const data = await res.json();
        setAuth((prev: any) => ({ ...prev, accessToken: data.accessToken }));
        return data.accessToken;
    };
};