import { Navigate, Outlet } from "react-router-dom"
import { useAuthStatus } from "../hooks/useAuthStatus"
import Loader from "./Loader"


const PrivateRoute = () => {
    const { loggedIn, checkingStatus } = useAuthStatus();

    if (checkingStatus) {
        return <div style={{height:"100vh", display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Loader/>
        </div>
    }

    return loggedIn ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute