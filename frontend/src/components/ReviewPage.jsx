import React, { useEffect, useState } from 'react'
import ReviewCard from './ReviewCard'
import { useSelector } from 'react-redux';


function ReviewPage() {
  const [latestReview,setLatestReview] =useState([]);
  const {allReview} = useSelector(state=>state.review)
  
  useEffect(()=>{
    setLatestReview(allReview.slice(0,6));
    },[allReview])
  return (
     <div className='flex items-center justify-center flex-col px-[16px] py-[40px]'>
      <h1 className='md:text-[45px] text-[30px] font-semibold text-center mt-[30px] px-[20px]'>Real Reviews from Real Learners</h1>
      <span className='lg:w-[50%] md:w-[80%] text-[15px] leading-7 text-center mt-[30px] mb-[30px] px-[20px]'>Discover how NovaLearn is transforming learning experiences through real feedback from students and professionals worldwide.</span>
    <div className='w-full max-w-7xl flex items-start justify-center flex-wrap gap-[32px] lg:px-[40px] md:px-[24px] px-[8px] pb-[20px]'>
      
     
            {
                latestReview.map((item,index)=>(
                    <ReviewCard key={index} rating={item.rating} image={item.user?.photoUrl} text={item.comment} name={item.user?.name} role={item.user?.role} />
                ))
            }
             
    
    
    </div>
    </div>
  )
}
 

export default ReviewPage
