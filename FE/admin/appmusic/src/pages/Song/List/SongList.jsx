import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { omitBy, isUndefined } from 'lodash'
import songApi from '../../../apis/song.api'
import PATH from '../../../constants/paths'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import Pagination from '../../../components/Pagination/Pagination'
import useQueryParams from '../../../hoocs/useQueryParams'
import SearchInput from '../../../components/SearchInput'
import SongItem from './SongItem'
import { BiFilterAlt } from 'react-icons/bi'
import Filter from './Filter'
import { useContext } from 'react'
import { AudioContext } from '../../../contexts/audio.context'

const SongList = () => {
  const [isActiveFilter, setIsActiveFilter] = useState(false)
  const { audio, setSongSelected, setIsPlaying, setIsLoading } = useContext(AudioContext)
  const navigate = useNavigate()
  const { search } = useLocation()
  //  query
  const queryParams = useQueryParams()
  // omitBy: remove undefined values
  const queryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      sortBy: queryParams.sort_by,
      orderBy: queryParams.order_by,
      title: queryParams.title
    },
    isUndefined
  )
  // scroll to top, pause audio when change query
  useEffect(() => {
    window.scrollTo(0, 0)
    audio instanceof Audio && audio.pause()
    setSongSelected(null)
    setIsPlaying(false)
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  // fetch songs
  const { data } = useQuery({
    queryKey: ['songs', queryConfig],
    queryFn: () => {
      return songApi.getSongs(queryConfig)
    },
    keepPreviousData: true
  })

  const handleClickCreateBtn = () => {
    navigate(PATH.dashboard.song.create)
  }

  return (
    <>
      <div className='flex items-center justify-between border-b border-gray-300'>
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
        <button
          onClick={handleClickCreateBtn}
          type='button'
          className='ml-2 flex min-w-[5.5rem] items-center gap-1 rounded-lg bg-green-500/80 py-2.5 px-4 text-sm font-medium text-white shadow hover:bg-green-500 hover:drop-shadow-lg'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
          New Song
        </button>
      </div>
      <div className='mt-4 flex items-center gap-1'>
        <button
          className='flex items-center justify-around gap-1 rounded-lg px-4 py-2.5 text-gray-700 hover:bg-gray-100'
          onClick={() => setIsActiveFilter((prev) => !prev)}
        >
          <BiFilterAlt /> Filter
        </button>
        <SearchInput />
      </div>
      <Filter active={isActiveFilter} />
      <div className='mt-2 flex flex-auto flex-col gap-5 shadow'>
        <div>
          {data
            ? data.data.data?.map((song) => {
                return <SongItem key={song.id} song={song} />
              })
            : Array(queryConfig.limit)
                .fill(0)
                .map((_, index) => <LoadingItem key={index} />)}
        </div>
      </div>
      {data && <Pagination queryConfig={queryConfig} results={data.data.results} />}
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
