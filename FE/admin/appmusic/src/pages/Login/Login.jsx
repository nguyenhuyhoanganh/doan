import { NavLink, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'

import { loginSchema } from '../../utils/validate.form'
import Input from '../../components/Input'
import authApi from '../../apis/auth.api'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth.context'
import Button from '../../components/Button'
import PATH from '../../constants/paths'

const Login = () => {
  const { setIsAuthenticated, setProfile } = useContext(AuthContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema)
  })

  const loginMutation = useMutation({
    // login được check trong axios
    // nếu login thành công => set profile vào localstorage
    // => set accesstoken, refreshtoken vào localstorage
    mutationFn: (body) => authApi.login(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      // login thành công
      onSuccess: (data) => {
        // set isAuthenticated = true trong context
        setIsAuthenticated(true)
        // save profile user vào context
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
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-[10.5rem] lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl font-semibold text-gray-600'>Login</div>
              <Input
                name='email'
                register={register}
                type='email'
                className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:shadow-sm'
                errorMessage={errors.email?.message}
                placeholder='Email'
              />
              <Input
                name='password'
                register={register}
                type='password'
                className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:shadow-sm'
                errorMessage={errors.password?.message}
                placeholder='Password'
              />
              <div className='mt-2'>
                <Button
                  type='submit'
                  className='w-full bg-main-color py-4 px-2 text-center text-sm uppercase text-white hover:bg-main-color/80'
                  isLoading={loginMutation.isLoading}
                  disabled={loginMutation.isLoading}
                >
                  Login
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Don't have an account?</span>
                <NavLink
                  className='ml-1 text-main-color hover:underline hover:underline-offset-1'
                  to={PATH.auth.register}
                >
                  Register
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
