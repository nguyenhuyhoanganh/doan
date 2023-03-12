import classNames from 'classnames/bind'

import styles from './Icons.module.scss'

const cx = classNames.bind(styles)

export const Loader = ({ white }) => (
  <div className={cx('lds-spinner', { white })}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
)

export const LoaderPage = () => <div className={cx('lds-hourglass')}></div>

export const Spiner = ({ size }) => {
  return (
    <svg
      className={`h-${size} w-${size} animate-spin text-white`}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M12 4.75V6.25'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>
      <path
        d='M17.1266 6.87347L16.0659 7.93413'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>
      <path
        d='M19.25 12L17.75 12'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>
      <path
        d='M17.1266 17.1265L16.0659 16.0659'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>
      <path
        d='M12 17.75V19.25'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>
      <path
        d='M7.9342 16.0659L6.87354 17.1265'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>
      <path
        d='M6.25 12L4.75 12'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      ></path>
      <path
        d='M7.9342 7.93413L6.87354 6.87347'
        stroke='currentColor'
        strokeWidth='1.5'
        strokewinecap='round'
        strokewinejoin='round'
      ></path>
    </svg>
  )
}
