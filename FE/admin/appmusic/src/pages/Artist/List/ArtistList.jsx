import { useInfiniteQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import artistApi from '../../../apis/artist.api'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import SearchInput from '../../../components/SearchInput'
import PATH from '../../../constants/paths'
import useQueryParams from '../../../hoocs/useQueryParams'
import ArtistItem from './ArtistItem'

const ArtistList = () => {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const queryParams = useQueryParams()
  // search value
  const [fullName, setFullName] = useState(queryParams.fullName === undefined ? null : queryParams.fullName)

  const fetchArtists = async ({ pageParam = 1 }) => {
    const response = await artistApi.getArtists(
      omitBy({ page: pageParam, limit: 9, fullName: queryParams.fullName }, isUndefined)
    )
    return response.data
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['artists', { ...queryParams.fullName }],
    queryFn: fetchArtists,
    getNextPageParam: (lastPage) => {
      if (lastPage.page * lastPage.limit < lastPage.results) return lastPage.page + 1
    }
  })

  const items = data && data.pages ? data.pages.flatMap((page) => page.data) : []

  // check change search, fetch data
  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (fullName !== null) {
        const search = createSearchParams({ fullName: fullName })
        fullName === '' && search.delete('fullName')
        navigate({
          pathname: pathname,
          search: search.toString()
        })
      }
    }, 300)
    return () => clearTimeout(timeOut)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName])

  // scroll to top, pause audio when change query (search of useLocation)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [search])

  const handleClickCreateBtn = () => {
    navigate(PATH.dashboard.artist.create)
  }

  const handleLoadMore = () => {
    if (!isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <>
      <div className='flex items-center justify-between border-b border-gray-300'>
        <HeaderBreadcrumbs
          title='Artist List'
          links={[
            {
              title: 'Dashboard',
              to: PATH.dashboard.root
            },
            {
              title: 'Artist',
              to: PATH.dashboard.artist.root
            },
            {
              title: 'List',
              to: PATH.dashboard.artist.root
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
          New Artist
        </button>
      </div>
      <div className='mt-4 flex items-center transition-all'>
        <SearchInput value={fullName} onChange={setFullName} />
        <button
          className={`flex h-[40px] items-center justify-center gap-1 rounded-lg px-4 py-2.5 pl-3 text-red-500 transition-all hover:bg-red-50 ${
            (fullName === null || fullName === '') && 'w-0 px-0 pl-0 opacity-0'
          }`}
          onClick={() => {
            // clear searhValue, remove query of search value
            setFullName(null)
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
      <div className='mt-4 flex min-h-[100px] flex-auto flex-col justify-between gap-5 rounded-md'>
        <div>
          <InfiniteScroll dataLength={items.length} next={handleLoadMore} hasMore={hasNextPage} loader={<Loading />}>
            {items.length === 0 && <Loading />}
            <div className='grid grid-cols-12 items-center justify-items-center gap-10'>
              {items.length >= 0 && items.map((artist) => <ArtistItem key={artist.id} artist={artist} />)}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </>
  )
}

export default ArtistList

const Loading = () => {
  return (
    <div className='grid grid-cols-12 items-center justify-items-center gap-10'>
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <div key={index} className='col-span-4 h-72 w-full animate-pulse rounded-3xl bg-white shadow'>
            <div className='w-ful relative flex h-52 items-center justify-center'>
              <button className='absolute inset-y-0 right-0 m-4 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200'>
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
                    d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z'
                  />
                </svg>
              </button>
              <div className='h-[10rem] w-[10rem] min-w-[3.5rem] rounded-full bg-slate-600'></div>
            </div>
            <div className='mb-1 flex items-center justify-center'>
              <div className='h-5 w-16 rounded-2xl bg-gray-600'></div>
            </div>
            <div className='flex items-center justify-center'>
              <div className='h-4 w-24 rounded-2xl bg-gray-400'></div>
            </div>
          </div>
        ))}
    </div>
  )
}
