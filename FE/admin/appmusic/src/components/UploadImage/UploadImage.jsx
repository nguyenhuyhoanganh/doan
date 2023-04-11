import { useMemo, useRef } from 'react'

const UploadImage = ({
  className = 'w-36 rounded-lg',
  size = 'medium',
  title,
  value,
  onChange,
  hasError,
  errorMessage
}) => {
  const ref = useRef(null)
  const handelChange = (event) => {
    event.target.files.length !== 0 && onChange(event.target.files[0])
  }
  const handelDelete = () => {
    onChange(undefined)
  }
  const previewUrl = useMemo(() => {
    return value ? URL.createObjectURL(value) : null
  }, [value])

  return (
    <div
      className={`m-3 mt-0 flex flex-col items-center justify-between ${className} 
      ${size === 'medium' && 'h-48'} ${size === 'large' && 'h-72'}`}
    >
      <div
        className={`group relative m-3 outline-dashed outline-1 outline-offset-[12px]  ${className} 
      ${hasError === true ? 'bg-red-100/50 outline-red-600/80' : 'bg-gray-100 outline-gray-400/80 '}
      ${size === 'medium' && 'h-36'} ${size === 'large' && 'h-60'}`}
        onClick={() => ref.current.click()}
      >
        {value instanceof File && (
          <div
            className={`absolute top-1/2 left-1/2 z-30  -translate-x-1/2 -translate-y-1/2 transform bg-cover bg-center 
            ${size === 'medium' && 'h-36'} ${size === 'large' && 'h-60'} ${className}`}
            style={{ backgroundImage: `url(${previewUrl})` }}
          >
            <button
              className='absolute top-0 right-0 m-2 text-red-600'
              type='button'
              onClick={(e) => {
                e.stopPropagation()
                handelDelete()
              }}
            >
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line x1='18' y1='6' x2='6' y2='18'></line>
                <line x1='6' y1='6' x2='18' y2='18'></line>
              </svg>
            </button>
          </div>
        )}

        <input type='file' ref={ref} className='hidden' onChange={handelChange} />
        <div
          className={`absolute top-1/2 left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center 
          ${size === 'medium' && 'h-36'} ${size === 'large' && 'h-60'} ${className}`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className={`h-8 w-8 ${
              hasError === true
                ? 'text-red-600 group-hover:text-red-600/80'
                : 'text-gray-500 group-hover:text-gray-500/80'
            }`}
          >
            <path
              fillRule='evenodd'
              d='M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z'
              clipRule='evenodd'
            />
          </svg>
          <span
            className={`ml-1 text-xs font-normal ${
              hasError === true
                ? 'text-red-600 group-hover:text-red-600/80'
                : 'text-gray-500 group-hover:text-gray-500/80'
            }`}
          >
            {title}
          </span>
        </div>
      </div>
      <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
    </div>
  )
}

export default UploadImage
