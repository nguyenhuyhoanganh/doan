import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery } from '@tanstack/react-query'
import { useLayoutEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { songSchema } from '../../../../utils/validate.form'
import categoryApi from '../../../../apis/category.api'
import artistApi from '../../../../apis/artist.api'
import composerApi from '../../../../apis/composer.api'
import albumApi from '../../../../apis/album.api'
import Input from '../../../../components/Input'
import RichText from '../../../../components/RichText/RichText'
import Selector from '../../../../components/Selector'
import SelectorSearch from '../../../../components/SelectorSearch/SelectorSearch'
import Radio from '../../../../components/Radio'
import UploadImage from '../../../../components/UploadImage/UploadImage'
import UploadAudio from '../UploadAudio/UploadAudio'
import { NavLink } from 'react-router-dom'

const STATUS = [
  { value: 'DRAFT', title: 'DRAFT' },
  { value: 'PUBLIC', title: 'PUBLIC' },
  { value: 'PRIVATE', title: 'PRIVATE' }
]
const Form = ({ song, onSubmit, isLoading }) => {
  // react-hook-form
  const {
    reset,
    control,
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(songSchema)
  })
  // state
  const [searchArtist, setSearchArtist] = useState('')
  const [searchComposer, setSearchComposer] = useState('')
  const [searchAlbum, setSearchAlbum] = useState('')

  // update state, form value
  useLayoutEffect(() => {
    const downloadFile = async (url, type) => {
      const data = await (await fetch(url)).blob()
      return new File([data], 'fileUpload', { type: type })
    }
    const initialFormValue = async (song) => {
      if (song !== undefined) {
        const filesDownload = await Promise.all([
          downloadFile(song.imageUrl, 'image/jpeg'),
          downloadFile(song.backgroundImageUrl, 'image/jpeg'),
          downloadFile(song?.sourceUrls[0], 'audio/mp3')
        ])
        const songInitial = {
          title: song.title,
          status: song.status,
          categories: song.categories,
          description: song.description,
          artists: song.artists,
          composer: song.composer,
          album: song.album,
          image: filesDownload[0],
          backgroundImage: filesDownload[1],
          audio: filesDownload[2]
        }
        reset(songInitial)
      } else {
        setValue('artists', [])
        setValue('categories', [])
      }
    }
    initialFormValue(song)
  }, [song, setValue, reset])

  // fetch all categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories({ limit: 999 })
    }
  })
  // fetch artists
  const { data: artistsData } = useQuery({
    queryKey: ['artists', searchArtist],
    queryFn: () => {
      return artistApi.getArtists({ limit: 5, fullName: searchArtist })
    }
  })
  // fetch composers
  const { data: composersData } = useQuery({
    queryKey: ['composers', searchComposer],
    queryFn: () => {
      return composerApi.getComposers({ limit: 5, fullName: searchComposer })
    }
  })
  // fetch albums
  const { data: albumsData } = useQuery({
    queryKey: ['albums', searchAlbum],
    queryFn: () => {
      return albumApi.getAlbums({ limit: 5, title: searchAlbum })
    }
  })

  const toggleArrayElement = (array, element) => {
    if (array instanceof Array) {
      const index = array.findIndex((el) => el.id === element.id)
      index !== -1 ? array.splice(index, 1) : array.push(element)
      return array
    } else return [element]
  }

  // submit form
  const handleSubmitForm = handleSubmit(async (data) => {
    onSubmit(song, data, setError)
  })

  return (
    <form
      className='grid grid-cols-12 gap-2 border border-x-transparent border-t-gray-300 border-b-transparent py-10 '
      onSubmit={handleSubmitForm}
      noValidate
    >
      <div className='col-span-12 px-5 py-1'>
        <span className='text-sm text-gray-500'>
          {`(*) If you have new kind of album or artist or composer, you need to create those first. Create `}
          <NavLink className='font-semibold hover:text-blue-500 hover:underline' to={'/dashboard/album/create'}>
            album
          </NavLink>
          {`, `}
          <NavLink className='font-semibold hover:text-blue-500 hover:underline' to={'/dashboard/artist/create'}>
            artist
          </NavLink>
          {`, `}
          <NavLink className='font-semibold hover:text-blue-500 hover:underline' to={'/dashboard/composer/create'}>
            composer
          </NavLink>
          {`.`}
        </span>
      </div>
      <div className='col-span-8 rounded-lg border border-t-slate-200/80 p-5 shadow-md'>
        <Input
          label='Title:'
          name='title'
          register={register}
          type='text'
          errorMessage={errors.title?.message}
          className='w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-900'
          classNameWrapper='w-full mb-2'
          placeholder='Input value...'
        />
        <div className={`ml-1 mb-1`}>
          <label>Description:</label>
        </div>
        <Controller
          control={control}
          name='description'
          render={({ field }) => <RichText value={field.value} onChange={field.onChange} />}
        />
        <div>
          <div
            className={`ml-1 mb-1 ${
              (errors.image?.message !== undefined || errors.backgroundImage?.message !== undefined) && 'text-red-600'
            }`}
          >
            <label>Image:</label>
          </div>
          <div className='flex w-full items-center justify-between gap-5 rounded-lg'>
            <Controller
              control={control}
              name='image'
              render={({ field }) => (
                <UploadImage
                  title='Upload image'
                  value={field.value}
                  onChange={field.onChange}
                  hasError={errors.image?.message !== undefined}
                  errorMessage={errors.image?.message}
                />
              )}
            />
            <Controller
              control={control}
              name='backgroundImage'
              render={({ field }) => (
                <UploadImage
                  className='w-full rounded-lg'
                  title='Upload background image'
                  value={field.value}
                  onChange={field.onChange}
                  hasError={errors.backgroundImage?.message !== undefined}
                  errorMessage={errors.backgroundImage?.message}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className='col-span-4 rounded-lg border border-t-slate-200/80 p-5 shadow-md'>
        <div className='mb-2'>
          <div className={`ml-1 mb-1 ${errors.audio?.message !== undefined && 'text-red-600'}`}>
            <label>Audio:</label>
          </div>
          <div className='flex w-full items-center justify-between gap-5 rounded-lg'>
            <Controller
              control={control}
              name='audio'
              render={({ field }) => (
                <UploadAudio
                  value={field.value}
                  onChange={field.onChange}
                  hasError={errors.audio?.message !== undefined}
                  errorMessage={errors.audio?.message}
                />
              )}
            />
          </div>
        </div>

        <Controller
          control={control}
          name='categories'
          render={({ field }) => (
            <Selector
              label='Category:'
              errorMessage={errors.categories?.message}
              shouldValidateSelect
              hasMultipleValue
              className='min-h-[45px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
              classNameWrapper='w-full mb-2'
              placeholder='Select option...'
              options={categoriesData ? categoriesData.data.data : []}
              selected={field.value}
              onSelected={(option) => {
                const newValue = [...toggleArrayElement(field.value, option)]
                field.onChange(newValue)
              }}
            />
          )}
        />
        <Controller
          control={control}
          name='album'
          render={({ field }) => (
            <SelectorSearch
              shouldValidateSelect
              errorMessage={errors.album?.message}
              searchValue={searchAlbum}
              onSearch={setSearchAlbum}
              options={albumsData ? albumsData.data.data : []}
              selected={field.value}
              onSelected={(option) => {
                field.onChange(option)
                setSearchAlbum('')
              }}
              label='Album:'
              className='min-h-[45px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
              classNameWrapper='w-full mb-2'
              placeholder='Select option...'
            />
          )}
        />
        <Controller
          control={control}
          name='artists'
          sho
          render={({ field }) => (
            <SelectorSearch
              hasMultipleValue
              shouldValidateSelect
              errorMessage={errors.artists?.message}
              searchValue={searchArtist}
              onSearch={setSearchArtist}
              options={artistsData ? artistsData.data.data : []}
              selected={field.value}
              onSelected={(option) => {
                const newValue = [...toggleArrayElement(field.value, option)]
                field.onChange(newValue)
                setSearchArtist('')
              }}
              label='Artist:'
              className='min-h-[45px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
              classNameWrapper='w-full mb-2'
              placeholder='Select option...'
            />
          )}
        />
        <Controller
          control={control}
          name='composer'
          render={({ field }) => (
            <SelectorSearch
              shouldValidateSelect
              errorMessage={errors.composer?.message}
              searchValue={searchComposer}
              onSearch={setSearchComposer}
              options={composersData ? composersData.data.data : []}
              selected={field.value}
              onSelected={(option) => {
                field.onChange(option)
                setSearchComposer('')
              }}
              label='Composer:'
              className='min-h-[45px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
              classNameWrapper='w-full mb-2'
              placeholder='Select option...'
            />
          )}
        />
        <Controller
          control={control}
          name='status'
          render={({ field }) => (
            <Radio
              options={STATUS}
              label='Status:'
              errorMessage={errors.status?.message}
              shouldValidateSelect
              selected={field.value}
              onSelected={field.onChange}
            />
          )}
        />

        <div className='mt-5 flex justify-center'>
          <button
            disabled={isLoading}
            type='submit'
            className='ml-2 flex min-w-[5.5rem] items-center gap-1 rounded-lg bg-green-500/80 py-2.5 px-4 text-sm font-medium text-white shadow hover:bg-green-500 hover:drop-shadow-lg'
          >
            {isLoading ? (
              <svg
                aria-hidden='true'
                className='h-5 w-5 animate-spin'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-5 w-5'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            )}
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}

export default Form
