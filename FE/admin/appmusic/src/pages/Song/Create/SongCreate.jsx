import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import slugify from 'slugify'
import fileApi from '../../../apis/file.api'
import songApi from '../../../apis/song.api'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import PATH from '../../../constants/paths'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import Form from '../components/Form'

const SongCreate = () => {
  const navigate = useNavigate()

  // mutation
  const uploadFilesMutation = useMutation({
    mutationFn: async (files) => {
      const fileUploadPromises = files.map((file) => fileApi.uploadFile(file))
      const results = await Promise.all(fileUploadPromises)
      return results
    }
  })
  const createSongMutation = useMutation({
    mutationFn: (song) => songApi.createSong(song)
  })

  const handleSubmit = async (_, data, setError) => {
    const { image, backgroundImage, audio, artists, categories, composer, status, title, album, description } = data
    const uploadResponse = await uploadFilesMutation.mutateAsync([image, backgroundImage, audio])
    const imageUrl = uploadResponse[0].data.data.download_url
    const backgroundImageUrl = uploadResponse[1].data.data.download_url
    const { download_url: sourceUrl, duration } = uploadResponse[2].data.data
    const body = {
      title: title,
      slug: slugify(title),
      status: status,
      duration,
      imageUrl,
      backgroundImageUrl,
      description,
      sourceUrls: [sourceUrl],
      categories: categories.map((category) => {
        return {
          id: category.id
        }
      }),
      artists: artists.map((artist) => {
        return {
          id: artist.id
        }
      }),
      composer: { id: composer.id },
      album: { id: album.id }
    }
    createSongMutation.mutate(body, {
      onSuccess: (data) => {
        navigate(PATH.dashboard.song.root)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError(error)) {
          const formError = error.response?.data?.error
          if (formError) {
            Object.keys(formError).forEach((key) =>
              setError(key, {
                message: formError[key]
              })
            )
          } else toast(error.response?.message)
        }
      }
    })
  }

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
      <Form onSubmit={handleSubmit} isLoading={createSongMutation.isLoading} />
    </>
  )
}

export default SongCreate
