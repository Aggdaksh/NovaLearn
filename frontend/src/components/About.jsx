import React from 'react'
import about from "../assets/about.jpg"
import VideoPlayer from './VideoPlayer'
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { BiSolidBadgeCheck } from "react-icons/bi";
function About() {
  return (
    <div className='w-[100vw] flex flex-wrap items-center justify-center gap-8 px-[16px] py-[50px] lg:py-[70px] mb-[10px]'>
        <div className='lg:w-[42%] md:w-[80%] w-[100%] flex items-center justify-center relative pb-[90px] lg:pb-[30px]' >
            <img src={about} className='w-[82%] max-w-[520px] rounded-[24px] shadow-[0_20px_55px_rgba(15,23,42,0.14)]' alt="" />
            <VideoPlayer />

        </div>
        <div className='lg:w-[50%] md:w-[70%] w-[100%] flex items-start justify-center flex-col px-[20px] md:px-[60px]' >
          <div className='flex text-[18px] items-center justify-center gap-[20px]'>About Us <TfiLayoutLineSolid  className='w-[40px] h-[40px]'/> </div>
          <div className='md:text-[45px] text-[35px] font-semibold'>We Are Maximize Your Learning Growth</div>
          <div className='text-[15px] '>We provide a modern Learning Management System to simplify online education, track progress, and enhance student-instructor collaboration efficiently.</div>
          <div className=' w-[100%] lg:w-[60%]'>
            <div className='flex items-center justify-between  mt-[40px]'>
              <div className='flex items-center justify-center gap-[10px]'><BiSolidBadgeCheck className='w-[20px] h-[20px]'/>Simplified Learning</div>
              <div className='flex items-center justify-center gap-[10px]'><BiSolidBadgeCheck className='w-[20px] h-[20px]'/>Expert Trainers</div> 
            </div>
            <div className='flex items-center justify-between mt-[20px] '>
              <div className='flex items-center justify-center gap-[10px]'><BiSolidBadgeCheck className='w-[20px] h-[20px]'/>Big Experience</div>
              <div className='flex items-center justify-center gap-[10px]'><BiSolidBadgeCheck className='w-[20px] h-[20px]'/>Lifetime Access</div>

            </div>
          </div>
        </div>
      
    </div>
  )
}

export default About
