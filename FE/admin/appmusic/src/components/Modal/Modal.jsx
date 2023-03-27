import { useEffect } from 'react'
import { createPortal } from 'react-dom'

let modalRoot = document.querySelector('#modal-root')

if (!modalRoot) {
  const modalRootDiv = document.createElement('div')
  modalRootDiv.id = 'modal-root'
  document.body.appendChild(modalRootDiv)
  modalRoot = modalRootDiv
}

const Modal = ({ onClose, children }) => {
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
      {children}
    </div>,
    modalRoot
  )
}

export default Modal
