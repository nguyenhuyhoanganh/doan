import { useNavigate } from 'react-router-dom'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import PATH from '../../../constants/paths'
import Form from '../components/Form'
import { useMutation } from '@tanstack/react-query'
import fileApi from '../../../apis/file.api'
import composerApi from '../../../apis/composer.api'
import slugify from 'slugify'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { toast } from 'react-toastify'

const ComposerCreate = () => {
  const navigate = useNavigate()

  // mutation
  const uploadFilesMutation = useMutation({
    mutationFn: async (files) => {
      const fileUploadPromises = files.map((file) => fileApi.uploadFile(file))
      const results = await Promise.all(fileUploadPromises)
      return results
    }
  })
  const createComposerMutation = useMutation({
    mutationFn: (composer) => composerApi.createComposer(composer)
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
    createComposerMutation.mutate(body, {
      onSuccess: (data) => {
        navigate(PATH.dashboard.composer.root)
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
        title='Create a new composer'
        links={[
          {
            title: 'Dashboard',
            to: PATH.dashboard.root
          },
          {
            title: 'Composer',
            to: PATH.dashboard.composer.root
          },
          {
            title: 'Create',
            to: PATH.dashboard.composer.create
          }
        ]}
      />
      <Form onSubmit={handleSubmit} isLoading={createComposerMutation.isLoading} />
    </>
  )
}

export default ComposerCreate
