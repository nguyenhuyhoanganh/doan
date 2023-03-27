import { useMemo, useRef } from 'react'
import './index.css'

const UploadAudio = ({ value, onChange, hasError, errorMessage }) => {
  const ref = useRef(null)
  const handleChange = (event) => {
    event.target.files.length !== 0 && onChange(event.target.files[0])
  }

  const previewUrl = useMemo(() => {
    return value ? URL.createObjectURL(value) : null
  }, [value])

  return (
    <div className='w-full'>
      <div
        className={`flex w-full items-center transition-all duration-1000 ${value !== undefined && 'justify-between'}`}
      >
        <input type='file' onChange={handleChange} className='hidden' ref={ref} />
        <div
          className={`flex w-full justify-center rounded-3xl border border-gray-300 transition-all ${
            value !== undefined ? 'w-full' : 'w-0 opacity-0'
          }`}
        >
          {value !== undefined && <audio className='h-11 w-[300px]' src={previewUrl} controls />}
        </div>
        <div className={`${value !== undefined ? 'ml-8' : 'ml-0'} flex items-center justify-start transition-all`}>
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-dashed bg-white transition-all 
            ${value !== undefined && 'rotate-45 transform '} 
            ${value !== undefined ? 'border-red-400 text-red-400 ' : 'border-main-color text-green-400 '} 
            ${hasError === true && 'border-red-600 !text-red-600 '}`}
            onClick={() => {
              if (value !== undefined) {
                onChange(undefined)
              } else ref.current.click()
            }}
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='h-7 w-7'>
              <path
                fillRule='evenodd'
                d='M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <span
            className={`ml-2 text-sm font-normal ${hasError === true ? 'text-red-600' : 'text-gray-500'} ${
              value !== undefined && 'ml-0 w-0 opacity-0'
            }`}
          >
            Choose audio...
          </span>
        </div>
      </div>
      <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
    </div>
  )
}

export default UploadAudio
