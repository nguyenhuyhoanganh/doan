import { NavLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const Login = () => {
  const {
    // register,
    // formState: { errors },
    handleSubmit
  } = useForm()

  const onSubmit = handleSubmit((data) => {})
  return (
    // bg-hero-pattern bg-cover
    <div className='bg-green'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit}>
              <div className='text-2xl font-semibold text-gray-600'>Login</div>
              <div className='mt-8'>
                <input
                  type='email'
                  className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
                  placeholder='Email'
                />
                <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'></div>
              </div>
              <div className='mt-2'>
                <input
                  type='password'
                  autoComplete='on'
                  className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'
                  placeholder='Passowrd'
                />
                <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'></div>
              </div>
              <div className='mt-2'>
                <button
                  type='submit'
                  className='w-full bg-green-weight py-4 px-2 text-center text-sm uppercase text-white hover:bg-green-light'
                >
                  Login
                </button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Don't have an account?</span>
                <NavLink className='ml-1 text-green hover:underline hover:underline-offset-1' to='/register'>
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
