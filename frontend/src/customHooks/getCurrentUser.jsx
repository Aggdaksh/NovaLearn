import { useEffect } from "react"
import { serverUrl } from "../config/api"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setUserData, setAuthLoading } from "../redux/userSlice"

const useCurrentUser = ()=>{
    let dispatch = useDispatch()

    useEffect(()=>{
        const fetchUser = async () => {
            try {
                let result = await axios.get(serverUrl + "/api/user/currentuser" , {withCredentials:true})
                dispatch(setUserData(result.data))
            } catch (error) {
                const status = error?.response?.status
                if (status === 400 || status === 401) {
                    dispatch(setUserData(null))
                } else {
                    console.error('Unexpected error fetching current user:', error)
                    dispatch(setUserData(null))
                }
            } finally {
                dispatch(setAuthLoading(false))
            }
        }
        fetchUser()
    },[dispatch])
}

export default useCurrentUser
