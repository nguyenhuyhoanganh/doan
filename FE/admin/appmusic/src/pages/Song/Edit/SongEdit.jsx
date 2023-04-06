import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import fileApi from '../../../apis/file.api'
import songApi from '../../../apis/song.api'
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs/HeaderBreadcrumbs'
import PATH from '../../../constants/paths'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import Form from '../components/Form'

const SongEdit = () => {
  const navigate = useNavigate()
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
  const modifySongMutation = useMutation({
    mutationFn: (data) => songApi.modifySong(data.id, data.song)
  })

  const handleSubmit = async (song, data, setError) => {
    const { image, backgroundImage, audio, artists, categories, composer, status, title, album, description } = data
    const uploadResponse = await uploadFilesMutation.mutateAsync([image, backgroundImage, audio])
    const imageUrl = uploadResponse[0] !== undefined ? uploadResponse[0].data.data.download_url : undefined
    const backgroundImageUrl = uploadResponse[1] !== undefined ? uploadResponse[1].data.data.download_url : undefined
    const { download_url: sourceUrl, duration } =
      uploadResponse[2] !== undefined ? uploadResponse[2].data.data : { download_url: undefined, duration: undefined }
    const body = {
      title: title,
      slug: song.slug,
      status: status,
      duration: duration !== undefined ? duration : song.duration,
      imageUrl: imageUrl !== undefined ? imageUrl : song.imageUrl,
      backgroundImageUrl: backgroundImageUrl !== undefined ? backgroundImageUrl : song.backgroundImageUrl,
      description: description,
      sourceUrls: sourceUrl !== undefined ? [sourceUrl] : song.sourceUrls,
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

    modifySongMutation.mutate(
      { id: song.id, song: body },
      {
        onSuccess: () => {
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
      }
    )
  }

  return (
    <>
      <HeaderBreadcrumbs
        title={`Edit song: ${song && song.title}`}
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
      <Form song={song} onSubmit={handleSubmit} isLoading={modifySongMutation.isLoading} />
    </>
  )
}

export default SongEdit
