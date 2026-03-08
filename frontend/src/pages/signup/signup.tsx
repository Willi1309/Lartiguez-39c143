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
                text: "The passwords do not match",
                icon: "error"
            })
        }else{
            try {
                await SignUpApi(user, password)
                Swal.fire({ 
                    title: "Exito!", 
                    text: "User created succesfully!", 
                    icon: "success" 
                })
                navigate('/');
            } catch (error: any) {
                if (error.message === "USER_EXISTS") {
                    Swal.fire({ 
                        title: "ERROR!", 
                        text: "User is already exist", 
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
                <h1>SIGN<label className='colorfont'>UP</label></h1>
            </div>
            <div className='user-input-box'>
                <input className='user-inputs' type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder='Enter your username' required/>
            </div>
            <div className='passwords-input-box'>
                <input className='passwords-inputs' type={showPassword1 ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password' required/>
                { showPassword1 ? (
                        <IoMdEyeOff onClick={handleShowPassword1} className='icon-password-eye'/>
                    ) : (
                        <IoMdEye onClick={handleShowPassword1} className='icon-password-eye'/>
                    )   
                }            </div>
            <div className='passwords-confirmn-input-box'>
                <input className='passwords-inputs passwords-confirmn-input' type={showPassword2 ? "text" : "password"} value={confirmnPassword} onChange={(e) => setConfirmnPassword(e.target.value)} placeholder='Confirm your password' required/>
                { showPassword2 ? (
                        <IoMdEyeOff onClick={handleShowPassword2} className='icon-password-eye'/>
                    ) : (
                        <IoMdEye onClick={handleShowPassword2} className='icon-password-eye'/>
                    )   
                }             </div>
            <div>
                <button className='signup-button'>Register</button>
            </div>
            <div className='more-info-boxs'>
                <p className='text-paragraphs'>Return to<Link to='/' className='colorfont label-routers'>login</Link></p>
            </div>
        </form>
    </>
}