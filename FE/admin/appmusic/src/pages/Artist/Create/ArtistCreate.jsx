import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import PATH from '../../../constants/paths'

const ArtistCreate = () => {
  return (
    <>
      <HeaderBreadcrumbs
        title='Create a new artist'
        links={[
          {
            title: 'Dashboard',
            to: PATH.dashboard.root
          },
          {
            title: 'Artist',
            to: PATH.dashboard.artist.root
          },
          {
            title: 'Create',
            to: PATH.dashboard.artist.create
          }
        ]}
      />
    </>
  )
}

export default ArtistCreate
