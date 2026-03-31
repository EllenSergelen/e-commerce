import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row rounded-3xl'>
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 bg-violet-700 rounded-l-3xl'>
        <div className='text-[#414141]'>
          <div className='flex items-center gap-2'>
            <p className='w-8 md:w-11 h-[2px] bg-white'></p>
            <p className='font-medium text-sm md:text-base text-white'>OUR BESTSELLERS</p>
          </div>
          <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed text-white'>Latest Arrivals</h1>
          <div className='flex items-center gap-2'>
            <p className='font-semibold text-sm md-text-base text-white'>SHOP NOW</p>
            <p className='w-8 md:w-11 h-[1px] bg-white'></p>
          </div>
        </div>
      </div>

      <img className='w-full sm:w-1/2 rounded-r-3xl' src={assets.hero_img}></img>
    </div>
  )
}

export default Hero