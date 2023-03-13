import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import PATH from '../../../constants/paths'

const SongCreate = () => {
  return (
    <>
      <HeaderBreadcrumbs
        title='Create a new song'
        links={[
          {
            title: 'Dashboard',
            to: PATH.dashboard.root
          },
          {
            title: 'Song',
            to: PATH.dashboard.song.root
          },
          {
            title: 'Create',
            to: PATH.dashboard.song.create
          }
        ]}
      />
    </>
  )
}

export default SongCreate
