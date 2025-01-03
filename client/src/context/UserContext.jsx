import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const userContent = createContext()

export const UserContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [loggedIn, setLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false)

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        backendUrl,
        loggedIn, setLoggedIn,
        userData, setUserData,
        getUserData,
    }

    return (
        <userContent.Provider value={value}>
            {props.children}
        </userContent.Provider>
    )
}