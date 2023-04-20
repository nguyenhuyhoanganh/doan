import { yupResolver } from '@hookform/resolvers/yup'
import { useLayoutEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { artistSchema } from '../../../utils/validate.form'
import Input from '../../../components/Input'
import RichText from '../../../components/RichText/RichText'
import UploadImage from '../../../components/UploadImage/UploadImage'
import Radio from '../../../components/Radio'

const GENDER = [
  { value: 'MALE', title: 'MALE' },
  { value: 'FEMALE', title: 'FEMALE' },
  { value: 'UNKNOWN', title: 'UNKNOWN' }
]
const Form = ({ artist, onSubmit, isLoading }) => {
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
    resolver: yupResolver(artistSchema)
  })

  // update state, form value
  useLayoutEffect(() => {
    const downloadFile = async (url, type) => {
      const data = await (await fetch(url)).blob()
      return new File([data], 'fileUpload', { type: type })
    }
    const initialFormValue = async (artist) => {
      if (artist !== undefined) {
        const filesDownload = await Promise.all([
          downloadFile(artist.avatarUrl, 'image/jpeg'),
          downloadFile(artist.backgroundImageUrl, 'image/jpeg')
        ])
        const artistInitial = {
          fullName: artist.fullName,
          age: artist.age,
          gender: artist.gender,
          description: artist.description,
          avatar: filesDownload[0],
          backgroundImage: filesDownload[1]
        }
        reset(artistInitial)
      }
    }
    initialFormValue(artist)
  }, [artist, setValue, reset])

  // submit form
  const handleSubmitForm = handleSubmit(async (data) => {
    onSubmit(artist, data, setError)
  })

  return (
    <form
      className='border border-x-transparent border-t-gray-300 border-b-transparent py-10 '
      onSubmit={handleSubmitForm}
      noValidate
    >
      <div className='grid grid-cols-12 gap-6 rounded-lg border border-t-slate-200/80 p-5 shadow-md'>
        <div className='col-span-5'>
          <div className='flex w-full items-center justify-center gap-5 rounded-lg'>
            <Controller
              control={control}
              name='avatar'
              render={({ field }) => (
                <UploadImage
                  title='Upload avatar'
                  className='w-36 rounded-full'
                  value={field.value}
                  onChange={field.onChange}
                  hasError={errors.avatar?.message !== undefined}
                  errorMessage={errors.avatar?.message}
                />
              )}
            />
          </div>
          <div className='mt-[2px]'>
            <Input
              label='Full Name:'
              name='fullName'
              register={register}
              type='text'
              errorMessage={errors.fullName?.message}
              className='w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-900'
              classNameWrapper='w-full mb-2'
              placeholder='Input value...'
            />
            <Input
              label='Age:'
              name='age'
              register={register}
              type='number'
              errorMessage={errors.age?.message}
              className='w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-900'
              classNameWrapper='w-full mb-2'
              placeholder='Input value...'
            />
            <Controller
              control={control}
              name='gender'
              render={({ field }) => (
                <Radio
                  options={GENDER}
                  label='Gender:'
                  errorMessage={errors.gender?.message}
                  shouldValidateSelect
                  selected={field.value}
                  onSelected={field.onChange}
                />
              )}
            />
          </div>
        </div>
        <div className='col-span-7'>
          <div className={`ml-2 mb-2`}>
            <label>Description:</label>
          </div>
          <Controller
            control={control}
            name='description'
            render={({ field }) => <RichText value={field.value} onChange={field.onChange} />}
          />
          <div>
            <div className={`ml-1 mb-1 ${errors.backgroundImage?.message !== undefined && 'text-red-600'}`}>
              <label>Background:</label>
            </div>
            <div className='flex w-full items-center justify-between gap-5 rounded-lg'>
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
        <div className='col-span-12 mt-5 flex justify-center'>
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
