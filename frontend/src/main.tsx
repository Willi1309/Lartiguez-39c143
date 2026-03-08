import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Login from './pages/login/login.tsx'
import AuthProvider from './context/authContext.tsx'
import SignUp from './pages/signup/signup.tsx'
import Main from './pages/main/main.tsx'
import ProtectedRoute from './pages/ProtectedRoute.tsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/signup",
        element: <SignUp />
    },
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [{
            path: "/main",
            element: <Main/>
        }]
    }
])

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
)