import React from 'react'

const SkeletonSlider = () => {
  return (
    <div className="w-full overflow-hidden px-[30px] justify-center animate-pulse">
      <div className="flex w-full gap-8 pt-8">
        {[1, 2, 3].map((item, index) => (
          <div
            key={item}
            className='bg-gray-500 w-[40%] h-[150px]'>

          </div>
        ))}
      </div>
      
    </div>
  )
}

export default SkeletonSlider
