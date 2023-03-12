import { NavLink } from 'react-router-dom'

const TABLE_HEAD = [
  {
    property: 'title',
    title: 'Title',
    type: 'string'
  },
  {
    property: 'imageUrl',
    title: 'Image',
    type: 'image'
  },
  {
    property: 'sourceUrls',
    title: 'Audio',
    type: 'audio'
  },
  {
    property: 'view',
    title: 'View',
    type: 'number'
  }
]

const Table = ({ data }) => {
  return (
    <div className='relative mt-5 overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-left text-sm text-gray-500 '>
        <thead className='bg-gray-50 text-xs uppercase text-gray-700 '>
          <tr>
            {TABLE_HEAD.map((header, index) => (
              <th scope='col' className='px-6 py-3' key={index}>
                <div className={`flex items-center`}>
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
            data.data.data.map((song) => (
              <tr className='max-h-14 border-b bg-white' key={song.id}>
                {TABLE_HEAD.map((row, index) => {
                  if (row.type === 'image')
                    return (
                      <td className='max-w-[3.5rem] p-3 text-center' key={index}>
                        <img
                          src={song[row.property]}
                          className='inline-block h-[3.5rem] w-[3.5rem] min-w-[3.5rem] rounded-md object-cover'
                          alt={song[row.property]}
                        ></img>
                      </td>
                    )
                  if (row.type === 'audio')
                    return (
                      <td className='block max-w-xs p-3' key={index}>
                        <audio controls className='min w-full min-w-[300px] max-w-full'>
                          <source src={song[row.property]} />
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
                        {song[row.property]}
                      </span>
                    </td>
                  )
                })}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
