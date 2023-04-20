import { yupResolver } from '@hookform/resolvers/yup'
import { useLayoutEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { changePasswordSchema, userSchema } from '../../../utils/validate.form'
import UploadImage from '../../../components/UploadImage/UploadImage'
import Radio from '../../../components/Radio'
import Input from '../../../components/Input'
import Selector from '../../../components/Selector'
import { useMutation, useQuery } from '@tanstack/react-query'
import roleApi from '../../../apis/role.api'
import { isEqual, omit } from 'lodash'
import Modal from '../../../components/Modal/Modal'
import { MdOutlineClose } from 'react-icons/md'
import authApi from '../../../apis/auth.api'
import { toast } from 'react-toastify'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'

const GENDER = [
  { value: 'MALE', title: 'MALE' },
  { value: 'FEMALE', title: 'FEMALE' },
  { value: 'UNKNOWN', title: 'UNKNOWN' }
]
const Form = ({ user, onSubmit, isLoading }) => {
  const [profileState, setProfileState] = useState()
  const [isShowChangePassModal, setIsShowChangePassModal] = useState(false)
  // react-hook-form
  const {
    reset,
    control,
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(userSchema)
  })

  // update state, form value
  useLayoutEffect(() => {
    const downloadFile = async (url, type) => {
      const data = await (await fetch(url)).blob()
      return new File([data], 'fileUpload', { type: type })
    }
    const initialFormValue = async (user) => {
      if (user !== undefined) {
        const filesDownload = await Promise.all([downloadFile(user.avatarUrl, 'image/jpeg')])
        const userInitial = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roles: user.roles,
          age: user.age,
          gender: user.gender,
          avatar: filesDownload[0]
        }
        reset(userInitial)
        setProfileState(userInitial)
      } else {
        setValue('roles', [])
      }
    }
    initialFormValue(user)
  }, [user, setValue, reset])

  const { data: rolessData } = useQuery({
    queryKey: ['roles'],
    queryFn: () => {
      return roleApi.getRoles({ limit: 999 })
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
    onSubmit(user, data, setError)
  })

  return (
    <>
      <form
        className='border border-x-transparent border-t-gray-300 border-b-transparent py-10'
        onSubmit={handleSubmitForm}
        noValidate
      >
        <div className='grid grid-cols-12 gap-6 p-5 pt-0'>
          <div className='col-span-4 rounded-lg border border-t-slate-200/80 shadow-md'>
            <div className='flex h-full w-full flex-col items-center justify-center gap-5 rounded-lg'>
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
              <span className='max-w-[60%] text-center text-gray-600'>
                Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3.1 MB
              </span>
            </div>
          </div>
          <div className='col-span-8 flex-1 rounded-lg border border-t-slate-200/80 shadow-md'>
            <div className='m-5'>
              <Input
                label='First Name:'
                name='firstName'
                register={register}
                type='text'
                errorMessage={errors.firstName?.message}
                className='w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-900'
                classNameWrapper='w-full mb-2'
                placeholder='Input value...'
              />
              <Input
                label='Last Name:'
                name='lastName'
                register={register}
                type='text'
                errorMessage={errors.lastName?.message}
                className='w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-900'
                classNameWrapper='w-full mb-2'
                placeholder='Input value...'
              />
              <Input
                label='Email:'
                name='email'
                register={register}
                type='email'
                errorMessage={errors.email?.message}
                className='w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-900'
                classNameWrapper='w-full mb-2'
                placeholder='Input value...'
              />
              <Controller
                control={control}
                name='roles'
                render={({ field }) => (
                  <Selector
                    label='Roles:'
                    errorMessage={errors.roles?.message}
                    shouldValidateSelect
                    hasMultipleValue
                    className='min-h-[45px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
                    classNameWrapper='w-full mb-2'
                    placeholder='Select option...'
                    options={rolessData ? rolessData.data.data : []}
                    selected={field.value}
                    onSelected={(option) => {
                      const newValue = [...toggleArrayElement(field.value, option)]
                      field.onChange(newValue)
                    }}
                  />
                )}
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
              <div className='flex items-end justify-end'>
                {!isEqual({ ...watch(), age: +watch().age }, profileState) && (
                  <button
                    disabled={isLoading}
                    type='submit'
                    className='ml-2 flex min-w-[5.5rem] items-center gap-1 rounded-lg bg-blue-500/80 py-2.5 px-4 text-sm font-medium text-white shadow hover:bg-green-500 hover:drop-shadow-lg'
                  >
                    {isLoading && (
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
                    )}
                    Save changes
                  </button>
                )}
                <button
                  type='button'
                  onClick={() => setIsShowChangePassModal(true)}
                  className='ml-2 flex min-w-[5.5rem] items-center gap-1 rounded-lg bg-green-500/80 py-2.5 px-4 text-sm font-medium text-white shadow hover:bg-green-500 hover:drop-shadow-lg'
                >
                  Change password
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      {isShowChangePassModal && (
        <Modal onClose={() => setIsShowChangePassModal(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative flex h-[28rem] w-[40rem] flex-col rounded-lg bg-white px-4 pt-10 pb-8`}
          >
            <span
              onClick={() => setIsShowChangePassModal(false)}
              className='absolute right-3 top-3 inline-flex cursor-pointer items-center justify-center font-[30px] text-red-400'
            >
              <MdOutlineClose size={32} />
            </span>
            <FormChangePassword onClose={() => setIsShowChangePassModal(false)} />
          </div>
        </Modal>
      )}
    </>
  )
}

export default Form

const FormChangePassword = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(changePasswordSchema)
  })

  const changePassMutation = useMutation({
    mutationFn: (body) => authApi.changePassword(body)
  })

  const handleSubmitForm = handleSubmit(async (data) => {
    const body = omit(data, ['confirm_newPassword'])
    changePassMutation.mutate(body, {
      onSuccess: (data) => {
        onClose()
        toast.done('Change password success')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError(error)) {
          const formError = error.response?.data?.error
          if (formError) {
            Object.keys(formError).forEach((key) =>
              setError(key, {
                message: formError[key]
              })
            )
          }
        }
      }
    })
  })
  return (
    <form onSubmit={handleSubmitForm} noValidate>
      <div className='m-4 mt-7 grid grid-cols-12 gap-6 rounded-lg'>
        <div className='col-span-12'>
          <Input
            label='Old password:'
            name='password'
            register={register}
            type='password'
            errorMessage={errors.password?.message}
            className='w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-900'
            classNameWrapper='w-full mb-2'
            placeholder='Input value...'
          />
          <Input
            label='New password:'
            name='newPassword'
            register={register}
            type='password'
            errorMessage={errors.newPassword?.message}
            className='w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-900'
            classNameWrapper='w-full mb-2'
            placeholder='Input value...'
          />
          <Input
            label='Comfirm new password:'
            name='confirm_newPassword'
            register={register}
            type='password'
            errorMessage={errors.confirm_newPassword?.message}
            className='w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-900'
            classNameWrapper='w-full mb-2'
            placeholder='Input value...'
          />
          <div className='flex items-center justify-center'>
            <button
              disabled={changePassMutation.isLoading}
              type='submit'
              className='ml-2 flex min-w-[5.5rem] items-center gap-1 rounded-lg bg-green-500/80 py-2.5 px-4 text-sm font-medium text-white shadow hover:bg-green-500 hover:drop-shadow-lg'
            >
              {changePassMutation.isLoading && (
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
              )}
              Confirm
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
