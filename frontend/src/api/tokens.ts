import {URL} from '../../URL.ts'

export const postRefreshToken = async (refreshToken: string) => {
    const response = await fetch(`${URL}/auth/refreshToken`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`,
        }
    })
    
    if (!response.ok) {
        throw new Error(response.statusText)
    }

    return await response.json();
}