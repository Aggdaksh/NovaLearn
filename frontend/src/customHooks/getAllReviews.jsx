import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { serverUrl } from '../config/api'
import { setAllReview } from '../redux/reviewSlice'
import axios from 'axios'

const useAllReviews = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/review/allReview" , {withCredentials:true})
        dispatch(setAllReview(result.data))
      } catch (error) {
        console.log(error)
      }
    }

    fetchAllReviews()
  }, [dispatch])
}

export default useAllReviews
