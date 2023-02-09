import React from 'react'

const Personal = () => {
  return (
    <div className='flex flex-col h-[500px] m-5 p-5'>
        <h1 className='font-extrabold text-[30px] text-[#0D7373]'>THƯ VIỆN</h1>
        <div className='h-[40%]'>
          {/* list các album */}
        </div>
        <div className='flex flex-col'>
          {/* list các playlist */}
          <h1 className='font-extrabold text-[30px] text-[#0D7373]'>PLAYLIST</h1>
          <div className='flex justify-between'>
            {/* playlist */}
            <div className='flex flex-col justify-center'>
              <img src='' alt='' className='border border-red-500 w-[150px] h-[150px] object-cover rounded-md ml-4'></img>
              <span>Tên pl</span>
              <span>Creator</span>

            </div>
            <div className='flex flex-col'>
              <img src='' alt='' className='border border-red-500 w-[150px] h-[150px] object-cover rounded-md ml-4'></img>
              <span>Tên pl</span>
              <span>Creator</span>

            </div>
            <div className='flex flex-col'>
              <img src='' alt='' className='border border-red-500 w-[150px] h-[150px] object-cover rounded-md ml-4'></img>
              <span>Tên pl</span>
              <span>Creator</span>

            </div>
            <div className='flex flex-col'>
              <img src='' alt='' className='border border-red-500 w-[150px] h-[150px] object-cover rounded-md ml-4'></img>
              <span>Tên pl</span>
              <span>Creator</span>

            </div>
          </div>
        </div>
    </div>
  )
}

export default Personal
