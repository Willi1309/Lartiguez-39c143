import { URL } from "../../URL"
import type { Note } from "../../types"

export const getNotesApi = async (token: string) =>{
    try{
        const response = await fetch(`${URL}/notes`, {
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

export const createNoteApi = async (token: string, Note: Note) =>{
    try{
        const response = await fetch(`${URL}/notes/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(Note)
        })
        if (!response.ok) {
            throw new Error("SERVER_ERROR")
        }

        return await response.json()
    }catch(error){
        throw error
    }      
}

export const editNoteApi = async (token: string, note: Note) => {
    try{
        const response = await fetch(`${URL}/notes/${note.id_note}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(note)
        })
        if (!response.ok) {
            throw new Error("SERVER_ERROR")
        }

        return true;
    }catch(error){
        throw error
    } 
}

export const deleteNoteApi = async (id_note: number, token: string) => {
    try{
        const response = await fetch(`${URL}/notes/${id_note}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) {
            throw new Error("SERVER_ERROR")
        }

        return true;
    }catch(error){
        throw error
    }   
}

export const archiveNoteApi = async (id_note: number, archived: boolean, token: string)=>{
    try{
        const response = await fetch(`${URL}/notes/update-archive/${id_note}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ archived: archived })
        })

        if (!response.ok) {
            throw new Error("SERVER_ERROR")
        }

        return true;
    }catch(error){
        throw error
    }  
}