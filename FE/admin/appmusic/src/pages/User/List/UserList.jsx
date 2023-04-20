import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs'
import PATH from '../../../constants/paths'
import useQueryParams from '../../../hoocs/useQueryParams'
import userApi from '../../../apis/user.api'
import { isUndefined, omitBy } from 'lodash'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import Pagination from '../../../components/Pagination/Pagination'
import UserItem from './UserItem'

const UserList = () => {
  // rrv6
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const queryParams = useQueryParams()

  const queryConfig = omitBy(
    {
      page: queryParams.page || 1,
      limit: queryParams.limit || 10,
      search: queryParams.search
    },
    isUndefined
  )

  // fetch categories
  const { data } = useQuery({
    queryKey: ['users', { ...queryConfig }],
    queryFn: () => {
      return userApi.getUsers({ ...queryConfig })
    }
  })

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (queryConfig.search) {
        const searchParam = createSearchParams({ ...queryConfig, search: queryParams.search })
        queryConfig.search === '' && searchParam.delete('search')
        navigate({
          pathname: pathname,
          search: searchParam.toString()
        })
      }
    }, 300)
    return () => clearTimeout(timeOut)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  // scroll to top (search of useLocation)
  useEffect(() => {
    window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <>
      <HeaderBreadcrumbs
        title='User List'
        links={[
          {
            title: 'Dashboard',
            to: PATH.dashboard.root
          },
          {
            title: 'User',
            to: PATH.dashboard.user.root
          },
          {
            title: 'List',
            to: PATH.dashboard.user.root
          }
        ]}
      />
      <div className='relative mt-5 overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-left text-sm text-gray-500 '>
          <thead className='bg-gray-50 text-xs uppercase text-gray-700 '>
            <tr>
              <th scope='col' className='px-6 py-3'>
                <div className={`flex items-center justify-start`}>Name</div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className={`flex items-center justify-start`}>Email</div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className={`flex items-center justify-center`}>Age</div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className={`flex items-center justify-center`}>Gender</div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className={`flex items-center justify-start`}>Role</div>
              </th>
              <th scope='col' className='px-6 py-3'>
                <div className={`flex items-center justify-center`}>Action</div>
              </th>
            </tr>
          </thead>
          <tbody>{data && data.data.data.map((user) => <UserItem user={user} key={user.id} />)}</tbody>
        </table>
      </div>
      {data && data.data.results !== 0 && <Pagination queryConfig={queryConfig} results={data.data.results} />}
    </>
  )
}

export default UserList
