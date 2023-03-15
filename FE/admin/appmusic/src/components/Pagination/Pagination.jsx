import { NavLink, createSearchParams, useLocation } from 'react-router-dom'

const RANGE = 2
const Pagination = ({ queryConfig, results }) => {
  const { pathname } = useLocation()
  const limit = Number(queryConfig.limit)
  const page = Number(queryConfig.page)
  const pageSize = Math.ceil(results / limit)

  const renderPagination = () => {
    let hasDotAfter = false
    let hasDotBefore = false
    const renderDotAfter = (index) => {
      if (!hasDotAfter) {
        hasDotAfter = true
        return (
          <li key={index}>
            <NavLink
              to={{ pathname: pathname, search: createSearchParams({ ...queryConfig, page: page + 3 }).toString() }}
              className={`border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700`}
            >
              ...
            </NavLink>
          </li>
        )
      }
      return null
    }
    const renderDotBefore = (index) => {
      if (!hasDotBefore) {
        hasDotBefore = true
        return (
          <li key={index}>
            <NavLink
              to={{ pathname: pathname, search: createSearchParams({ ...queryConfig, page: page - 3 }).toString() }}
              className={`border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700`}
            >
              ...
            </NavLink>
          </li>
        )
      }
      return null
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        }
        if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          }
          if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        }
        if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotBefore(index)
        }
        return (
          <li key={index}>
            <NavLink
              to={{
                pathname: pathname,
                search: createSearchParams({ ...queryConfig, page: pageNumber }).toString()
              }}
              className={`${
                page === pageNumber && 'bg-gray-100 text-gray-700'
              } border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700`}
            >
              {pageNumber}
            </NavLink>
          </li>
        )
      })
  }

  return (
    <div className='mt-5 mb-5 flex flex-col items-center'>
      <span className='text-sm text-gray-700'>
        Showing <span className='font-semibold text-gray-900 '>{(page - 1) * limit + 1}</span> to{' '}
        <span className='font-semibold text-gray-900 '>{page * limit <= results ? page * limit : results}</span> of{' '}
        <span className='font-semibold text-gray-900 '>{results}</span> Entries
      </span>

      <nav aria-label='Page navigation' className='xs:mt-0 mt-2 inline-flex'>
        <ul className='inline-flex -space-x-px'>
          <li>
            {page === 1 ? (
              <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-gray-100 px-3 py-2 leading-tight text-gray-700'>
                Prev
              </span>
            ) : (
              <NavLink
                to={{
                  pathname: pathname,
                  search: createSearchParams({ ...queryConfig, page: page - 1 }).toString()
                }}
                className='rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              >
                Prev
              </NavLink>
            )}
          </li>
          {renderPagination()}
          <li>
            {page === pageSize ? (
              <span className='cursor-not-allowed rounded-r-lg border border-gray-300 bg-gray-100 px-3 py-2 leading-tight text-gray-700'>
                Next
              </span>
            ) : (
              <NavLink
                to={{
                  pathname: pathname,
                  search: createSearchParams({ ...queryConfig, page: page + 1 }).toString()
                }}
                className='rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              >
                Next
              </NavLink>
            )}
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Pagination
