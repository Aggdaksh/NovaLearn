import React from 'react'
import { MdCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
function Logos() {
  return (
    <div className='relative z-10 w-[100vw] bg-white px-[16px] pb-[26px] pt-[18px] md:pb-[40px] md:pt-[24px]'>
      <div className='mx-auto flex min-h-[90px] max-w-7xl items-center justify-center flex-wrap gap-4'>
        <div className='flex items-center justify-center gap-2  px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer shadow-sm'>
            <MdCastForEducation className='w-[35px] h-[35px] fill-[#03394b]' />
            <span className='text-[#03394b]'>20k+ Online Courses</span>
        </div>
        <div className='flex items-center justify-center gap-2  px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer shadow-sm'>
            <SiOpenaccess className='w-[30px] h-[30px] fill-[#03394b]' />
            <span className='text-[#03394b]'>Lifetime Access</span>
        </div>
        <div className='flex items-center justify-center gap-2  px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer shadow-sm'>
            <FaSackDollar className='w-[30px] h-[30px] fill-[#03394b]' />
            <span className='text-[#03394b]'>Value For Money</span>
        </div>
        <div className='flex items-center justify-center gap-2  px-5 py-3  rounded-3xl bg-gray-200 cursor-pointer shadow-sm'>
            <BiSupport className='w-[35px] h-[35px] fill-[#03394b]' />
            <span className='text-[#03394b]'>Lifetime Support</span>
        </div>
        <div className='flex items-center justify-center gap-2  px-5 py-3 rounded-3xl bg-gray-200 cursor-pointer shadow-sm'>
            <FaUsers className='w-[35px] h-[35px] fill-[#03394b]' />
            <span className='text-[#03394b]'>Community Support</span>
        </div>
      </div>
    </div>
  )
}

export default Logos
