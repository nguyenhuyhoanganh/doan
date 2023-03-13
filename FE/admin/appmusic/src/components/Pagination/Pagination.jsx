import { NavLink } from 'react-router-dom'

const Pagination = () => {
  return (
    <div className='mt-5 flex flex-col items-center'>
      <span className='text-sm text-gray-700'>
        Showing <span className='font-semibold text-gray-900 '>1</span> to{' '}
        <span className='font-semibold text-gray-900 '>10</span> of{' '}
        <span className='font-semibold text-gray-900 '>100</span> Entries
      </span>

      <nav aria-label='Page navigation' className='xs:mt-0 mt-2 inline-flex'>
        <ul className='inline-flex -space-x-px'>
          <li>
            <NavLink
              to='#'
              className='ml-0 rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
            >
              Previous
            </NavLink>
          </li>
          <li>
            <NavLink
              to='#'
              className='d border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            >
              1
            </NavLink>
          </li>
          <li>
            <NavLink
              to='#'
              className='d border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            >
              2
            </NavLink>
          </li>
          <li>
            <NavLink
              to='#'
              aria-current='page'
              className='border border-gray-300 bg-blue-50 px-3 py-2 text-blue-600 hover:bg-blue-100 hover:text-blue-700 '
            >
              3
            </NavLink>
          </li>
          <li>
            <NavLink
              to='#'
              className='d border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            >
              4
            </NavLink>
          </li>
          <li>
            <NavLink
              to='#'
              className='d border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            >
              5
            </NavLink>
          </li>
          <li>
            <NavLink
              to='#'
              className='d rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            >
              Next
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Pagination
