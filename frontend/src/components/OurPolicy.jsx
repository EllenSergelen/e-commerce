import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
      
      <div>
        <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold'>Хялбар солилцоо</p>
        <p className='text-gray-400'>Бид ямар ч асуудалгүй солилцоо санал болгож байна</p> 
      </div>
      <div>
        <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold'>7 хоногийн буцаалтын бодлого</p>
        <p className='text-gray-400'>Бид 7 хоногийн түрүүлэх бодлого олгодог</p> 
      </div>
      <div>
        <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold'>Шилдэг хэрэглэгчийн үйлчилгээ</p>
        <p className='text-gray-400'>Бид 24/7 хэрэглэгчийн үйлчилгээ олгодог</p> 
      </div>
      
    </div>
  )
}

export default OurPolicy