import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
// import slugify from 'slugify'

import { songSchema } from '../../../utils/validate.form'
import categoryApi from '../../../apis/category.api'
import artistApi from '../../../apis/artist.api'
import composerApi from '../../../apis/composer.api'
import albumApi from '../../../apis/album.api'
import Input from '../../../components/Input'
import RichText from '../../../components/RichText/RichText'
import Selector from '../../../components/Selector'
import SelectorSearch from '../../../components/SelectorSearch/SelectorSearch'
import Radio from '../../../components/Radio'
import UploadImage from '../../../components/UploadImage/UploadImage'
import UploadAudio from '../../../components/UploadAudio'
import slugify from 'slugify'
import fileApi from '../../../apis/file.api'
import songApi from '../../../apis/song.api'
import { useNavigate } from 'react-router-dom'
import PATH from '../../../constants/paths'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { toast } from 'react-toastify'

const STATUS = [
  { value: 'DRAFT', title: 'DRAFT' },
  { value: 'PUBLIC', title: 'PUBLIC' },
  { value: 'PRIVATE', title: 'PRIVATE' }
]
const Form = ({ song }) => {
  const navigate = useNavigate()
  // react-hook-form
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(songSchema)
  })
  // state
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [statusSelected, setStatusSelected] = useState(null)
  const [categoriesSelected, setCategoriesSelected] = useState([])
  const [description, setDescription] = useState('')
  const [artistsSelected, setArtistsSelected] = useState([])
  const [searchArtist, setSearchArtist] = useState('')
  const [composerSelected, setComposerSelected] = useState(null)
  const [searchComposer, setSearchComposer] = useState('')
  const [albumSelected, setAlbumSelected] = useState(null)
  const [searchAlbum, setSearchAlbum] = useState('')
  const [image, setImage] = useState()
  const [background, setBackground] = useState()
  const [audio, setAudio] = useState()

  useEffect(() => {
    const downloadFile = async (url, type) => {
      const data = await (await fetch(url)).blob()
      return new File([data], 'fileUpload', { type: type })
    }
    const initialState = async (song) => {
      setValue('title', song.title)
      setValue('status', song.status)
      setStatusSelected(song.status)
      setCategoriesSelected(song.categories)
      setDescription(song.description)
      setArtistsSelected(song.artists)
      setComposerSelected(song.composer)
      setAlbumSelected(song.album)
      const filesDownload = await Promise.all([
        downloadFile(song.imageUrl, 'image/jpeg'),
        downloadFile(song.backgroundImageUrl, 'image/jpeg'),
        downloadFile(song?.sourceUrls[0], 'audio/mp3')
      ])
      setImage(filesDownload[0])
      setBackground(filesDownload[1])
      setAudio(filesDownload[2])
    }
    if (song !== undefined) {
      initialState(song)
    }
  }, [song, setValue])

  // fetch all categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories({ limit: 999 })
    }
  })
  // fetch artists
  const { data: artistsData } = useQuery({
    queryKey: ['artists', searchArtist],
    queryFn: () => {
      return artistApi.getArtists({ limit: 5, fullName: searchArtist })
    }
  })
  // fetch composers
  const { data: composersData } = useQuery({
    queryKey: ['composers', searchComposer],
    queryFn: () => {
      return composerApi.getComposers({ limit: 5, fullName: searchComposer })
    }
  })
  // fetch albums
  const { data: albumsData } = useQuery({
    queryKey: ['albums', searchAlbum],
    queryFn: () => {
      return albumApi.getAlbums({ limit: 5, title: searchAlbum })
    }
  })

  const handleSelectStatus = (status) => {
    setStatusSelected(status)
    setValue('status', status)
    isSubmitted === true && trigger('status')
  }

  const toggleArrayElement = (array, element) => {
    const index = array.findIndex((el) => el.id === element.id)
    index !== -1 ? array.splice(index, 1) : array.push(element)
    return array
  }
  const handleSelectCategories = (category) => {
    const newCategories = [...toggleArrayElement(categoriesSelected, category)]
    setCategoriesSelected(newCategories)
  }

  const handleSelectArtists = (artist) => {
    const newArtists = [...toggleArrayElement(artistsSelected, artist)]
    setArtistsSelected(newArtists)
    setSearchArtist('')
  }

  const handleSelectComposer = (composer) => {
    setComposerSelected(composer)
    setSearchComposer('')
  }

  const handleSelectAlbum = (album) => {
    setAlbumSelected(album)
    setSearchAlbum('')
  }

  // update form value
  // trigger error message when submit fail
  useEffect(() => {
    setValue('categories', categoriesSelected)
    isSubmitted === true && trigger('categories')
  }, [categoriesSelected, setValue, trigger, isSubmitted])

  useEffect(() => {
    setValue('artists', artistsSelected)
    isSubmitted === true && trigger('artists')
  }, [artistsSelected, setValue, trigger, isSubmitted])

  useEffect(() => {
    setValue('composer', composerSelected)
    isSubmitted === true && trigger('composer')
  }, [composerSelected, setValue, trigger, isSubmitted])

  useEffect(() => {
    setValue('album', albumSelected)
    isSubmitted === true && trigger('album')
  }, [albumSelected, setValue, trigger, isSubmitted])

  useEffect(() => {
    setValue('image', image)
    isSubmitted === true && trigger('image')
  }, [image, setValue, trigger, isSubmitted])

  useEffect(() => {
    setValue('backgroundImage', background)
    isSubmitted === true && trigger('backgroundImage')
  }, [background, setValue, trigger, isSubmitted])

  useEffect(() => {
    setValue('audio', audio)
    isSubmitted === true && trigger('audio')
  }, [audio, setValue, trigger, isSubmitted])

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

  // submit form
  const onSubmit = handleSubmit(async (data) => {
    const { image, backgroundImage, audio } = data
    const uploadResponse = await uploadFilesMutation.mutateAsync([image, backgroundImage, audio])
    const imageUrl = uploadResponse[0] !== undefined ? uploadResponse[0].data.data.download_url : undefined
    const backgroundImageUrl = uploadResponse[1] !== undefined ? uploadResponse[1].data.data.download_url : undefined
    const { download_url: sourceUrl, duration } =
      uploadResponse[2] !== undefined ? uploadResponse[2].data.data : { download_url: undefined, duration: undefined }
    const random = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .slice(0, 10)
    const body = {
      title: data.title,
      slug: slugify(data.title) + random,
      status: data.status,
      duration: duration !== undefined ? duration : song.duration,
      imageUrl: imageUrl !== undefined ? imageUrl : song.imageUrl,
      backgroundImageUrl: backgroundImageUrl !== undefined ? backgroundImageUrl : song.backgroundImageUrl,
      description,
      sourceUrls: sourceUrl !== undefined ? [sourceUrl] : song.sourceUrls,
      categories: categoriesSelected.map((category) => {
        return {
          id: category.id
        }
      }),
      artists: artistsSelected.map((artist) => {
        return {
          id: artist.id
        }
      }),
      composer: { id: composerSelected.id },
      album: { id: albumSelected.id }
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
  })

  return (
    <form className='mt-2 grid grid-cols-12 gap-2 rounded-md py-10' onSubmit={onSubmit} noValidate>
      <div className='col-span-8 rounded-lg p-5 shadow-md'>
        <Input
          label='Title:'
          name='title'
          register={register}
          type='text'
          errorMessage={errors.title?.message}
          className='w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-900'
          classNameWrapper='w-full mb-2'
          placeholder='Input value...'
        />
        <div className={`ml-1 mb-1`}>
          <label>Description:</label>
        </div>
        <RichText value={description} onChange={setDescription} />
        <div>
          <div
            className={`ml-1 mb-1 ${
              (errors.image?.message !== undefined || errors.backgroundImage?.message !== undefined) && 'text-red-600'
            }`}
          >
            <label>Image:</label>
          </div>
          <div className='flex w-full items-center justify-between gap-5 rounded-lg'>
            <UploadImage
              title='Upload image'
              value={image}
              onChange={setImage}
              hasError={errors.image?.message !== undefined}
              errorMessage={errors.image?.message}
              // url={song?.imageUrl}
            />
            <UploadImage
              className='w-[39rem] rounded-lg'
              title='Upload background image'
              value={background}
              onChange={setBackground}
              hasError={errors.backgroundImage?.message !== undefined}
              errorMessage={errors.backgroundImage?.message}
              // url={song?.backgroundImageUrl}
            />
          </div>
        </div>
      </div>

      <div className='col-span-4 rounded-lg p-5 shadow-md'>
        <div className='mb-2'>
          <div className={`ml-1 mb-1 ${errors.audio?.message !== undefined && 'text-red-600'}`}>
            <label>Audio:</label>
          </div>
          <div className='flex w-full items-center justify-between gap-5 rounded-lg'>
            <UploadAudio
              value={audio}
              onChange={setAudio}
              hasError={errors.audio?.message !== undefined}
              errorMessage={errors.audio?.message}
            />
          </div>
        </div>
        <Selector
          label='Category:'
          errorMessage={errors.categories?.message}
          shouldValidateSelect
          hasMultipleValue
          className='min-h-[45px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
          classNameWrapper='w-full mb-2'
          placeholder='Select option...'
          options={categoriesData ? categoriesData.data.data : []}
          selected={categoriesSelected}
          onSelected={handleSelectCategories}
        />
        <SelectorSearch
          shouldValidateSelect
          errorMessage={errors.album?.message}
          searchValue={searchAlbum}
          onSearch={setSearchAlbum}
          options={albumsData ? albumsData.data.data : []}
          selected={albumSelected}
          onSelected={handleSelectAlbum}
          label='Album:'
          className='min-h-[45px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
          classNameWrapper='w-full mb-2'
          placeholder='Select option...'
        />
        <SelectorSearch
          hasMultipleValue
          shouldValidateSelect
          errorMessage={errors.artists?.message}
          searchValue={searchArtist}
          onSearch={setSearchArtist}
          options={artistsData ? artistsData.data.data : []}
          selected={artistsSelected}
          onSelected={handleSelectArtists}
          label='Artist:'
          className='min-h-[45px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
          classNameWrapper='w-full mb-2'
          placeholder='Select option...'
        />
        <SelectorSearch
          shouldValidateSelect
          errorMessage={errors.composer?.message}
          searchValue={searchComposer}
          onSearch={setSearchComposer}
          options={composersData ? composersData.data.data : []}
          selected={composerSelected}
          onSelected={handleSelectComposer}
          label='Composer:'
          className='min-h-[45px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm'
          classNameWrapper='w-full mb-2'
          placeholder='Select option...'
        />
        <Radio
          options={STATUS}
          label='Status:'
          errorMessage={errors.status?.message}
          shouldValidateSelect
          selected={statusSelected}
          onSelected={handleSelectStatus}
        />
        <div className='mt-5 flex justify-center'>
          <button
            onClick={() => setIsSubmitted(true)}
            disabled={modifySongMutation.isLoading}
            type='submit'
            className='ml-2 flex min-w-[5.5rem] items-center gap-1 rounded-lg bg-green-500/80 py-2.5 px-4 text-sm font-medium text-white shadow hover:bg-green-500 hover:drop-shadow-lg'
          >
            {modifySongMutation?.isLoading ? (
              <svg
                aria-hidden='true'
                className='h-5 w-5 animate-spin'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-5 w-5'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            )}
            Modify
          </button>
        </div>
      </div>
    </form>
  )
}

export default Form
