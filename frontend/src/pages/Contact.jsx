import React from 'react'
import Title from '../components/Title'
import {assets} from '../assets/assets'
import Newsletterbox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'ХОЛБОО'} text2={'БАРИХ'}/>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt=""/>
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Манай дэлгүүр</p>
          <p className='text-gray-500'>Хаяг <br/> Хаяг</p>
          <p className='text-gray-500'>Утас: (415) 555-0132 <br/> Имэйл: admin@forever.com</p>
          <p className='font-semibold text-xl text-gray-600'>Forever</p>
          <p className='text-gray-500'>Манай компанид ажиллах боломж</p>
          <button className='px-8 py-4 text-sm transition-all duration-500 bg-violet-700 text-white rounded-lg'>Ажил хайх</button>
        </div>
      </div>

      <Newsletterbox/>
    </div>
  )
}

export default Contact