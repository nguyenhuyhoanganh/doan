import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs'
import PATH from '../../../constants/paths'

const UserEdit = () => {
  return (
    <>
      <HeaderBreadcrumbs
        title={`Edit user: `}
        links={[
          {
            title: 'Dashboard',
            to: PATH.dashboard.root
          },
          {
            title: 'User',
            to: PATH.dashboard.user.root
          },
          {
            title: 'Edit',
            to: PATH.dashboard.user.root
          }
        ]}
      />
    </>
  )
}

export default UserEdit
