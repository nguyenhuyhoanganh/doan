import { useEffect, useRef } from 'react'
import { useState } from 'react'

const Selector = ({
  label,
  placeholder,
  options,
  selected,
  onSelected,
  hasMultipleValue,
  // useForm
  shouldValidateSelect,
  errorMessage,
  // style
  className = 'min-h-[42px] w-full rounded-lg border border-gray-300 bg-gray-50 p-[10px] text-sm',
  classNameError = 'mt-1 ml-1 min-h-[1.25rem] text-sm text-red-600',
  classNameWrapper = 'w-full'
}) => {
  const [open, setOpen] = useState(false)

  // handle close options when click outside
  const selectorRef = useRef(null)
  useEffect(() => {
    function handleClickOutside(event) {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [selectorRef])

  return (
    <div className={classNameWrapper} ref={selectorRef}>
      {label && (
        <div className={`ml-1 mb-1 ${errorMessage && 'text-red-600'}`} onClick={() => setOpen(true)}>
          <span>{label}</span>
        </div>
      )}
      <div className='relative w-full'>
        <div
          onClick={() => setOpen((prev) => !prev)}
          className={`flex items-center justify-between transition-all 
          ${open && !errorMessage && 'border-gray-900 shadow-sm'} ${className} 
          ${!selected || selected.length === 0 ? 'text-gray-400' : 'text-gray-900'} 
          ${errorMessage && '!border-red-600 bg-red-50 text-red-600'}`}
        >
          {selected && selected.length !== 0 ? (
            !hasMultipleValue ? (
              <span className='truncate'>{selected?.title ? selected.title : selected.fullName}</span>
            ) : (
              <div className='flex flex-wrap items-center justify-start gap-1'>
                {selected.map((el, index) => (
                  <div className='max-h-7' key={index}>
                    <Chip
                      content={el?.title ? el?.title : el?.fullName}
                      onDelete={(e) => {
                        e.stopPropagation()
                        onSelected(el)
                      }}
                    />
                  </div>
                ))}
              </div>
            )
          ) : (
            placeholder || 'Select option...'
          )}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className={`h-5 w-5 text-gray-400 transition ${open && 'rotate-180'} ${errorMessage && 'text-red-600'}`}
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
                !(selected instanceof Array) && option?.title === selected?.title && 'bg-gray-100 text-gray-900'
              } ${
                selected instanceof Array &&
                selected?.find((cate) => cate.id === option.id) &&
                'bg-gray-100 text-gray-900'
              }`}
              onClick={() => {
                if (hasMultipleValue) {
                  onSelected(option)
                  setOpen(false)
                } else if (option.title !== selected?.title) {
                  onSelected(option)
                  setOpen(false)
                }
              }}
            >
              {option.title ? option.title : option.fullName}
            </li>
          ))}
        </ul>
      </div>
      {shouldValidateSelect && <div className={classNameError}>{errorMessage}</div>}
    </div>
  )
}

const Chip = ({ content, onDelete }) => {
  return (
    <span
      id='badge-dismiss-green'
      className='inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-sm font-medium text-main-color'
    >
      {content}
      <button
        type='button'
        className='ml-2 inline-flex items-center truncate rounded-full bg-transparent p-0.5 text-sm text-green-400 hover:bg-green-200 hover:text-green-600'
        onClick={onDelete}
      >
        <svg className='h-3.5 w-3.5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
          <path
            fillRule='evenodd'
            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
            clipRule='evenodd'
          ></path>
        </svg>
      </button>
    </span>
  )
}

export default Selector
