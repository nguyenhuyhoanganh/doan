import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import authApi from '../../apis/auth.api'
import PATH from '../../constants/paths'
import { AuthContext } from '../../contexts/auth.context'
import Popover from '../Popover'

const Header = (props) => {
  const location = useLocation()
  const { setIsAuthenticated, setProfile, profile } = useContext(AuthContext)
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
    }
  })

  const handleLogout = () => logoutMutation.mutate()

  return (
    <nav className='fixed top-0 z-50 w-full border-b border-gray-200 bg-white'>
      <div className='px-3 py-3 lg:px-5 lg:pl-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-start'>
            {location.pathname.startsWith('/dashboard') && (
              <button
                onClick={props.onToggleAside}
                type='button'
                className='inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200'
              >
                <svg
                  className='h-6 w-6'
                  aria-hidden='true'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    clipRule='evenodd'
                    fillRule='evenodd'
                    d='M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z'
                  ></path>
                </svg>
              </button>
            )}
            <NavLink to={PATH.dashboard.root} className='ml-2 mr-3 mb-2 flex h-8 md:mr-24'>
              <svg viewBox='0 0 1134 340' className='h-8 fill-main-color lg:h-11'>
                <g fillRule='evenodd'>
                  <path d='M8 171c0 92 76 168 168 168s168-76 168-168S268 4 176 4 8 79 8 171zm230 78c-39-24-89-30-147-17-14 2-16-18-4-20 64-15 118-8 162 19 11 7 0 24-11 18zm17-45c-45-28-114-36-167-20-17 5-23-21-7-25 61-18 136-9 188 23 14 9 0 31-14 22zM80 133c-17 6-28-23-9-30 59-18 159-15 221 22 17 9 1 37-17 27-54-32-144-35-195-19zm379 91c-17 0-33-6-47-20-1 0-1 1-1 1l-16 19c-1 1-1 2 0 3 18 16 40 24 64 24 34 0 55-19 55-47 0-24-15-37-50-46-29-7-34-12-34-22s10-16 23-16 25 5 39 15c0 0 1 1 2 1s1-1 1-1l14-20c1-1 1-1 0-2-16-13-35-20-56-20-31 0-53 19-53 46 0 29 20 38 52 46 28 6 32 12 32 22 0 11-10 17-25 17zm95-77v-13c0-1-1-2-2-2h-26c-1 0-2 1-2 2v147c0 1 1 2 2 2h26c1 0 2-1 2-2v-46c10 11 21 16 36 16 27 0 54-21 54-61s-27-60-54-60c-15 0-26 5-36 17zm30 78c-18 0-31-15-31-35s13-34 31-34 30 14 30 34-12 35-30 35zm68-34c0 34 27 60 62 60s62-27 62-61-26-60-61-60-63 27-63 61zm30-1c0-20 13-34 32-34s33 15 33 35-13 34-32 34-33-15-33-35zm140-58v-29c0-1 0-2-1-2h-26c-1 0-2 1-2 2v29h-13c-1 0-2 1-2 2v22c0 1 1 2 2 2h13v58c0 23 11 35 34 35 9 0 18-2 25-6 1 0 1-1 1-2v-21c0-1 0-2-1-2h-2c-5 3-11 4-16 4-8 0-12-4-12-12v-54h30c1 0 2-1 2-2v-22c0-1-1-2-2-2h-30zm129-3c0-11 4-15 13-15 5 0 10 0 15 2h1s1-1 1-2V93c0-1 0-2-1-2-5-2-12-3-22-3-24 0-36 14-36 39v5h-13c-1 0-2 1-2 2v22c0 1 1 2 2 2h13v89c0 1 1 2 2 2h26c1 0 1-1 1-2v-89h25l37 89c-4 9-8 11-14 11-5 0-10-1-15-4h-1l-1 1-9 19c0 1 0 3 1 3 9 5 17 7 27 7 19 0 30-9 39-33l45-116v-2c0-1-1-1-2-1h-27c-1 0-1 1-1 2l-28 78-30-78c0-1-1-2-2-2h-44v-3zm-83 3c-1 0-2 1-2 2v113c0 1 1 2 2 2h26c1 0 1-1 1-2V134c0-1 0-2-1-2h-26zm-6-33c0 10 9 19 19 19s18-9 18-19-8-18-18-18-19 8-19 18zm245 69c10 0 19-8 19-18s-9-18-19-18-18 8-18 18 8 18 18 18zm0-34c9 0 17 7 17 16s-8 16-17 16-16-7-16-16 7-16 16-16zm4 18c3-1 5-3 5-6 0-4-4-6-8-6h-8v19h4v-6h4l4 6h5zm-3-9c2 0 4 1 4 3s-2 3-4 3h-4v-6h4z'></path>
                </g>
              </svg>
            </NavLink>
          </div>
          <Popover
            hasArrow
            className='flex items-center'
            renderPopover={
              <div className='mb-4 list-none divide-y divide-gray-200 rounded bg-gray-50 text-base shadow'>
                <div className='overflow-hidden px-4 py-3'>
                  {profile?.firstName && (
                    <p className='truncate text-sm text-gray-900'>{`${profile?.firstName} ${profile?.lastName}`}</p>
                  )}
                  <p className='truncate text-sm font-medium text-gray-900'>{profile?.email}</p>
                </div>
                <ul className='py-1'>
                  <li>
                    <NavLink
                      to={PATH.dashboard.root}
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 '
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to={PATH.profile.root} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className='block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            }
          >
            {
              <div className='flex rounded-full bg-gray-800 text-sm hover:ring-4 hover:ring-gray-300'>
                <img
                  className='h-8 w-8 rounded-full'
                  src={
                    profile?.avatarUrl ||
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjYmlp9JDeNMaFZzw9S3G1dVztGqF_2vq9nA&usqp=CAU'
                  }
                  alt='user'
                />
              </div>
            }
          </Popover>
        </div>
      </div>
    </nav>
  )
}

export default Header
