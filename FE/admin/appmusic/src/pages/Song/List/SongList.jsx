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
      if (!audio.paused) {
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
    audio && audio instanceof Audio && !audio.paused && audio.pause()
    source !== '' && setAudio(new Audio(source))
    setIsPlay(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className='mt-2 flex flex-auto flex-col gap-5'>
        <div>
          {data &&
            data.data.data?.map((song) => {
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
            })}
        </div>
      </div>
      <Pagination />
    </>
  )
}

export default SongList
