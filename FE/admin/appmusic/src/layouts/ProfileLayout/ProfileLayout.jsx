import { Outlet } from 'react-router-dom'

import Footer from '../../components/Footer'
import Header from '../../components/Header'

const ProfileLayout = () => {
  return (
    <>
      <Header />
      <div className={`p-4 pt-[4.75rem]`}>
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default ProfileLayout
