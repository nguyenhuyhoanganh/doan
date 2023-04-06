import { useMutation, useQueryClient } from '@tanstack/react-query'
import Popover from '../../../components/Popover'
import artistApi from '../../../apis/artist.api'
import { useState } from 'react'
import Modal from '../../../components/Modal/Modal'
import { MdOutlineClose } from 'react-icons/md'
import useQueryParams from '../../../hoocs/useQueryParams'
import { useNavigate } from 'react-router-dom'

const ArtistItem = ({ artist }) => {
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
  const navigate = useNavigate()
  const queryParams = useQueryParams()
  const queryClient = useQueryClient()
  // mutation
  const deleteArtistMutation = useMutation({
    mutationFn: (id) => artistApi.deleteArtist(id)
  })

  const renderPopover = (
    <div tabIndex='-1' className={`w-32 cursor-auto select-none rounded-lg bg-white shadow`}>
      <div
        className='flex h-8 items-center justify-start rounded-lg text-center font-medium text-red-500 hover:bg-gray-50'
        onClick={() => setIsShowDeleteModal(true)}
      >
        <div className='flex min-w-[3rem] items-center justify-center'>
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
        </div>
        Delete
      </div>
      <div
        className='flex h-8 items-center justify-start rounded-lg text-center font-medium text-gray-700 hover:bg-gray-50'
        onClick={() => navigate(`/dashboard/artist/modify/${artist.slug}/${artist.id}`)}
      >
        <div className='flex min-w-[3rem] items-center justify-center'>
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
              d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
            />
          </svg>
        </div>
        Edit
      </div>
    </div>
  )
  return (
    <>
      <div className='col-span-4 h-72 w-full rounded-3xl bg-white shadow'>
        <div className='w-ful relative flex h-52 items-center justify-center'>
          <div className='absolute inset-y-0 right-0 m-4 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200'>
            <Popover
              placement='left'
              trigger='click'
              shrinkedPopoverPosition='right'
              renderPopover={renderPopover}
              offsetValue={{ mainAxis: 0, crossAxis: 10 }}
              zindex={100}
              delayHover={{ open: 0, close: 100 }}
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
                  d='M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z'
                />
              </svg>
            </Popover>
          </div>
          <img
            src={artist.avatarUrl}
            className='h-[10rem] w-[10rem] min-w-[3.5rem] rounded-full object-cover'
            alt={artist.fullName}
          />
        </div>
        <div className='text-center'>
          <span className='text-lg font-semibold text-gray-600'>{artist.fullName}</span>
        </div>
        <div className='text-center'>
          <span className='text-base font-medium text-gray-400'>{`${artist.followCount} followers`}</span>
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
              <h3 className='text-center text-xl font-medium'>{`Are you sure to delete the artist "${artist.fullName}"?`}</h3>
            </div>
            <div className='flex items-center justify-center gap-10'>
              <button
                onClick={async () => {
                  await deleteArtistMutation.mutateAsync(artist.id, {
                    onSuccess: () => {
                      queryClient.invalidateQueries(['artists', { ...queryParams.fullName }])
                    }
                  })
                  setIsShowDeleteModal(false)
                }}
                type='button'
                disabled={deleteArtistMutation.isLoading}
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

export default ArtistItem
