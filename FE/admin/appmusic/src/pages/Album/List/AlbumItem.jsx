import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Fragment, useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import { MdOutlineClose } from 'react-icons/md'
import useQueryParams from '../../../hoocs/useQueryParams'
import albumApi from '../../../apis/album.api'
import { CiPlay1 } from 'react-icons/ci'
import Tooltip from '../../../components/Tooltip'
import { useNavigate } from 'react-router-dom'

const AlbumItem = ({ album }) => {
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
  const navigate = useNavigate()
  const queryParams = useQueryParams()
  const queryClient = useQueryClient()
  // mutation
  const deleteAlbumMutation = useMutation({
    mutationFn: (id) => albumApi.deleteAlbum(id)
  })

  const artists = album.songs
    .flatMap((song) => song.artists)
    .reduce((unique, artist) => {
      return unique.some((item) => item.id === artist.id) ? unique : [...unique, artist]
    }, [])

  return (
    <>
      <div className='col-span-3 w-64 cursor-pointer'>
        <div className='group relative h-64 w-64 overflow-hidden rounded-md'>
          <div className='absolute inset-0 z-10 flex items-center justify-center transition-transform duration-500 hover:scale-110 group-hover:transform'>
            <div className='absolute inset-0 z-20 flex h-full w-full items-center justify-center bg-transparent transition-opacity duration-500 group-hover:bg-black/20'>
              <Tooltip content='Edit'>
                <span
                  className='flex h-8 w-8 items-center justify-center rounded-full text-white opacity-0 hover:bg-white/30 hover:opacity-80 group-hover:opacity-100'
                  onClick={() => navigate(`/dashboard/album/modify/${album.slug}/${album.id}`)}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-6 w-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
                    />
                  </svg>
                </span>
              </Tooltip>
              <span
                className='mx-4 h-11 w-11 rounded-full text-white opacity-0 hover:opacity-80 group-hover:opacity-100'
                onClick={() => console.log('play')}
              >
                <CiPlay1 size={45} />
              </span>
              <Tooltip content='Delete'>
                <span
                  className='flex h-8 w-8 items-center justify-center rounded-full text-white opacity-0 hover:bg-white/30 hover:opacity-80 group-hover:opacity-100'
                  onClick={() => setIsShowDeleteModal(true)}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-6 w-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                    />
                  </svg>
                </span>
              </Tooltip>
            </div>
            <img
              src={album.backgroundImageUrl}
              className='h-full w-full object-cover transition-transform duration-500'
              alt={album.title}
            />
          </div>
        </div>
        <div className='mt-1'>
          <span className='block truncate text-lg font-bold text-gray-800 hover:text-main-color'>{album.title}</span>
          <div className='h-14'>
            {artists.map((artist, index, artists) => {
              return (
                index < 3 && (
                  <Fragment key={index}>
                    <span className='text-base font-medium text-gray-800 hover:text-main-color hover:underline'>
                      {artist.fullName}
                    </span>
                    {index !== artists.length - 1 && (
                      <>
                        <span className='text-base font-medium text-gray-800'>{`,`}</span>
                        {index !== 2 && <span className='text-base font-medium text-gray-800'>{` `}</span>}
                      </>
                    )}
                  </Fragment>
                )
              )
            })}
            {album.artists.length > 3 && <span className='text-base font-medium text-gray-800'>{`...`}</span>}
          </div>
        </div>
      </div>
      {isShowDeleteModal && (
        <Modal onClose={() => setIsShowDeleteModal(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative flex h-60 w-[27rem] flex-col rounded-lg bg-white px-4 pt-10 pb-8`}
          >
            <span
              onClick={() => setIsShowDeleteModal(false)}
              className='absolute right-3 top-3 inline-flex cursor-pointer items-center justify-center font-[30px] text-red-400'
            >
              <MdOutlineClose size={32} />
            </span>
            <div className='flex h-full items-center justify-center'>
              <h3 className='text-center text-xl font-medium'>{`Are you sure to delete the album "${album.title}"?`}</h3>
            </div>
            <div className='flex items-center justify-center gap-10'>
              <button
                onClick={async () => {
                  await deleteAlbumMutation.mutateAsync(album.id, {
                    onSuccess: () => {
                      queryClient.invalidateQueries(['albums', { ...queryParams.title }])
                    }
                  })
                  setIsShowDeleteModal(false)
                }}
                type='button'
                disabled={deleteAlbumMutation.isLoading}
                className='mr-2 mb-2 block rounded-lg bg-green-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-500'
              >
                Delete
              </button>
              <button
                onClick={() => setIsShowDeleteModal(false)}
                type='button'
                className='mr-2 mb-2 block rounded-lg bg-red-400 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-500'
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default AlbumItem
