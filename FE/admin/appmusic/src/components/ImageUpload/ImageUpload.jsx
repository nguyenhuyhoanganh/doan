import React, { useState, useRef } from 'react'

const ImageUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([])
  const inputRef = useRef(null)

  const handleFileChange = (event) => {
    setSelectedFiles([...selectedFiles, ...event.target.files])
    inputRef.current.value = ''
  }

  const handleDelete = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  return (
    <div className='flex flex-col items-center'>
      <input type='file' ref={inputRef} onChange={handleFileChange} className='hidden' multiple />
      <div className='flex cursor-pointer flex-row items-center'>
        <button
          className='rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-700'
          onClick={() => inputRef.current.click()}
        >
          Choose Files
        </button>
        <span className='ml-2 text-sm text-gray-600'>(Click to select files)</span>
      </div>
      <div className='mt-4 flex flex-row flex-wrap'>
        {selectedFiles.map((file, index) => (
          <div
            key={index}
            className='relative m-2 h-32 w-32 bg-cover bg-center'
            style={{ backgroundImage: `url(${URL.createObjectURL(file)})` }}
          >
            <button className='absolute top-0 right-0 m-2' onClick={() => handleDelete(index)}>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
              >
                <line x1='18' y1='6' x2='6' y2='18'></line>
                <line x1='6' y1='6' x2='18' y2='18'></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageUpload
