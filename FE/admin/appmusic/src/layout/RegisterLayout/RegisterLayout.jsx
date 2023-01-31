import Footer from '../../component/Footer'
import RegisterHeader from '../../component/RegisterHeader'

const RegisterLayout = ({ children }) => {
  return (
    <div>
      <RegisterHeader />
      {children}
      <Footer />
    </div>
  )
}

export default RegisterLayout
