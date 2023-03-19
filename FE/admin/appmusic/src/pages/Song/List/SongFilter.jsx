import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import categoryApi from '../../../apis/category.api'
import Selector from '../../../components/Selector'
import useQueryParams from '../../../hoocs/useQueryParams'

const SORT_BY = [
  { value: '', title: 'Lastest' },
  { value: 'view', title: 'Popularity' },
  { value: 'likeCount', title: 'Favorite' }
]
const FilterSong = ({ active, queryConfig }) => {
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories({ limit: 999 })
    }
  })
  // rrv6
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const queryParams = useQueryParams()
  //filter
  const [categorySelectedId, setCategorySelectedId] = useState(
    queryParams['categories.id'] === undefined ? null : queryParams['categories.id']
  )
  const [sortSelected, setSortSelected] = useState(
    queryParams.sortBy === undefined ? null : SORT_BY.find((sortBy) => sortBy.value === queryParams.sortBy)
  )
  const [title, setTitle] = useState(queryParams.title === undefined ? null : queryParams.title)
  const [artistName, setArtistName] = useState(
    queryParams['artists.fullName'] === undefined ? null : queryParams['artists.fullName']
  )
  const [composerName, setComposerName] = useState(
    queryParams['composer.fullName'] === undefined ? null : queryParams['composer.fullName']
  )
  const [albumTitle, setAlbumTitle] = useState(
    queryParams['album.title'] === undefined ? null : queryParams['album.title']
  )

  const CATEGORIES = categoriesData
    ? [{ title: 'All gender', id: '' }, ...categoriesData?.data?.data]
    : [{ title: 'All gender', id: '' }]

  // check popup not active reset all state
  useEffect(() => {
    if (!active) {
      setCategorySelectedId(null)
      setSortSelected(null)
      setAlbumTitle(null)
      setArtistName(null)
      setComposerName(null)
      setTitle(null)
    }
  }, [active])

  // handle navigate
  const handleNavigate = (value, key) => {
    if (value !== null) {
      const search = createSearchParams({ ...queryConfig, [key]: value })
      // delete key search of searchValue
      search.delete('search')
      // delete key when value = ''
      value === '' && search.delete(key)
      navigate({
        pathname: pathname,
        search: search.toString()
      })
    }
  }

  // check category to navigate
  useEffect(() => {
    handleNavigate(categorySelectedId, 'categories.id')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySelectedId])

  // check sortBy to navigate
  useEffect(() => {
    handleNavigate(sortSelected?.value || null, 'sortBy')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortSelected])

  // check title to navigate
  useEffect(() => {
    const timeOut = setTimeout(() => {
      handleNavigate(title, 'title')
    }, 300)
    return () => clearTimeout(timeOut)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title])

  // check fullName of artist to navigate
  useEffect(() => {
    const timeOut = setTimeout(() => {
      handleNavigate(artistName, 'artists.fullName')
    }, 300)
    return () => clearTimeout(timeOut)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artistName])

  // check fullName of composer to navigate
  useEffect(() => {
    const timeOut = setTimeout(() => {
      handleNavigate(composerName, 'composer.fullName')
    }, 300)
    return () => clearTimeout(timeOut)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composerName])

  // check title of album to navigate
  useEffect(() => {
    const timeOut = setTimeout(() => {
      handleNavigate(albumTitle, 'album.title')
    }, 300)
    return () => clearTimeout(timeOut)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumTitle])

  return (
    <div
      className={`mx-2 my-4 grid grid-cols-12 gap-3 transition-all ${
        !active ? 'pointer-events-none my-0 max-h-0 opacity-0' : 'max-h-screen'
      }`}
    >
      <div className='col-span-6 flex items-center justify-between gap-2'>
        <label htmlFor='title' className='mb-2 block w-32 text-right text-sm font-medium text-gray-900'>
          Title:
        </label>
        <input
          id='title'
          type='text'
          placeholder='Type value...'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-gray-900'
          value={title || ''}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
      </div>
      <div className='col-span-6 flex items-center justify-between gap-2'>
        <label htmlFor='artist_name' className='mb-2 block w-32 text-right text-sm font-medium text-gray-900'>
          Artist Name:
        </label>
        <input
          id='artist_name'
          type='text'
          placeholder='Type value...'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-gray-900'
          value={artistName || ''}
          onChange={(e) => setArtistName(e.target.value)}
        ></input>
      </div>

      <div className='col-span-6 flex items-center justify-between gap-2'>
        <label htmlFor='album_title' className='mb-2 block w-32 text-right text-sm font-medium text-gray-900'>
          Album Title:
        </label>
        <input
          id='album_title'
          type='text'
          placeholder='Type value...'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-gray-900'
          value={albumTitle || ''}
          onChange={(e) => setAlbumTitle(e.target.value)}
        ></input>
      </div>
      <div className='col-span-6 flex items-center justify-between gap-2'>
        <label htmlFor='composer_name' className='mb-2 block w-32 text-right text-sm font-medium text-gray-900'>
          Composer Name:
        </label>
        <input
          id='composer_name'
          type='text'
          placeholder='Type value...'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none focus:border-gray-900'
          value={composerName || ''}
          onChange={(e) => setComposerName(e.target.value)}
        ></input>
      </div>
      <div className='col-span-6 flex items-center justify-between gap-2'>
        <label htmlFor='category' className='mb-2 block w-32 text-right text-sm font-medium text-gray-900'>
          Gender:
        </label>
        <Selector
          id='category'
          options={CATEGORIES}
          selected={
            CATEGORIES.find((category) => category?.id === +categorySelectedId) || { title: 'All gender', id: '' }
          }
          onSelected={(category) => {
            setCategorySelectedId(category?.id)
          }}
          placeholder='All gender'
        />
      </div>
      <div className='col-span-6 flex items-center justify-between gap-2'>
        <label htmlFor='sort_by' className='mb-2 block w-32 text-right text-sm font-medium text-gray-900'>
          Sort By:
        </label>
        <Selector id='sort_by' options={SORT_BY} selected={sortSelected || SORT_BY[0]} onSelected={setSortSelected} />
      </div>
    </div>
  )
}

export default FilterSong
