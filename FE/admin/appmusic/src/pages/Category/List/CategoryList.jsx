import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { NavLink, createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import useQueryParams from '../../../hoocs/useQueryParams'
import { isUndefined, omitBy } from 'lodash'
import categoryApi from '../../../apis/category.api'
import PATH from '../../../constants/paths'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'

const TABLE_HEAD = [
  // {
  //   property: 'backgroundImageUrl',
  //   title: 'Image',
  //   type: 'image'
  // },
  {
    property: 'title',
    title: 'Tỉtle',
    type: 'string'
  },
  {
    property: 'description',
    title: 'Description',
    type: 'string'
  }
]

const CategoryList = () => {
  // rrv6
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const queryParams = useQueryParams()
  const [title, setTitle] = useState('')

  const queryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      title: queryParams.title
    },
    isUndefined
  )

  // fetch categories
  const { data } = useQuery({
    queryKey: ['categories', { ...queryConfig }],
    queryFn: () => {
      return categoryApi.getCategories({ ...queryConfig })
    },
    keepPreviousData: true
  })

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (title !== null) {
        const search = createSearchParams({ ...queryConfig, title: title })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleClickCreateBtn = () => {
    navigate(PATH.dashboard.category.create)
  }

  return (
    <>
      <div className='flex items-center justify-between border-b border-gray-300'>
        <HeaderBreadcrumbs
          title='Category List'
          links={[
            {
              title: 'Dashboard',
              to: PATH.dashboard.root
            },
            {
              title: 'Category',
              to: PATH.dashboard.category.root,
              trigger: () => {
                setTitle(null)
              }
            },
            {
              title: 'List',
              to: PATH.dashboard.category.root
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
          New Category
        </button>
      </div>
      <div className='relative mt-5 overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-left text-sm text-gray-500 '>
          <thead className='bg-gray-50 text-xs uppercase text-gray-700 '>
            <tr>
              {TABLE_HEAD.map((header, index) => (
                <th scope='col' className='px-6 py-3' key={index}>
                  <div className={`flex items-center justify-start`}>
                    {header.title}
                    {header.type !== 'image' && header.type !== 'audio' && (
                      <NavLink to='#'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth='1.5'
                          stroke='currentColor'
                          className='ml-1 h-3 w-3'
                        >
                          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
                        </svg>
                      </NavLink>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data &&
              data.data.data.map((item) => (
                <tr className='max-h-14 bg-white' key={item.id}>
                  {TABLE_HEAD.map((row, index) => {
                    if (row.type === 'image')
                      return (
                        <td className='max-w-[3.5rem] p-3 text-center' key={index}>
                          <img
                            src={item[row.property]}
                            className='inline-block h-[3.5rem] w-[3.5rem] min-w-[3.5rem] rounded-md object-cover'
                            alt={item[row.property]}
                          ></img>
                        </td>
                      )
                    if (row.type === 'audio')
                      return (
                        <td className='block max-w-xs p-3' key={index}>
                          <audio controls className='min w-full min-w-[300px] max-w-full'>
                            <source src={item[row.property]} />
                          </audio>
                        </td>
                      )

                    return (
                      <td
                        className={`items-center px-6 py-3 text-left font-medium ${
                          row.property === 'title' && 'w-full text-gray-900'
                        }`}
                        key={index}
                      >
                        <span className={`m-0 min-h-[1.5rem] ${row.property === 'title' && 'w-full'} line-clamp-2`}>
                          {item[row.property]}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default CategoryList
