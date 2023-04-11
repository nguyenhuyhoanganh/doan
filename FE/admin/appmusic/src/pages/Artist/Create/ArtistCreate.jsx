import { useNavigate } from 'react-router-dom'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import PATH from '../../../constants/paths'
import Form from '../components/Form'
import { useMutation } from '@tanstack/react-query'
import fileApi from '../../../apis/file.api'
import artistApi from '../../../apis/artist.api'
import slugify from 'slugify'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { toast } from 'react-toastify'

const ArtistCreate = () => {
  const navigate = useNavigate()

  // mutation
  const uploadFilesMutation = useMutation({
    mutationFn: async (files) => {
      const fileUploadPromises = files.map((file) => fileApi.uploadFile(file))
      const results = await Promise.all(fileUploadPromises)
      return results
    }
  })
  const createArtistMutation = useMutation({
    mutationFn: (artist) => artistApi.createArtist(artist)
  })

  const handleSubmit = async (_, data, setError) => {
    const { avatar, backgroundImage, fullName, age, gender, description } = data
    const uploadResponse = await uploadFilesMutation.mutateAsync([avatar, backgroundImage])
    const avatarUrl = uploadResponse[0].data.data.download_url
    const backgroundImageUrl = uploadResponse[1].data.data.download_url
    const body = {
      fullName: fullName,
      age: age,
      slug: slugify(fullName),
      gender: gender,
      avatarUrl,
      backgroundImageUrl,
      description
    }
    createArtistMutation.mutate(body, {
      onSuccess: (data) => {
        navigate(PATH.dashboard.artist.root)
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
      <Form onSubmit={handleSubmit} isLoading={createArtistMutation.isLoading} />
    </>
  )
}

export default ArtistCreate
