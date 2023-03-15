import { useEffect, useRef } from 'react'
import { useState } from 'react'

const Selector = ({ placeHolder, options, selected, onSelected }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [ref])

  return (
    <div className='relative w-full' ref={ref}>
      <div
        onClick={() => setOpen(!open)}
        className={`flex h-[40px] w-full items-center justify-between rounded-lg border border-gray-300 bg-gray-50 p-[10px] text-sm ${
          !selected ? 'text-gray-400' : 'text-gray-900'
        }`}
      >
        {selected
          ? selected?.title?.length > 25
            ? selected?.title?.substring(0, 25) + '...'
            : selected?.title
          : placeHolder || 'Select option...'}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className={`h-5 w-5 ${open && 'rotate-180'} transition`}
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
      </div>
      <ul
        className={`absolute inset-x-0 top-full z-50 mt-1 overflow-y-auto rounded-b-lg bg-white transition-all ${
          open ? 'max-h-60 border border-gray-300 border-t-transparent' : 'max-h-0 border-none opacity-0'
        } `}
      >
        {options?.map((option, index) => (
          <li
            key={index}
            className={`block p-2 text-sm hover:bg-gray-100 hover:text-gray-900 ${
              option.title.toLowerCase() === selected?.title?.toLowerCase() && 'bg-gray-100 text-gray-900'
            }`}
            onClick={() => {
              if (option.title.toLowerCase() !== selected?.title.toLowerCase()) {
                onSelected(option)
                setOpen(false)
              }
            }}
          >
            {option.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Selector
