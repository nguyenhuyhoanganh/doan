import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import fileApi from '../../../apis/file.api'
import PATH from '../../../constants/paths'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { toast } from 'react-toastify'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import Form from '../components/Form'
import composerApi from '../../../apis/composer.api'

const ComposerEdit = () => {
  const navigate = useNavigate()
  const { slug, id } = useParams()
  const [composer, setComposer] = useState()

  // fetch composer
  const { data } = useQuery({
    queryKey: ['composer', { ...id }],
    queryFn: () => {
      return composerApi.getComposerById(id)
    }
  })

  useEffect(() => {
    setComposer(data?.data?.data)
  }, [data])

  // mutation
  const uploadFilesMutation = useMutation({
    mutationFn: async (files) => {
      const fileUploadPromises = files.map((file) => {
        return file.name !== 'fileUpload' ? fileApi.uploadFile(file) : undefined
      })
      const results = await Promise.all(fileUploadPromises)
      return results
    }
  })
  const modifyArtistMutation = useMutation({
    mutationFn: (data) => composerApi.modifyComposer(data.id, data.composer)
  })

  const handleSubmit = async (composer, data, setError) => {
    const { avatar, backgroundImage, fullName, age, gender, description } = data
    const uploadResponse = await uploadFilesMutation.mutateAsync([avatar, backgroundImage])
    const avatarUrl = uploadResponse[0] !== undefined ? uploadResponse[0].data.data.download_url : undefined
    const backgroundImageUrl = uploadResponse[1] !== undefined ? uploadResponse[1].data.data.download_url : undefined
    const body = {
      fullName: fullName,
      age: age,
      slug: composer.slug,
      gender: gender,
      avatarUrl: avatarUrl !== undefined ? avatarUrl : composer.avatarUrl,
      backgroundImageUrl: backgroundImageUrl !== undefined ? backgroundImageUrl : composer.backgroundImageUrl,
      description: description
    }

    modifyArtistMutation.mutate(
      { id: composer.id, composer: body },
      {
        onSuccess: () => {
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
      }
    )
  }

  return (
    <>
      <HeaderBreadcrumbs
        title={`Edit composer: ${composer && composer.fullName}`}
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
            title: 'Edit',
            to: `${PATH.dashboard.composer.root}/modify/${slug}/${id}`
          }
        ]}
      />
      <Form composer={composer} onSubmit={handleSubmit} isLoading={modifyArtistMutation.isLoading} />
    </>
  )
}

export default ComposerEdit
