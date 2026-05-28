import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
          <img src={assets.logo} className='mb-5 w-32' alt=""/>
          <p className='w-full md:w-2/3 text-gray-600'>
          ...
          </p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>КОМПАНИ</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
             <li>Нүүр хуудас</li>
             <li>Бидний тухай</li>
             <li>Хүргэлт</li>
             <li>Нууцлал</li>
          </ul>
        </div>
        
        <div>
          <p className='text-xl font-medium mb-5'>ХОЛБОО БАРИХ</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Утасны дугаар: </li>
            <li>Имэйл хаяг: </li>
          </ul>
        </div>

{/*        <div> 
          <hr />
          <p className='py-5 text-sm-center'>Copyright 2024@ forever.com - All Right Reserved.</p>
        </div> */}

      </div>
    </div>
  )
}

export default Footer