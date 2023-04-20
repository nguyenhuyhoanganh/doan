import { useContext } from 'react'
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs'
import PATH from '../../constants/paths'
import { AuthContext } from '../../contexts/auth.context'
import Form from './components/Form'
import { useMutation } from '@tanstack/react-query'
import fileApi from '../../apis/file.api'
import userApi from '../../apis/user.api'
import { useNavigate } from 'react-router-dom'
import { isAxiosUnprocessableEntityError } from '../../utils/utils'
import { toast } from 'react-toastify'

const Profile = () => {
  const { profile, setProfile } = useContext(AuthContext)
  const navigate = useNavigate()
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
  const modifyUserMutation = useMutation({
    mutationFn: (data) => userApi.modifyUser(data.id, data.user)
  })

  const handleSubmit = async (user, data, setError) => {
    const { avatar, roles, firstName, lastName, gender, age, email } = data
    const uploadResponse = await uploadFilesMutation.mutateAsync([avatar])
    const avatarUrl = uploadResponse[0] !== undefined ? uploadResponse[0].data.data.download_url : undefined
    const body = {
      firstName,
      lastName,
      gender,
      age,
      email,
      avatarUrl: avatarUrl !== undefined ? avatarUrl : user.avatarUrl,
      roles: roles.map((role) => {
        return {
          id: role.id
        }
      })
    }

    modifyUserMutation.mutate(
      { id: user.id, user: body },
      {
        onSuccess: (data) => {
          setProfile(data.data.data)
          navigate(PATH.profile.root)
          toast.done('Update profile success')
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
        title='My profile'
        links={[
          {
            title: 'Dashboard',
            to: PATH.dashboard.root
          },
          {
            title: 'Profile',
            to: PATH.profile.root
          },
          {
            title: 'Info',
            to: PATH.profile.root
          }
        ]}
      />
      <Form user={profile} onSubmit={handleSubmit} isLoading={modifyUserMutation.isLoading} />
    </>
  )
}

export default Profile
