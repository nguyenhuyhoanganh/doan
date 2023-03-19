import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import slugify from 'slugify'

import categoryApi from '../../../apis/category.api'
import artistApi from '../../../apis/artist.api'
import composerApi from '../../../apis/composer.api'
import albumApi from '../../../apis/album.api'
import Input from '../../../components/Input'
import RichText from '../../../components/RichText/RichText'
import Selector from '../../../components/Selector'
import SelectorSearch from '../../../components/SelectorSearch/SelectorSearch'
import { songSchema } from '../../../utils/validate.form'
import ImageUpload from '../../../components/ImageUpload/ImageUpload'
import Radio from '../../../components/Radio'

const STATUS = [
  { value: 'DRAFT', title: 'DRAFT' },
  { value: 'PUBLIC', title: 'PUBLIC' },
  { value: 'PRIVATE', title: 'PRIVATE' }
]
const Form = () => {
  // fetch all categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories({ limit: 999 })
    }
  })
  // react-hook-form
  const {
    register,
    handleSubmit,
    // setError,
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
  const [albumsSelected, setAlbumsSelected] = useState(null)
  const [searchAlbum, setSearchAlbum] = useState('')

  // fetch artists
  const { data: artistsData } = useQuery({
    queryKey: ['artists', searchArtist],
    queryFn: () => {
      return artistApi.getArtists({ limit: 5, fullName: searchArtist })
    }
  })
  const { data: composersData } = useQuery({
    queryKey: ['composers', searchComposer],
    queryFn: () => {
      return composerApi.getComposers({ limit: 5, fullName: searchComposer })
    }
  })
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
    setAlbumsSelected(album)
    setSearchAlbum('')
  }

  // trigger err message when submit fail
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
    setValue('album', albumsSelected)
    isSubmitted === true && trigger('album')
  }, [albumsSelected, setValue, trigger, isSubmitted])

  // submit form
  const onSubmit = handleSubmit((data) => {
    console.log(slugify(data.title))
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
        <ImageUpload />
      </div>

      <div className='col-span-4 rounded-lg p-5 shadow-md'>
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
          selected={albumsSelected}
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
            type='submit'
            className='ml-2 flex min-w-[5.5rem] items-center gap-1 rounded-lg bg-green-500/80 py-2.5 px-4 text-sm font-medium text-white shadow hover:bg-green-500 hover:drop-shadow-lg'
          >
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
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}

export default Form
