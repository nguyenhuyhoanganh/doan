import { useNavigate } from 'react-router-dom'
import PATH from '../../../constants/paths'
import Form from '../components/Form'
import { useMutation } from '@tanstack/react-query'
import slugify from 'slugify'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { toast } from 'react-toastify'
import categoryApi from '../../../apis/category.api'

const CategoryCreate = ({ onClose }) => {
  const navigate = useNavigate()

  const createCategoryMutation = useMutation({
    mutationFn: (category) => categoryApi.createCategory(category)
  })

  const handleSubmit = async (_, data, setError) => {
    const { title, description } = data
    const body = {
      title: title,
      slug: slugify(title),
      description
    }
    createCategoryMutation.mutate(body, {
      onSuccess: () => {
        onClose()
        navigate(PATH.dashboard.category.root)
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
  return <Form onSubmit={handleSubmit} isLoading={createCategoryMutation.isLoading} />
}

export default CategoryCreate
