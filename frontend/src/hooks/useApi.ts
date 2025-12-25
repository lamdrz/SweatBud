import { useState, useEffect, useCallback } from "react";
import useAuth from "./useAuth";
import { useRefreshToken } from "./useRefreshToken";
import type { ApiOptions, ApiResponse } from "../types/api";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function useApi<T>(endpoint: string, options: ApiOptions = {}): ApiResponse<T> {
    const { auth } = useAuth();
    const refresh = useRefreshToken();
    
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(options.autoRun ?? true);

    // Fonction principale qui fait l'appel
    const execute = useCallback(async (bodyData?: Record<string, unknown>) => {
        setLoading(true);
        setError(null);

        // 1. Préparation des headers et du body
        const currentToken = auth?.accessToken;
        const headers = new Headers(options.headers);
        
        if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }
        if (currentToken) {
            headers.set("Authorization", `Bearer ${currentToken}`);
        }

        const config: RequestInit = {
            ...options,
            headers,
            body: bodyData ? JSON.stringify(bodyData) : options.body,
        };

        try {
            // 2. Premier appel
            let response = await fetch(`${BASE_URL}${endpoint}`, config);

            // 3. Gestion spécifique du 401 (Token expiré)
            if (response.status === 401) {
                try {
                    // On tente de refresh le token
                    const newToken = await refresh();
                    
                    // On met à jour le header et on retente
                    headers.set("Authorization", `Bearer ${newToken}`);
                    config.headers = headers;
                    
                    response = await fetch(`${BASE_URL}${endpoint}`, config);
                } catch {
                    throw new Error("Session expirée, veuillez vous reconnecter.");
                }
            }

            if (!response.ok) {
                let errorMessage = `Erreur HTTP: ${response.status}`;
                try {
                    const errorBody = await response.json();
                    if (errorBody.message) errorMessage = errorBody.message;
                } catch { /* empty */ }
                throw new Error(errorMessage);
            }

            const jsonData = await response.json();
            setData(jsonData);
            return jsonData;

        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("Une erreur inconnue est survenue");
            setError(errorObj);
            throw errorObj;
        } finally {
            setLoading(false);
        }
    }, [auth?.accessToken, endpoint, options, refresh]);

    // 4. Effet pour le lancement automatique (style "useFetch")
    useEffect(() => {
        if (options.autoRun !== false) { // Par défaut true
            execute();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    return { loading, data, error, execute };
}