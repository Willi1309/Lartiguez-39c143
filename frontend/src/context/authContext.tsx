import { useContext, createContext, useState, useEffect } from "react";
import { getUserApi } from "../api/user.ts";
import { postRefreshToken } from '../api/tokens.ts'
import type {AuthResponse, User, AuthProviderProps} from '../../types.ts'

const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => "" as string,
    saveUser: (_userData: AuthResponse) =>{},
    getRefreshToken: () => null as string | null,
    getUser: ()=>({} as User | undefined),
    signOut: ()=>{},
})

export default function AuthProvider({children}: AuthProviderProps){
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [accessToken, setAccessToken] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<User>()
    useEffect(()=>{
        checkAuth().finally(() => setIsLoading(false))
    }, [])

    async function requestNewAccessToken(refreshToken: string){
        try {
            const response = await postRefreshToken(refreshToken);
            return response.accessToken;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function getUserInfo(accessToken: string){
        try {
            const userInfo = await getUserApi(accessToken)
            return userInfo
        } catch (error) {
            console.error(error)
            return null
        }
    }

    async function checkAuth() {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('token');

        if (storedAccessToken) {
            const userData = await getUserInfo(storedAccessToken);
            if (userData) {
                setUser(userData)
                setAccessToken(storedAccessToken);
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem('accessToken');
            }
        }else if (storedRefreshToken) {
            try {
                const token = JSON.parse(storedRefreshToken);
                const newAccessToken = await requestNewAccessToken(token)
                if (newAccessToken) {
                    setAccessToken(newAccessToken)
                    localStorage.setItem('accessToken', newAccessToken)
                    setIsAuthenticated(true)
                }
            } catch (e) {
                console.error("The session could not be renewed", e)
            }
        }
    }

    function signOut() {
        setIsAuthenticated(false)
        setAccessToken('')
        setUser(undefined)
        localStorage.removeItem('token')
        localStorage.removeItem('accessToken')
        window.location.href = '/'
    }

    function saveSessionInfo(userInfo: User, accessToken: string, refreshToken: string){
        setUser(userInfo);
        setAccessToken(accessToken);
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('token', JSON.stringify(refreshToken))
        
        setIsAuthenticated(true);
    }

    function getAccessToken(): string{
        return accessToken
    }


    function getRefreshToken(): string | null {
        const tokenGetted = localStorage.getItem('token')
        if(tokenGetted){
            const token = JSON.parse(tokenGetted)
            return token
        }
        return null
    }

    function saveUser(userData: AuthResponse ){
        const userInfo = userData.body.user
        saveSessionInfo(
            userInfo,
            userData.body.accessToken,
            userData.body.refreshToken
        );
    }
    
    function getUser(){
        return user
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, getAccessToken, saveUser, getRefreshToken, getUser, signOut }}>
            {!isLoading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)