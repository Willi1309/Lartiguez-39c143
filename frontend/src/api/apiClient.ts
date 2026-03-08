import { URL } from "../../URL";

export const fetchWithToken = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('accessToken');
    console.log("Token enviado en la petición:", token);
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${URL}${endpoint}`, { ...options, headers });

    if (response.status === 401) {
        throw new Error("UNAUTHORIZED");
    }
    return response;
};