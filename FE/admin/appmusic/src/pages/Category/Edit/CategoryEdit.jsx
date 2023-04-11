import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PATH from '../../../constants/paths'
import { isAxiosUnprocessableEntityError } from '../../../utils/utils'
import { toast } from 'react-toastify'
import Form from '../components/Form'
import categoryApi from '../../../apis/category.api'

const CategoryEdit = ({ cateId, onClose }) => {
  const navigate = useNavigate()
  const [category, setCategory] = useState()

  // fetch artist
  const { data } = useQuery({
    queryKey: ['category', { ...cateId }],
    queryFn: () => {
      return categoryApi.getCategoryById(cateId)
    }
  })

  useEffect(() => {
    setCategory(data?.data?.data)
  }, [data])

  const modifyCategoryMutation = useMutation({
    mutationFn: (data) => categoryApi.modifyCategory(data.id, data.category)
  })

  const handleSubmit = async (category, data, setError) => {
    const { title, description } = data
    const body = {
      title,
      slug: category.slug,
      description
    }

    modifyCategoryMutation.mutate(
      { id: category.id, category: body },
      {
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
      }
    )
  }

  return <Form category={category} onSubmit={handleSubmit} isLoading={modifyCategoryMutation.isLoading} />
}

export default CategoryEdit
