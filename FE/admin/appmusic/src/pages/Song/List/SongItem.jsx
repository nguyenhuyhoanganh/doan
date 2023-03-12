import { Fragment, useState } from 'react'
import { BsPlayFill, BsPauseCircle } from 'react-icons/bs'
import { BiLoader } from 'react-icons/bi'
import { NavLink } from 'react-router-dom'
import Tippy from '@tippyjs/react'
import SongDetails from './SongDetails'
import Tooltip from '../../../components/Tooltip'

const SongItem = ({ song, source, isLoading, isPlay, onPlayAudio }) => {
  const [isShowDetails, setIsShowDetails] = useState(false)
  const covertTime = (sec) => {
    let min = Math.floor(sec / 60)
    let second = sec - Math.floor(sec / 60) * 60
    return second < 10 ? '0' + min + ':0' + second : '0' + min + ':' + second
  }

  const handleSetShowDetails = (state) => setIsShowDetails(state)

  return (
    <>
      <div
        className={`group  grid h-auto w-[100%] cursor-pointer grid-cols-4 gap-4 rounded-md border-b-[1px] border-t-[1px] pr-[10px] hover:bg-gray-100 
        ${song.sourceUrls.includes(source) && 'bg-gray-100'} ${isShowDetails && 'bg-gray-100'}`}
      >
        <div className='col-span-2 flex p-3'>
          <div className='relative h-14 w-14 rounded-md object-cover' onClick={() => onPlayAudio(song.sourceUrls[0])}>
            <span className='absolute top-0 left-0 h-full w-full'>
              {song.sourceUrls.includes(source) &&
                (isLoading ? (
                  <div className='absolute top-1/2 flex w-full -translate-y-1/2 transform items-center justify-center'>
                    <BiLoader size={36} className='animate-spin text-white' />
                  </div>
                ) : isPlay ? (
                  <div className='absolute top-1/2 flex w-full -translate-y-1/2 transform items-center justify-center'>
                    <span
                      className={`h-6 w-6 bg-contain bg-center bg-no-repeat`}
                      style={{
                        backgroundImage: "url('/images/gif/icon-playing.gif')"
                      }}
                    ></span>
                  </div>
                ) : (
                  <BsPauseCircle size={36} className='absolute top-1/2 w-full -translate-y-1/2 transform text-white' />
                ))}
              {!song.sourceUrls.includes(source) && (
                <BsPlayFill
                  size={36}
                  className={`absolute top-1/2 w-full -translate-y-1/2 transform text-white group-hover:opacity-100 
                  ${isShowDetails ? 'opacity-100' : 'opacity-0'}`}
                />
              )}
            </span>
            <img src={song.imageUrl} alt={song.title} className='h-14 w-14 rounded-md object-cover' />
          </div>
          <div className='flex flex-col gap-1 pl-2'>
            <span className='truncate pt-1 text-base font-bold text-gray-800'>{song.title}</span>
            <span className='truncate'>
              {song.artists &&
                song.artists.map((artist, index, artists) => (
                  <Fragment key={artist?.id}>
                    <NavLink
                      to={`/dashboard/artist/${artist?.slug}`}
                      className='text-xs text-gray-500 hover:text-main-color hover:underline hover:underline-offset-1'
                    >
                      {artist?.fullName}
                    </NavLink>
                    {index === artists.length - 1 ? '' : ', '}
                  </Fragment>
                ))}
            </span>
          </div>
        </div>
        <div className='col-span-1 flex items-center justify-start p-2 pr-4'>
          <NavLink
            to={`/dashboard/album/${song.album?.slug}`}
            className='text-sm text-gray-500 hover:text-main-color hover:underline hover:underline-offset-1'
          >
            {song.album.title}
          </NavLink>
        </div>
        <div className='relative col-span-1'>
          <div className='absolute right-4 top-[50%] -translate-y-1/2 opacity-0 group-hover:opacity-100'>
            <div className='flex items-center justify-items-end'>
              <SongDetails song={song} onChangeOpen={handleSetShowDetails} isOpen={isShowDetails}>
                <div className='flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='h-8 w-8'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                    />
                  </svg>
                </div>
              </SongDetails>
              <Tooltip content='Edit song'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-6 w-6'>
                    <path d='M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z' />
                    <path d='M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z' />
                  </svg>
                </div>
              </Tooltip>
              <Tippy content={<span className='tippy text-sm'>Delete song</span>}>
                <div className='flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-5 w-5'>
                    <path
                      fillRule='evenodd'
                      d='M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              </Tippy>
            </div>
          </div>
          <span className='absolute right-4 top-[50%] -translate-y-1/2 text-gray-500 group-hover:hidden group-hover:opacity-0'>
            {covertTime(song.duration)}
          </span>
        </div>
      </div>
    </>
  )
}

export default SongItem
