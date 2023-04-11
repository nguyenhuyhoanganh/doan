import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import artistApi from '../../../apis/artist.api'
import fileApi from '../../../apis/file.api'
import PATH from '../../../constants/paths'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { toast } from 'react-toastify'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import Form from '../components/Form'

const ArtistEdit = () => {
  const navigate = useNavigate()
  const { slug, id } = useParams()
  const [artist, setArtist] = useState()

  // fetch artist
  const { data } = useQuery({
    queryKey: ['artist', { ...id }],
    queryFn: () => {
      return artistApi.getArtistById(id)
    }
  })

  useEffect(() => {
    setArtist(data?.data?.data)
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
    mutationFn: (data) => artistApi.modifyArtist(data.id, data.artist)
  })

  const handleSubmit = async (artist, data, setError) => {
    const { avatar, backgroundImage, fullName, age, gender, description } = data
    const uploadResponse = await uploadFilesMutation.mutateAsync([avatar, backgroundImage])
    const avatarUrl = uploadResponse[0] !== undefined ? uploadResponse[0].data.data.download_url : undefined
    const backgroundImageUrl = uploadResponse[1] !== undefined ? uploadResponse[1].data.data.download_url : undefined
    const body = {
      fullName: fullName,
      age: age,
      slug: artist.slug,
      gender: gender,
      avatarUrl: avatarUrl !== undefined ? avatarUrl : artist.avatarUrl,
      backgroundImageUrl: backgroundImageUrl !== undefined ? backgroundImageUrl : artist.backgroundImageUrl,
      description: description
    }

    modifyArtistMutation.mutate(
      { id: artist.id, artist: body },
      {
        onSuccess: () => {
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
      }
    )
  }

  return (
    <>
      <HeaderBreadcrumbs
        title={`Edit artist:  ${artist && artist.fullName}`}
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
            title: 'Edit',
            to: `${PATH.dashboard.artist.root}/modify/${slug}/${id}`
          }
        ]}
      />
      <Form artist={artist} onSubmit={handleSubmit} isLoading={modifyArtistMutation.isLoading} />
    </>
  )
}

export default ArtistEdit
