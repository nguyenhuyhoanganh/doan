import { useInfiniteQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import { Fragment, useEffect, useState } from 'react'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import albumApi from '../../../apis/album.api'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import SearchInput from '../../../components/SearchInput'
import PATH from '../../../constants/paths'
import useQueryParams from '../../../hoocs/useQueryParams'
import InfiniteScroll from 'react-infinite-scroll-component'
import AlbumItem from './AlbumItem'

const AlbumList = () => {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const queryParams = useQueryParams()
  // search value
  const [title, setTitle] = useState(queryParams.title === undefined ? null : queryParams.title)

  const fetchAlbums = async ({ pageParam = 1 }) => {
    const response = await albumApi.getAlbums(
      omitBy({ page: pageParam, limit: 9, title: queryParams.title }, isUndefined)
    )
    return response.data
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['albums', { ...queryParams.title }],
    queryFn: fetchAlbums,
    getNextPageParam: (lastPage) => {
      if (lastPage.page * lastPage.limit < lastPage.results) return lastPage.page + 1
    },
    keepPreviousData: true
  })

  const items = data && data.pages ? data.pages.flatMap((page) => page.data) : []

  // check change search, fetch data
  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (title !== null) {
        const search = createSearchParams({ title: title })
        title === '' && search.delete('title')
        navigate({
          pathname: pathname,
          search: search.toString()
        })
      }
    }, 300)
    return () => clearTimeout(timeOut)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title])

  // scroll to top, pause audio when change query (search of useLocation)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [search])

  const handleClickCreateBtn = () => {
    navigate(PATH.dashboard.album.create)
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
          title='Album List'
          links={[
            {
              title: 'Dashboard',
              to: PATH.dashboard.root
            },
            {
              title: 'Album',
              to: PATH.dashboard.album.root
            },
            {
              title: 'List',
              to: PATH.dashboard.album.root
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
          New Album
        </button>
      </div>
      <div className='mt-4 flex items-center transition-all'>
        <SearchInput value={title} onChange={setTitle} />
        <button
          className={`flex h-[40px] items-center justify-center gap-1 rounded-lg px-4 py-2.5 pl-3 text-red-500 transition-all hover:bg-red-50 ${
            (title === null || title === '') && 'w-0 px-0 pl-0 opacity-0'
          }`}
          onClick={() => {
            // clear searhValue, remove query of search value
            setTitle(null)
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
      <div className='mt-4 flex min-h-screen flex-auto flex-col justify-between gap-5 rounded-md'>
        <div>
          <InfiniteScroll dataLength={items.length} next={handleLoadMore} hasMore={hasNextPage} loader={<Loading />}>
            {items.length === 0 && <Loading />}
            <div className='grid grid-cols-12 items-center justify-items-center gap-10'>
              {items.length >= 0 && items.map((album) => <AlbumItem key={album.id} album={album} />)}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </>
  )
}

export default AlbumList

const Loading = () => {
  return (
    <div className='grid grid-cols-12 items-center justify-items-center gap-10'>
      {Array(8)
        .fill(0)
        .map((_, index) => (
          <Fragment key={index}>
            <div className='col-span-3 w-64 animate-pulse cursor-pointer'>
              <div className='h-64 w-64 overflow-hidden rounded-md bg-gray-500'></div>
              <div className='mt-1'>
                <div className='m-[5px] h-[18px] animate-pulse rounded-lg bg-gray-800'></div>
                <div className='h-14'>
                  <div className='m-[4px] h-4 animate-pulse rounded-lg bg-gray-600'></div>
                  <div className='m-[4px] h-4 animate-pulse rounded-lg bg-gray-600'></div>
                </div>
              </div>
            </div>
          </Fragment>
        ))}
    </div>
  )
}
