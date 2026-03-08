import {URL} from '../URL.ts'
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router-dom'
import { useAuth } from '../context/authContext.tsx'
import type { AuthResponse } from '../../types.ts';

export const LogInApi = async(user: string, password: string, navigate: ReturnType<typeof useNavigate>, auth: ReturnType<typeof useAuth>) => {
    try{
        console.log("URL de API:", import.meta.env.VITE_API_URL);
        const response = await fetch(`${URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'            
            },
            body: JSON.stringify({
                user, 
                password
            })
        })
        if(response.ok){
            const json = (await response.json()) as AuthResponse
            if(json.body.accessToken && json.body.refreshToken){
                auth.saveUser(json)
                navigate('/main')
            }
        }else if(response.status === 400){
            Swal.fire({
                title: "ERROR!",
                text: "User or password wrong",
            icon: "error"
            })
        }else{
            console.log('Something went wrong')
        }  
    }catch(error){
        throw error
    }
}

export const SignUpApi = async (user: string, password: string) =>{
    try{
        const response = await fetch(`${URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user,
                password
            })
        })
        if (response.status === 405) {
            throw new Error("USER_EXISTS")
        }

        if (!response.ok) {
            throw new Error("SERVER_ERROR")
        }

        return true;
    }catch(error){
        throw error
    }      
}

export const SignOutApi = async (refreshToken: string) =>{
    try{
        const response = await fetch(`${URL}/auth/signout`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${refreshToken}`
            }
        })
        if (!response.ok) {
            throw new Error("Error logging out of server")
        }
        if(response.ok){
            Swal.fire({
                icon: "success",
                title: "Session closed succesfully",
                showConfirmButton: false,
                timer: 1500
            })
            return true
        }  
    }catch(error){
        throw error
    }
      
}