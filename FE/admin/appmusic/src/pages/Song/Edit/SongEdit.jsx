import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import songApi from '../../../apis/song.api'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import PATH from '../../../constants/paths'
import Form from './Form'

const SongEdit = () => {
  const { slug, id } = useParams()
  const [song, setSong] = useState()

  // fetch songs
  const { data } = useQuery({
    queryKey: ['songs', { ...id }],
    queryFn: () => {
      return songApi.getSongById(id)
    }
  })

  useEffect(() => {
    setSong(data?.data?.data)
  }, [data])

  return (
    <>
      <HeaderBreadcrumbs
        title={`Edit song:`}
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
            title: 'Edit',
            to: `${PATH.dashboard.song.root}/edit/${slug}/${id}`
          }
        ]}
      />
      <Form song={song} />
    </>
  )
}

export default SongEdit
