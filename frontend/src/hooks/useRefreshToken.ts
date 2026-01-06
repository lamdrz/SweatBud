import useAuth from './useAuth';
import { API_URL } from "../utils/apiConfig";

export const useRefreshToken = () => {
    const { setAuth } = useAuth();

    return async (): Promise<string> => {
        const res = await fetch(API_URL + '/auth/refresh', { 
            method: 'POST',
            credentials: 'include' 
        });
        if (!res.ok) {
            throw new Error("Refresh failed");
        }
        
        const data = await res.json();
        setAuth(prev => ({ ...prev, user: data.user, accessToken: data.accessToken }));
        return data.accessToken;
    };
};