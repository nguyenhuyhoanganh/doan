import { useNavigate } from 'react-router-dom'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import PATH from '../../../constants/paths'
import Form from '../components/Form'
import { useMutation } from '@tanstack/react-query'
import fileApi from '../../../apis/file.api'
import albumApi from '../../../apis/album.api'
import slugify from 'slugify'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { toast } from 'react-toastify'

const AlbumCreate = () => {
  const navigate = useNavigate()

  // mutation
  const uploadFilesMutation = useMutation({
    mutationFn: async (files) => {
      const fileUploadPromises = files.map((file) => fileApi.uploadFile(file))
      const results = await Promise.all(fileUploadPromises)
      return results
    }
  })
  const createAlbumMutation = useMutation({
    mutationFn: (album) => albumApi.createAlbum(album)
  })

  const handleSubmit = async (_, data, setError) => {
    const { backgroundImage, title, description } = data
    const uploadResponse = await uploadFilesMutation.mutateAsync([backgroundImage])
    const backgroundImageUrl = uploadResponse[0].data.data.download_url
    const body = {
      title: title,
      slug: slugify(title),
      backgroundImageUrl,
      description
    }
    createAlbumMutation.mutate(body, {
      onSuccess: () => {
        navigate(PATH.dashboard.album.root)
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
        title='Create a new album'
        links={[
          {
            title: 'Dashboard',
            to: PATH.dashboard.root
          },
          {
            title: 'Album',
            to: PATH.dashboard.album.root
          },
          {
            title: 'Create',
            to: PATH.dashboard.album.create
          }
        ]}
      />
      <Form onSubmit={handleSubmit} isLoading={createAlbumMutation.isLoading} />
    </>
  )
}

export default AlbumCreate
