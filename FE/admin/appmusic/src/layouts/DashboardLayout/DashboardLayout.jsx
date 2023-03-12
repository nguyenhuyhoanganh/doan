import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Aside from './Aside'

const DashboardLayout = () => {
  const [isOpenAside, setIsOpenAside] = useState(true)
  const toggleAsideHandle = () => setIsOpenAside((prevState) => !prevState)

  return (
    <>
      <Header onToggleAside={toggleAsideHandle} />
      <Aside isOpenAside={isOpenAside} />
      <div className={`p-4 px-14 pt-[4.75rem] transition-all duration-300 ease-linear ${isOpenAside && 'sm:ml-64'}`}>
        <Outlet />
        <Footer />
      </div>
    </>
  )
}

export default DashboardLayout
