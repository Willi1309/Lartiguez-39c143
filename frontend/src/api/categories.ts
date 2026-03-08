import { URL } from "../../URL";

export const getCategoriesApi = async (token: string) =>{
    try{
        const response = await fetch(`${URL}/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`        
            }
        })
        if (!response.ok) {
            throw new Error("SERVER_ERROR")
        }
        return response.json()
    }catch(error){
        throw error
    }  
}

export const createCategoryApi = async (token: string, categoryName: string) =>{
    try{
        const response = await fetch(`${URL}/categories/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ category: categoryName })
        })
        if (response.status === 405) {
            throw new Error("CATEGORY_EXISTS")
        }

        if (!response.ok) {
            throw new Error("SERVER_ERROR")
        }

        return true;
    }catch(error){
        throw error
    }      
}

export const deleteCategoryApi = async (token: string, categoryName: string) => {
    try{
        const response = await fetch(`${URL}/categories/${categoryName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.ok) return true;

        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || "SERVER_ERROR");
        
        (error as any).status = response.status; 
        throw error;
    }catch(error){
        throw error
    }  
}