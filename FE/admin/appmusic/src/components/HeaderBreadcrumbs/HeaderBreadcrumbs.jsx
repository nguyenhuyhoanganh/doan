import { NavLink } from 'react-router-dom'

const HeaderBreadcrumbs = ({ links, title }) => {
  // const { pathname } = useLocation()
  return (
    <div>
      <span className='text-lg font-bold text-gray-500'>{title}</span>
      <nav className='flex pb-3 pt-2 text-gray-700'>
        {/*rounded-lg border border-gray-200 bg-gray-50 */}
        <ol className='inline-flex items-center space-x-1 md:space-x-3'>
          {links.map((link, index) =>
            // last
            index === links.length - 1 ? (
              <li aria-current='page' key={link.title}>
                <div className='flex min-h-[24px] items-center'>
                  {index !== 0 && (
                    <svg
                      aria-hidden='true'
                      className='h-6 w-6 text-gray-400'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                        clipRule='evenodd'
                      ></path>
                    </svg>
                  )}

                  <span className={`${index !== links.length - 1 && 'ml-1'} text-sm font-medium text-gray-500`}>
                    {link?.title}
                  </span>
                </div>
              </li>
            ) : index === 0 ? (
              // first
              <li
                className='inline-flex items-center'
                key={link.title}
                onClick={() => {
                  link.trigger && link.trigger()
                }}
              >
                <NavLink
                  to={link?.to}
                  className='inline-flex items-center text-sm font-medium text-gray-700 hover:text-main-color hover:underline hover:underline-offset-1'
                >
                  {link?.icon}
                  {link?.title}
                </NavLink>
              </li>
            ) : (
              // middle
              <li
                key={link.title}
                onClick={() => {
                  link.trigger && link.trigger()
                }}
              >
                <div className='flex items-center'>
                  <svg
                    aria-hidden='true'
                    className='h-6 w-6 text-gray-400'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                      clipRule='evenodd'
                    ></path>
                  </svg>
                  <NavLink
                    to={link?.to}
                    className='ml-1 text-sm font-medium text-gray-700 hover:text-main-color hover:underline hover:underline-offset-1'
                  >
                    {link?.icon}
                    {link?.title}
                  </NavLink>
                </div>
              </li>
            )
          )}
        </ol>
      </nav>
    </div>
  )
}

export default HeaderBreadcrumbs
