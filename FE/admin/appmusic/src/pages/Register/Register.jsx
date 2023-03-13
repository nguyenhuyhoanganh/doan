import { NavLink, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useContext } from 'react'

import { registerSchema } from '../../utils/validate.form'
import Input from '../../components/Input'
import authApi from '../../apis/auth.api'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import { AppContext } from '../../contexts/app.context'
import Button from '../../components/Button'
import PATH from '../../constants/paths'

const Register = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerSchema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body) => authApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate(PATH.dashboard.root)
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
    <div className='max-h-[44.25rem] bg-banner-image bg-cover bg-center'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl font-semibold text-gray-600'>Register</div>
              <Input
                name='email'
                register={register}
                type='email'
                className='mt-2'
                errorMessage={errors.email?.message}
                placeholder='Email'
              />
              <Input
                name='password'
                register={register}
                type='password'
                className='mt-2'
                errorMessage={errors.password?.message}
                placeholder='Password'
              />
              <Input
                name='confirm_password'
                register={register}
                type='password'
                className='mt-2'
                errorMessage={errors.confirm_password?.message}
                placeholder='Confirm Password'
              />
              <div className='mt-2'>
                <Button
                  type='submit'
                  className='w-full bg-main-color py-4 px-2 text-center text-sm uppercase text-white hover:bg-main-color/80'
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                >
                  Register
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Have an account?</span>
                <NavLink className='ml-1 text-main-color hover:underline hover:underline-offset-1' to={PATH.auth.login}>
                  Login
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
