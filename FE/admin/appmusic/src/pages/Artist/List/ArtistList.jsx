import { useQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import { useEffect, useState } from 'react'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import artistApi from '../../../apis/artist.api'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import Pagination from '../../../components/Pagination/Pagination'
import SearchInput from '../../../components/SearchInput'
import Table from '../../../components/Table/Table'
import PATH from '../../../constants/paths'
import useQueryParams from '../../../hoocs/useQueryParams'

const TABLE_HEAD = [
  {
    property: 'avatarUrl',
    title: 'Avatar',
    type: 'image'
  },
  {
    property: 'fullName',
    title: 'Full name',
    type: 'string'
  },
  {
    property: 'gender',
    title: 'Gender',
    type: 'string'
  },
  {
    property: 'followCount',
    title: 'Number of followers',
    type: 'number'
  }
]

const ArtistList = () => {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const queryParams = useQueryParams()
  // search value
  const [searchValue, setSearchValue] = useState(queryParams.search === undefined ? null : queryParams.search)

  const queryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      sortBy: queryParams.sortBy,
      orderBy: queryParams.orderBy,
      search: queryParams.search
    },
    isUndefined
  )

  // fetch artists
  const { data } = useQuery({
    queryKey: ['artists', { ...queryConfig }],
    queryFn: () => {
      return artistApi.getArtists({ ...queryConfig })
    },
    keepPreviousData: true
  })

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
  }, [search])

  const handleClickCreateBtn = () => {
    navigate(PATH.dashboard.artist.create)
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
      <div className='mt-4 flex items-center gap-3 transition-all'>
        <SearchInput value={searchValue} onChange={setSearchValue} />
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
      <div className='mt-4 flex min-h-[100px] flex-auto flex-col justify-between gap-5 rounded-md'>
        <div>
          <Table tableHead={TABLE_HEAD} data={data} />
        </div>
        {data && data.data.results !== 0 && <Pagination queryConfig={queryConfig} results={data.data.results} />}
      </div>
    </>
  )
}

export default ArtistList
