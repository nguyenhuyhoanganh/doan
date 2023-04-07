import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import fileApi from '../../../apis/file.api'
import PATH from '../../../constants/paths'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { toast } from 'react-toastify'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import Form from '../components/Form'
import albumApi from '../../../apis/album.api'

const AlbumEdit = () => {
  const navigate = useNavigate()
  const { slug, id } = useParams()
  const [album, setAlbum] = useState()

  // fetch artist
  const { data } = useQuery({
    queryKey: ['album', { ...id }],
    queryFn: () => {
      return albumApi.getAlbumById(id)
    }
  })

  useEffect(() => {
    setAlbum(data?.data?.data)
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
  const modifyAlbumMutation = useMutation({
    mutationFn: (data) => albumApi.modifyAlbum(data.id, data.album)
  })

  const handleSubmit = async (album, data, setError) => {
    const { backgroundImage, title, description } = data
    const uploadResponse = await uploadFilesMutation.mutateAsync([backgroundImage])
    const backgroundImageUrl = uploadResponse[0] !== undefined ? uploadResponse[0].data.data.download_url : undefined
    const body = {
      title,
      slug: album.slug,
      backgroundImageUrl: backgroundImageUrl !== undefined ? backgroundImageUrl : album.backgroundImageUrl,
      description
    }

    modifyAlbumMutation.mutate(
      { id: album.id, album: body },
      {
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
      }
    )
  }

  return (
    <>
      <HeaderBreadcrumbs
        title={`Edit album:  ${album && album.title}`}
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
            title: 'Edit',
            to: `${PATH.dashboard.album.root}/modify/${slug}/${id}`
          }
        ]}
      />
      <Form album={album} onSubmit={handleSubmit} isLoading={modifyAlbumMutation.isLoading} />
    </>
  )
}

export default AlbumEdit
