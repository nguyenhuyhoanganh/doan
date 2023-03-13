import { useQuery } from '@tanstack/react-query'

import songApi from '../../../apis/song.api'
import PATH from '../../../constants/paths'

import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import Pagination from '../../../components/Pagination/Pagination'
import useQueryParams from '../../../hoocs/useQueryParams'
import SearchInput from '../../../components/SearchInput'
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import SongItem from './SongItem'

const SongList = () => {
  // handle playAudio
  const [audio, setAudio] = useState(null)
  const [isPlay, setIsPlay] = useState(false)
  const [source, setSource] = useState('')
  const [isLoading, setIsLoading] = useState('')
  // fetch songs
  const queryParams = useQueryParams()
  const { data } = useQuery({
    queryKey: ['songs', queryParams],
    queryFn: () => {
      return songApi.getSongs(queryParams)
    }
  })

  useEffect(() => {
    const onLoadded = () => {
      setIsLoading(false)
    }

    const onLoading = () => {
      setIsLoading(true)
    }

    const onEnded = () => {
      if (audio.paused) {
        audio.play()
      }
    }

    if (audio instanceof Audio) {
      audio.addEventListener('loadstart', onLoading)
      audio.addEventListener('canplay', onLoadded)
      audio.addEventListener('ended', onEnded)
    }

    return () => {
      if (audio instanceof Audio) {
        audio.pause()
        audio.removeEventListener('loadstart', onLoading)
        audio.removeEventListener('canplay', onLoadded)
        audio.removeEventListener('ended', onEnded)
      }
    }
  }, [audio])

  useEffect(() => {
    if (audio && isPlay === true) audio.play()
    if (audio && isPlay === false) audio.pause()
  }, [isPlay, audio])

  useEffect(() => {
    source !== '' && setAudio(new Audio(source))
    setIsPlay(true)
  }, [source])

  const handlePlayAudio = (sourceNew) => {
    source !== sourceNew && setSource(sourceNew)
    source === sourceNew && setIsPlay((prevState) => !prevState)
  }

  return (
    <>
      <HeaderBreadcrumbs
        title='Song List'
        links={[
          {
            title: 'Dashboard',
            to: PATH.dashboard.root
          },
          {
            title: 'Song',
            to: PATH.dashboard.song.root
          },
          {
            title: 'List',
            to: PATH.dashboard.song.root
          }
        ]}
      />
      <div className='mt-4 flex items-center'>
        <SearchInput />
        <NavLink
          to={PATH.dashboard.song.create}
          type='button'
          className='ml-2 min-w-[5.5rem] rounded-lg bg-green-500 py-2.5 px-4 text-center text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300'
        >
          Create
        </NavLink>
      </div>
      <div className='mt-2 flex flex-auto flex-col gap-5 shadow'>
        <div>
          {data
            ? data.data.data?.map((song) => {
                return (
                  <SongItem
                    key={song.id}
                    isLoading={isLoading}
                    isPlay={isPlay}
                    song={song}
                    source={source}
                    onPlayAudio={handlePlayAudio}
                  />
                )
              })
            : Array(10)
                .fill(0)
                .map((_, index) => <LoadingItem key={index} />)}
        </div>
      </div>
      <Pagination />
    </>
  )
}

export default SongList

const LoadingItem = () => {
  return (
    <div className='grid h-auto w-[100%] animate-pulse grid-cols-4 gap-4 rounded-md border-b-[1px] border-t-[1px] pr-[10px]'>
      <div className='col-span-2 flex p-3'>
        <div className='h-14 w-14 rounded-md bg-slate-600'></div>
        <div className='flex flex-col gap-3 pl-2 pt-2'>
          <div className='h-4 w-60 rounded bg-slate-600'></div>
          <div className='h-3 w-40 rounded bg-slate-600'></div>
        </div>
      </div>
      <div className='col-span-1 flex items-center justify-start p-2 pr-4'>
        <div className='h-3 w-44 rounded bg-slate-600'></div>
      </div>
      <div className='col-span-1 flex items-center justify-end pr-3'>
        <div className='h-3 w-14 rounded bg-slate-600'></div>
      </div>
    </div>
  )
}
