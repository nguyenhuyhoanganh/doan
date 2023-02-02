import Header from '../../component/Header'
import Footer from '../../component/Footer'

const MainLayout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default MainLayout
