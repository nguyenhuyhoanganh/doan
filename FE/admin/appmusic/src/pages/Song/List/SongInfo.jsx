import { BsDownload, BsCardText, BsHeadphones } from 'react-icons/bs'
import { AiOutlineHeart } from 'react-icons/ai'
import { HiOutlineLink } from 'react-icons/hi'
import { FaRegComment } from 'react-icons/fa'
import { NavLink, useNavigate } from 'react-router-dom'
import Popover from '../../../components/Popover'
import { Fragment } from 'react'
import Tooltip from '../../../components/Tooltip'
import PATH from '../../../constants/paths'

const SongInfo = ({ children, song, onChangeOpen, isOpen }) => {
  const navigate = useNavigate()

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
  }

  const renderMoreDetails = (
    <div tabIndex='-1' className={`} w-48 cursor-auto select-none rounded-lg bg-white p-[15px] pt-4 shadow`}>
      <div className='flex flex-col justify-around'>
        <span className='text-sm font-semibold uppercase text-gray-400'>Artist</span>
        {song.artists &&
          song.artists.map((artist, index, artists) => (
            <Fragment key={artist?.id}>
              <NavLink
                to={`/dashboard/artist/${artist?.slug}`}
                className='text-sm font-medium line-clamp-2 hover:text-main-color'
              >
                {artist?.fullName}
              </NavLink>
              {index === artists.length - 1 ? '' : ', '}
            </Fragment>
          ))}
      </div>
      <div className='flex flex-col justify-around'>
        <span className='text-sm font-semibold uppercase text-gray-400'>Album</span>
        <NavLink
          to={`/dashboard/album/${song.album?.slug}`}
          className='text-sm font-medium line-clamp-2 hover:text-main-color '
        >
          {song.album?.title}
        </NavLink>
      </div>
      <div className='flex flex-col justify-around'>
        <span className='text-sm font-semibold uppercase text-gray-400'>Composer</span>
        <NavLink
          to={`/dashboard/composer/${song.composer?.slug}`}
          className='text-sm font-medium line-clamp-2 hover:text-main-color'
        >
          {song.composer.fullName}
        </NavLink>
      </div>
      <div className='flex flex-col justify-around'>
        <span className='text-sm font-semibold uppercase text-gray-400'>Gender</span>
        {song.categories &&
          song.categories.map((category, index, categories) => (
            <Fragment key={category?.id}>
              <NavLink
                to={`/dashboard/category/${category?.slug}`}
                className='text-sm font-medium line-clamp-2 hover:text-main-color'
              >
                {category?.title}
              </NavLink>
              {index === categories.length - 1 ? '' : ', '}
            </Fragment>
          ))}
      </div>
    </div>
  )

  const renderDetails = (
    <div tabIndex='-1' className={`w-60 cursor-auto select-none rounded-lg bg-white shadow `}>
      <Popover
        placement='left'
        trigger='hover'
        shrinkedPopoverPosition='right'
        renderPopover={renderMoreDetails}
        offsetValue={{ mainAxis: -3, crossAxis: 20 }}
        clasaName='flex pt-4 px-4 pb-3'
        zindex={100}
        delayHover={{ open: 0, close: 700 }}
      >
        <figure className='h-10 w-10 shrink-0 overflow-hidden rounded'>
          <img src={song.imageUrl} alt='' className='h-full w-full object-cover' />
        </figure>
        <div className='ml-2 flex w-40 flex-col justify-center'>
          <button
            className='w-full truncate text-left text-sm font-medium leading-[1.3] hover:text-main-color'
            onClick={() => navigate(`/dashboard/song/${song.slug}`)}
          >
            {song.title}
          </button>
          <div className='flex w-full items-center text-left text-xs text-gray-500'>
            <span className='flex items-center justify-start pr-1'>
              <AiOutlineHeart size={12} />
              {song.likeCount}
            </span>
            <span className='flex items-center justify-start pr-1'>
              <BsHeadphones size={12} />
              {song.view}
            </span>
          </div>
        </div>
      </Popover>
      <div className='px-4 pb-2'>
        <div className=' flex items-center justify-between rounded-lg bg-gray-100 leading-[1.5]'>
          <NavLink
            to={song.sourceUrls[0]}
            download
            className='flex flex-1 cursor-pointer flex-col items-center rounded-lg py-2 text-xs hover:bg-gray-200 hover:text-gray-600'
          >
            <span className='flex items-center justify-center text-base'>
              <BsDownload />
            </span>
            <span>Download</span>
          </NavLink>
          <div className='flex flex-1 cursor-pointer flex-col items-center rounded-lg py-2 text-xs hover:bg-gray-200 hover:text-gray-600'>
            <span className='flex items-center justify-center text-base'>
              <BsCardText />
            </span>
            <span>Lyrics</span>
          </div>
        </div>
      </div>
      <button className='flex w-full items-center gap-2 py-2 px-5 text-left text-sm text-gray-800 hover:bg-gray-100'>
        <FaRegComment className='scale-x-[-1] transform' />
        Comments
      </button>
      <button
        className='flex w-full items-center gap-2 py-2 px-5 text-left text-sm text-gray-800 hover:bg-gray-100'
        onClick={() => handleCopy(`http://localhost:3000${PATH.dashboard.song.root}/${song.slug}`)}
      >
        <HiOutlineLink size={16} />
        Copy link
      </button>
    </div>
  )

  return (
    <Tooltip content='More' open={!isOpen}>
      <Popover
        placement='left'
        trigger='click'
        shrinkedPopoverPosition='right'
        renderPopover={renderDetails}
        onOpenChange={onChangeOpen}
        offsetValue={{ mainAxis: -3, crossAxis: 40 }}
      >
        {children}
      </Popover>
    </Tooltip>
  )
}

export default SongInfo
