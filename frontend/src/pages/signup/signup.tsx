import { useState } from "react"
import {Link, Navigate, useNavigate} from 'react-router-dom'
import { IoMdEye, IoMdEyeOff } from "react-icons/io"
import { useAuth } from "../../context/authContext"
import { SignUpApi } from "../../api/auth"
import Swal from 'sweetalert2';

export default function SignUp(){
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [confirmnPassword, setConfirmnPassword] = useState('')
    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const auth = useAuth()
    const navigate = useNavigate()
    const handleShowPassword1 = () => {
        setShowPassword1(!showPassword1)
    }

    const handleShowPassword2 = () => {
        setShowPassword2(!showPassword2)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault()
        if(password !== confirmnPassword){
            Swal.fire({
                title: "ERROR!",
                text: "Las contraseñas no coinciden",
                icon: "error"
            })
        }else{
            try {
                await SignUpApi(user, password)
                Swal.fire({ 
                    title: "Exito!", 
                    text: "Usuario creado exitosamente", 
                    icon: "success" 
                })
                navigate('/');
            } catch (error: any) {
                if (error.message === "USER_EXISTS") {
                    Swal.fire({ 
                        title: "ERROR!", 
                        text: "El usuario ya existe", 
                        icon: "error" 
                    })
                } else {
                    console.error(error)
                }
            }
        }        
    }

    if(auth.isAuthenticated){
        return <Navigate to='/main' />
    }
    return <>
        <form onSubmit={handleSubmit} className="boxs">
            <div className="title-register">
                <h1>REGISTRO DE <label className='colorfont'>USUARIO</label></h1>
            </div>
            <div className='user-input-box'>
                <input className='user-inputs' type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder='Ingrese su nombre de usuario' required/>
            </div>
            <div className='passwords-input-box'>
                <input className='passwords-inputs' type={showPassword1 ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Ingrese su contraseña' required/>
                { showPassword1 ? (
                        <IoMdEyeOff onClick={handleShowPassword1} className='icon-password-eye'/>
                    ) : (
                        <IoMdEye onClick={handleShowPassword1} className='icon-password-eye'/>
                    )   
                }            </div>
            <div className='passwords-confirmn-input-box'>
                <input className='passwords-inputs passwords-confirmn-input' type={showPassword2 ? "text" : "password"} value={confirmnPassword} onChange={(e) => setConfirmnPassword(e.target.value)} placeholder='Confirme su contraseña' required/>
                { showPassword2 ? (
                        <IoMdEyeOff onClick={handleShowPassword2} className='icon-password-eye'/>
                    ) : (
                        <IoMdEye onClick={handleShowPassword2} className='icon-password-eye'/>
                    )   
                }             </div>
            <div>
                <button className='signup-button'>Registrar</button>
            </div>
            <div className='more-info-boxs'>
                <p className='text-paragraphs'>Volver al <Link to='/' className='colorfont label-routers'>inicio de sesión</Link></p>
            </div>
        </form>
    </>
}