import axios from 'axios';
import { serverUrl } from '../config/api';
import { useDispatch } from 'react-redux';
import { setCourseData, setCourseError, setCourseLoading, setHasFetchedCourses } from '../redux/courseSlice.js';
import { useEffect } from 'react';

const useCourseData = () => {
  const dispatch = useDispatch()

  useEffect(()=>{
    const fetchPublishedCourses = async () => {
      dispatch(setCourseLoading(true))
      dispatch(setCourseError(""))
      try {
        const result = await axios.get(serverUrl + "/api/course/getpublishedcoures" , {withCredentials:true})
        dispatch(setCourseData(result.data))
      } catch (error) {
        console.log(error)
        dispatch(setCourseError(error?.response?.data?.message || "Failed to load courses"))
      } finally {
        dispatch(setCourseLoading(false))
        dispatch(setHasFetchedCourses(true))
      }
    }

    fetchPublishedCourses()
  }, [dispatch])
}

export default useCourseData


