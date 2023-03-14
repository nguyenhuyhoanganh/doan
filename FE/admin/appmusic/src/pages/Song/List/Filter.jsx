import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useState } from 'react'
import categoryApi from '../../../apis/category.api'
import Selector from '../../../components/Select'

const Filter = ({ active }) => {
  const [categorySelected, setCategorySelected] = useState(null)
  const [sortSelected, setSortSelected] = useState(null)

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories({ limit: 999 })
    },
    keepPreviousData: true
  })

  return (
    <div
      className={`mx-2 my-4 grid grid-cols-12 gap-3 transition-all ${!active ? 'max-h-0 opacity-0' : 'max-h-screen'}`}
    >
      <div className='col-span-6 flex items-center justify-between gap-2'>
        <label htmlFor='title' className='mb-2 block w-32 text-right text-sm font-medium text-gray-900'>
          Title:
        </label>
        <input
          id='title'
          type='text'
          placeholder='Type value...'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none'
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
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none'
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
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none'
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
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none'
        ></input>
      </div>
      <div className='col-span-6 flex items-center justify-between gap-2'>
        <label htmlFor='category' className='mb-2 block w-32 text-right text-sm font-medium text-gray-900'>
          Category:
        </label>
        <Selector
          id='category'
          options={categoriesData ? categoriesData.data.data : []}
          selected={categorySelected}
          onSelected={setCategorySelected}
        />
      </div>
      <div className='col-span-6 flex items-center justify-between gap-2'>
        <label htmlFor='sort_by' className='mb-2 block w-32 text-right text-sm font-medium text-gray-900'>
          Sort By:
        </label>
        <Selector
          id='sort_by'
          options={[
            { value: 'view', title: 'View' },
            { value: 'likeCount', title: 'Favorite' },
            { value: 'createdAt', title: 'Upload date' }
          ]}
          selected={sortSelected}
          onSelected={setSortSelected}
        />
      </div>
    </div>
  )
}

export default Filter
