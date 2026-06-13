import { useEffect } from 'react'
import { serverUrl } from '../config/api'
import axios from 'axios'
import { setCreatorCourseData } from '../redux/courseSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const useCreatorCourseData = () => {
    const dispatch = useDispatch()
    const {userData} = useSelector(state=>state.user)
    
    useEffect(() => {
      if (!userData) {
        dispatch(setCreatorCourseData([]))
        return
      }

      const getCreatorData = async () => {
        try {
          const result = await axios.get(serverUrl + "/api/course/getcreatorcourses" , {withCredentials:true})
          dispatch(setCreatorCourseData(result.data))
        } catch (error) {
          console.log(error)
          const status = error?.response?.status
          const msg = error?.response?.data?.message ?? ''
          const isAuthError = (status === 400 || status === 401) && (msg.includes("doesn't have token") || msg.includes("doesn't have valid token"))
          if (!isAuthError) toast.error(msg || 'Failed to load creator courses')
        }
      }

      getCreatorData()
    }, [dispatch, userData])
}

export default useCreatorCourseData
