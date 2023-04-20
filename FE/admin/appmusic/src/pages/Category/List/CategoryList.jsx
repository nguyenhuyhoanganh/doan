import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import useQueryParams from '../../../hoocs/useQueryParams'
import { isUndefined, omitBy } from 'lodash'
import categoryApi from '../../../apis/category.api'
import PATH from '../../../constants/paths'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import Pagination from '../../../components/Pagination/Pagination'
import CategoryItem from './CategoryItem'
import { MdOutlineClose } from 'react-icons/md'
import Modal from '../../../components/Modal/Modal'
import CategoryCreate from '../Create'

const CategoryList = () => {
  // rrv6
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const queryParams = useQueryParams()
  const [title, setTitle] = useState('')
  const [isShowCreateModal, setIsShowCreateModal] = useState(false)

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
    }
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

  // scroll to top (search of useLocation)
  useEffect(() => {
    window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleClickCreateBtn = () => {
    setIsShowCreateModal(true)
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
              <th scope='col' className='px-6 py-3'>
                <div className={`flex items-center justify-start`}>
                  Title
                  {/* <NavLink to='#'>
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
                  </NavLink> */}
                </div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className={`flex items-center justify-start`}>Description</div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className={`flex items-center justify-start`}>Action</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data && data.data.data.map((category) => <CategoryItem category={category} key={category.id} />)}
          </tbody>
        </table>
      </div>
      {data && data.data.results !== 0 && <Pagination queryConfig={queryConfig} results={data.data.results} />}
      {isShowCreateModal && (
        <Modal onClose={() => setIsShowCreateModal(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative flex h-[35rem] w-[60rem] flex-col rounded-lg bg-white px-4 pt-10 pb-8`}
          >
            <span
              onClick={() => setIsShowCreateModal(false)}
              className='absolute right-3 top-3 inline-flex cursor-pointer items-center justify-center font-[30px] text-red-400'
            >
              <MdOutlineClose size={32} />
            </span>
            <CategoryCreate onClose={() => setIsShowCreateModal(false)} />
          </div>
        </Modal>
      )}
    </>
  )
}

export default CategoryList
