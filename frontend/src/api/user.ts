import {URL} from '../../URL.ts'

export const getUserApi = async (accessToken: string)=> {
    const response = await fetch(`${URL}/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        }
    })
    if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo obtener el usuario`)
    }

    return await response.json();
}