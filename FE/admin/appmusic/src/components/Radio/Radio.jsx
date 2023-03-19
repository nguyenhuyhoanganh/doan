import { useId } from 'react'

const Radio = ({ options, label, errorMessage, shouldValidateSelect, selected, onSelected }) => {
  const id = useId()
  return (
    <>
      <div className='flex items-center justify-between'>
        {label && (
          <div className={`ml-1 mt-[2px] ${errorMessage && 'text-red-600'}`}>
            <label htmlFor={id}>{label}</label>
          </div>
        )}

        <div className='flex w-full items-center justify-center gap-4'>
          {options.map((option, index) => (
            <div className='flex items-center' key={index}>
              <input
                id={id}
                type='radio'
                value={option.value}
                onChange={() => onSelected(option.value)}
                checked={selected === option.value}
                name='inline-radio-group'
                className='h-4 w-4'
              />
              <label
                htmlFor='inline-radio'
                className={`ml-2 mt-[2px] text-base font-medium 
                ${option.value === selected ? 'text-gray-900 ' : 'text-gray-400 '}
                ${errorMessage !== undefined && 'text-red-600'}`}
              >
                {option.title}
              </label>
            </div>
          ))}
        </div>
      </div>
      {shouldValidateSelect && <div className='mt-1 ml-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>}
    </>
  )
}

export default Radio
