import { useState } from "react"
import { IoMdEye, IoMdEyeOff  } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { LogInApi } from "../../api/auth";
import { useAuth } from '../../context/authContext';
import './login.css'

export default function Login(){
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();
    const auth = useAuth();

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault()
        try{
            LogInApi(user, password, navigate, auth)
                .catch(error => console.error(error))
        }catch(error){
            console.error(error)
        }
    }

    return <>
        <form onSubmit={handleSubmit} className="boxs">
            <div className="title-signin">
                <h1>INICIO DE <label className='colorfont'>SESION</label></h1>
            </div>
            <div className='user-inputs-boxs'>
                <input className='user-inputs' type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder='Ingrese su nombre de usuario' required/>
            </div>
            <div className='passwords-input-box'>
                <input className='passwords-inputs' type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Ingrese su contraseña' required/>
                { showPassword ? (
                        <IoMdEyeOff onClick={handleShowPassword} className='icon-password-eye'/>
                    ) : (
                        <IoMdEye onClick={handleShowPassword} className='icon-password-eye'/>
                    )   
                }
            </div>
            <div>
                <button className='login-button'>Iniciar Sesión</button>
            </div>
            <div className='more-info-boxs'>
                <p className='text-paragraphs'>¿No estas registrado? <Link to='/signup' className='colorfont label-routers'>Has click aqui</Link></p>
            </div>
        </form>    
    </>
}