import { useMutation } from '@tanstack/react-query'
import { useContext, Fragment, useState, useEffect } from 'react'

import { AuthContext } from '../../../contexts/auth.context'
import authApi from '../../../apis/auth.api'
import { NavLink, useLocation } from 'react-router-dom'
import sideBarItems from '../../../constants/sideBarItems'

const Aside = ({ isOpenAside }) => {
  // handle open, active tab
  const location = useLocation()
  const [tabActive, setTabActive] = useState('')
  const [tabsOpen, setTabsOpen] = useState([])
  // handle logout
  const { setIsAuthenticated, setProfile } = useContext(AuthContext)
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
    }
  })

  useEffect(() => {
    sideBarItems.forEach((sideBarItem) => {
      sideBarItem.items.forEach((items) => {
        items.items
          ? items.items.some((item) => item.link === location.pathname) && setTabActive(items.title)
          : setTabActive(items.title)
      })
    })
  }, [tabActive, location])

  const handleLogout = () => logoutMutation.mutate()

  const handleOpenTab = (tabName) =>
    setTabsOpen((prevState) =>
      !prevState.includes(tabName) ? [...prevState, tabName] : [...prevState.filter((state) => state !== tabName)]
    )

  return (
    <>
      <aside
        id='logo-sidebar'
        className={`fixed top-0 left-0 z-40 h-screen w-64 -translate-x-full overflow-hidden border-r border-gray-200 bg-white pt-20 transition-all duration-300 ease-linear sm:translate-x-0 ${
          isOpenAside ? 'max-w-[16rem]' : 'max-w-0'
        }`}
        aria-label='Sidebar'
      >
        <div className='h-full overflow-y-auto bg-white px-3 pb-4'>
          <ul className='space-y-2'>
            {sideBarItems.map((sideBarItem, index) => {
              return (
                <Fragment key={index}>
                  <li>
                    <span className='flex items-center rounded-lg p-2 text-xs font-bold text-gray-400'>
                      {sideBarItem.title}
                    </span>
                  </li>
                  {sideBarItem.items.map((item, index) => {
                    return (
                      <Fragment key={index}>
                        <li>
                          {item.items ? (
                            <>
                              <span
                                onClick={() => handleOpenTab(item.title)}
                                className={`flex items-center rounded-lg p-2 text-base ${
                                  tabActive === item.title
                                    ? 'bg-main-color/20 font-medium text-main-color'
                                    : 'font-normal text-gray-500 hover:bg-gray-100'
                                }`}
                              >
                                {item.icon}
                                <span
                                  className={`ml-3 flex-1 whitespace-nowrap ${
                                    !tabActive === item.title && 'text-gray-600'
                                  }`}
                                >
                                  {item.title}
                                </span>

                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  viewBox='0 0 20 20'
                                  fill='currentColor'
                                  className={`h-6 w-6 ${
                                    tabActive === item.title ? 'text-main-color' : 'text-gray-500'
                                  }  transition duration-500 ${tabsOpen.includes(item.title) && 'rotate-90'}`}
                                >
                                  <path
                                    fillRule='evenodd'
                                    d='M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                              </span>
                              {item.items && (
                                <div
                                  className={`max-h-0 overflow-hidden transition-all duration-500 ${
                                    tabsOpen.includes(item.title) ? 'max-h-screen' : ''
                                  }`}
                                >
                                  <ul className='space-y-2 py-2'>
                                    {item.items.map((itemChild, index) => {
                                      return (
                                        !itemChild.hiden && (
                                          <li key={index}>
                                            <NavLink
                                              end
                                              to={itemChild.link}
                                              className='flex items-center rounded-lg p-2 text-base font-normal text-gray-500 hover:bg-gray-100'
                                            >
                                              {({ isActive }) => (
                                                <>
                                                  <div className='h-[24px] w-[24px] flex-shrink-0 text-center transition duration-75'>
                                                    <span
                                                      className={`inline-block rounded-full  ${
                                                        isActive
                                                          ? 'h-2 w-2 bg-main-color'
                                                          : 'h-[5px] w-[5px] bg-gray-600'
                                                      }`}
                                                    ></span>
                                                  </div>
                                                  <span
                                                    className={`ml-3 ${isActive ? 'text-gray-700' : 'font-medium'} `}
                                                  >
                                                    {itemChild.title}
                                                  </span>
                                                </>
                                              )}
                                            </NavLink>
                                          </li>
                                        )
                                      )
                                    })}
                                  </ul>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <NavLink
                                to={item.link}
                                className={({ isActive }) =>
                                  `flex items-center rounded-lg p-2 text-base ${
                                    isActive
                                      ? 'bg-main-color/20 font-medium text-main-color'
                                      : 'font-normal text-gray-500 hover:bg-gray-100'
                                  }`
                                }
                              >
                                {item.icon}
                                <span
                                  className={`ml-3 flex-1 whitespace-nowrap ${
                                    !tabActive === item.title && 'text-gray-600'
                                  }`}
                                >
                                  {item.title}
                                </span>
                              </NavLink>
                            </>
                          )}
                        </li>
                      </Fragment>
                    )
                  })}
                </Fragment>
              )
            })}
            <li>
              <button
                onClick={handleLogout}
                className='flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-500 hover:bg-gray-100'
              >
                <svg
                  aria-hidden='true'
                  className='h-6 w-6 flex-shrink-0 transition duration-75'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    d='M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
                <span className='ml-3 whitespace-nowrap text-gray-600'>Sign Out</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  )
}

export default Aside
