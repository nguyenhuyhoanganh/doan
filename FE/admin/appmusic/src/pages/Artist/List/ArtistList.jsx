import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import PATH from '../../../constants/paths'

const ArtistList = () => {
  return (
    <>
      <HeaderBreadcrumbs
        title='Artist List'
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
            title: 'List',
            to: PATH.dashboard.artist.root
          }
        ]}
      />
    </>
  )
}

export default ArtistList
