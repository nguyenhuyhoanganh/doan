import React from 'react'
import { useSelector } from 'react-redux'

const Slider = () => {

    const { banner} = useSelector(state => state.app)
    console.log(banner)
  return (
    <div className='flex flex-col'>
      {banner?.map(item => (
        <img src={item.banner} alt='banner'
        key={item.encodeId} 
        className='flex-1 object-contain'/>
      ))}
    </div>
  )
}

export default Slider
