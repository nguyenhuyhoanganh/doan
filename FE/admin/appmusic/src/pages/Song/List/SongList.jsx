import { useQuery } from '@tanstack/react-query'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { some, has, omitBy, isUndefined } from 'lodash'
import songApi from '../../../apis/song.api'
import PATH from '../../../constants/paths'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import Pagination from '../../../components/Pagination/Pagination'
import useQueryParams from '../../../hoocs/useQueryParams'
import SearchInput from '../../../components/SearchInput'
import SongItem from './SongItem'
import { BiFilterAlt } from 'react-icons/bi'
import SongFilter from './SongFilter'
import { useContext } from 'react'
import { AudioContext } from '../../../contexts/audio.context'

const SongList = () => {
  // audio context
  const { audio, setSongSelected, setIsPlaying, setIsLoading } = useContext(AudioContext)
  // rrv6
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const queryParams = useQueryParams()
  // popup filter
  const [isActiveFilter, setIsActiveFilter] = useState(
    some(['sortBy', 'title', 'artists.fullName', 'categories.id', 'album.title', 'composer.fullName'], (key) =>
      has(queryParams, key)
    )
  )
  // search value
  const [searchValue, setSearchValue] = useState(queryParams.search === undefined ? null : queryParams.search)
  // omitBy and isUndefined: remove undefined values
  const queryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      sortBy: queryParams.sortBy,
      orderBy: queryParams.orderBy,
      title: queryParams.title,
      search: queryParams.search,
      'artists.fullName': queryParams['artists.fullName'],
      'categories.id': queryParams['categories.id'],
      'album.title': queryParams['album.title'],
      'composer.fullName': queryParams['composer.fullName']
    },
    isUndefined
  )

  // fetch songs
  const { data } = useQuery({
    queryKey: ['songs', { ...queryConfig }],
    queryFn: () => {
      return songApi.getSongs({ ...queryConfig })
    },
    keepPreviousData: true
  })

  // check page and limit if data.length === 0 return to page 1, limit 10
  // useEffect(() => {
  //   if (data && data.data.data.length === 0 && data.data.results > 0) {
  //     const search = createSearchParams({ ...queryConfig, page: 1, limit: 10 })
  //     navigate({
  //       pathname: pathname,
  //       search: search.toString()
  //     })
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data])

  // check change search, fetch data
  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (searchValue !== null) {
        const search = createSearchParams({ ...queryConfig, search: searchValue })
        searchValue === '' && search.delete('search')
        navigate({
          pathname: pathname,
          search: search.toString()
        })
      }
    }, 300)
    return () => clearTimeout(timeOut)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  // scroll to top, pause audio when change query (search of useLocation)
  useEffect(() => {
    window.scrollTo(0, 0)
    audio instanceof Audio && audio.pause()
    setSongSelected(null)
    setIsPlaying(false)
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  // check popup filter song active chang search value = 0
  useEffect(() => {
    isActiveFilter && setSearchValue(null)
  }, [isActiveFilter])

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
              to: PATH.dashboard.song.root,
              trigger: () => {
                setIsActiveFilter(false)
                setSearchValue(null)
              }
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
      <div className='mt-4 flex items-center gap-3 transition-all'>
        <button
          className={`flex h-[40px] items-center justify-around gap-1 rounded-lg px-4 py-2.5 text-gray-700 hover:bg-gray-100 ${
            isActiveFilter && 'bg-gray-100'
          }`}
          onClick={() => {
            // open and close popup filter
            setIsActiveFilter((prev) => !prev)
            // remove query of search if is searching, remove query of filter of popup open
            navigate(pathname)
          }}
        >
          <BiFilterAlt /> Filter
        </button>
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          onActive={() => {
            // check filter popup open, close popup, remove query of filter
            if (isActiveFilter) {
              setIsActiveFilter(false)
              navigate(pathname)
            }
          }}
        />
        <button
          className={`flex h-[40px] items-center justify-center gap-1 rounded-lg px-4 py-2.5 text-red-500 transition-all hover:bg-red-50 ${
            (searchValue === null || searchValue === '') && 'w-0 px-0 opacity-0'
          }`}
          onClick={() => {
            // clear searhValue, remove query of search value
            setSearchValue(null)
            navigate(pathname)
          }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-6 w-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3'
            />
          </svg>
          Reset
        </button>
      </div>
      <SongFilter active={isActiveFilter} queryConfig={queryConfig} />
      <div className='mt-4 flex min-h-[100px] flex-auto flex-col justify-between gap-5 rounded-md'>
        <div>
          {data ? (
            data.data.data.length !== 0 ? (
              data.data.data?.map((song) => {
                return <SongItem key={song.id} song={song} queryConfig={queryConfig} />
              })
            ) : (
              <div className='mt-10 flex flex-col items-center justify-center gap-2'>
                <img
                  className={`block bg-contain bg-center bg-no-repeat`}
                  src='/images/png/empty_content.png'
                  alt='no-content'
                ></img>
                <span className='block text-center text-2xl font-bold'>No Data</span>
              </div>
            )
          ) : (
            Array(7)
              .fill(0)
              .map((_, index) => <LoadingItem key={index} />)
          )}
        </div>
        {data && data.data.results !== 0 && <Pagination queryConfig={queryConfig} results={data.data.results} />}
      </div>
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
