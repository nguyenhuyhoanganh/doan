import PATH from './paths'

const sideBarItems = [
  {
    title: 'GENERAL',
    items: [
      {
        title: 'Analytics',
        link: PATH.dashboard.analytics,
        icon: (
          <svg
            aria-hidden='true'
            className='visible h-7 w-7 flex-shrink-0 transition duration-75'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z'></path>
            <path d='M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z'></path>
          </svg>
        )
      }
    ]
  },
  {
    title: 'MANAGEMENT',
    items: [
      {
        title: 'Song',
        link: PATH.dashboard.song.root,
        icon: (
          <svg
            aria-hidden='true'
            className='visible h-6 w-6  flex-shrink-0 transition duration-75'
            fill='currentColor'
            viewBox='0 0 512 512'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 32a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm-96-32a96 96 0 1 0 192 0 96 96 0 1 0 -192 0zM96 240c0-35 17.5-71.1 45.2-98.8S205 96 240 96c8.8 0 16-7.2 16-16s-7.2-16-16-16c-45.4 0-89.2 22.3-121.5 54.5S64 194.6 64 240c0 8.8 7.2 16 16 16s16-7.2 16-16z' />
          </svg>
        ),
        items: [
          { title: 'List', link: PATH.dashboard.song.root },
          { title: 'Create', link: PATH.dashboard.song.create },
          { title: 'Details', link: PATH.dashboard.song.details, hiden: true },
          { title: 'Edit', link: PATH.dashboard.song.edit, hiden: true }
        ]
      },
      {
        title: 'Artist',
        link: PATH.dashboard.artist.root,
        icon: (
          <svg
            aria-hidden='true'
            className='visible h-6 w-6  flex-shrink-0 transition duration-75'
            fill='currentColor'
            viewBox='0 0 512 512'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M256 80C141.1 80 48 173.1 48 288V392c0 13.3-10.7 24-24 24s-24-10.7-24-24V288C0 146.6 114.6 32 256 32s256 114.6 256 256V392c0 13.3-10.7 24-24 24s-24-10.7-24-24V288c0-114.9-93.1-208-208-208zM80 352c0-35.3 28.7-64 64-64h16c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H144c-35.3 0-64-28.7-64-64V352zm288-64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H352c-17.7 0-32-14.3-32-32V320c0-17.7 14.3-32 32-32h16z' />
          </svg>
        ),
        items: [
          { title: 'List', link: PATH.dashboard.artist.root },
          { title: 'Create', link: PATH.dashboard.artist.create },
          { title: 'Details', link: PATH.dashboard.artist.details, hiden: true },
          { title: 'Edit', link: PATH.dashboard.artist.edit, hiden: true }
        ]
      }
    ]
  }
]

export default sideBarItems
