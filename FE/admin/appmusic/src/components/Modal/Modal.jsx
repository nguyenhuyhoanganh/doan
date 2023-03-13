import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MdOutlineClose } from 'react-icons/md'

let modalRoot = document.querySelector('#modal-root')

if (!modalRoot) {
  const modalRootDiv = document.createElement('div')
  modalRootDiv.id = 'modal-root'
  document.body.appendChild(modalRootDiv)
  modalRoot = modalRootDiv
}

const Modal = ({ onClose, children, size = '' }) => {
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.code === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleKeydown)
    }
  })
  return createPortal(
    <div className='fixed inset-0 z-[9999] flex items-center justify-center'>
      <div onClick={onClose} className='absolute inset-0 z-[-1] bg-black/60'></div>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`small:max-w-[330px] md:small:h-auto md:medium:max-w-[500px] md:medium:h-auto relative h-[596px] w-full max-w-[900px] sm:h-auto sm:w-[70%] sm:max-w-none ${size}`}
      >
        <span
          onClick={onClose}
          className='absolute right-3 top-3 inline-flex cursor-pointer items-center justify-center font-[30px] text-white'
        >
          <MdOutlineClose />
        </span>
        {children}
      </div>
    </div>,
    modalRoot
  )
}

export default Modal
