import * as yup from 'yup'

export const registerSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Email is not valid')
    .min(5, 'Email length from 5 - 160 characters')
    .max(160, 'Email length from 5 - 160 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password length from 6 - 160 characters')
    .max(160, 'Password length from 6 - 160 characters'),
  confirm_password: yup
    .string()
    .required('Confirm password is required')
    .min(6, 'Confirm password length from 6 - 160 characters')
    .max(160, 'Confirm password length from 6 - 160 characters')
    .oneOf([yup.ref('password')], "Confirm password doesn't match password")
})

export const loginSchema = registerSchema.omit(['confirm_password'])

export const songSchema = yup.object({
  title: yup.string().required('Title is required'),
  status: yup.string().required('Status is required').oneOf(['PUBLIC', 'PRIVATE', 'DRAFT'], 'Status is not valid'),
  categories: yup.array().min(1, 'Category is required'),
  artists: yup.array().min(1, 'Artist is required'),
  composer: yup.object().nullable().required('Composer is required'),
  album: yup.object().nullable().required('Album is required'),
  image: yup
    .mixed()
    .required('Image is required')
    .test('fileSize', 'File must not exceed 5MB', (value) => {
      if (!value) return true
      return value.size <= 5000000
    })
    .test('fileType', 'File must be in image format', (value) => {
      if (!value) return true
      return value.type.startsWith('image')
    }),
  backgroundImage: yup
    .mixed()
    .required('Background image is required')
    .test('fileSize', 'File must not exceed 5MB', (value) => {
      if (!value) return true
      return value.size <= 5000000
    })
    .test('fileType', 'File must be in image format', (value) => {
      if (!value) return true
      return value.type.startsWith('image')
    }),
  description: yup.string(),
  audio: yup
    .mixed()
    .required('Audio is required')
    .test('fileSize', 'File must not exceed 20MB', (value) => {
      if (!value) return true
      return value.size <= 20000000
    })
    .test('fileType', 'File must be in audio format', (value) => {
      if (!value) return true
      return value.type.startsWith('audio')
    })
  // lyrics: yup.string(),
})

export const artistsSchema = yup.object({
  fullName: yup.string().required('Full Name is required'),
  age: yup.number().required('Age is required'),
  gender: yup.string().required('Gender is required').oneOf(['MALE', 'FEMALE', 'UNKNOWN'], 'Gender is not valid'),
  avatar: yup
    .mixed()
    .required('Avatar is required')
    .test('fileSize', 'File must not exceed 5MB', (value) => {
      if (!value) return true
      return value.size <= 5000000
    })
    .test('fileType', 'File must be in image format', (value) => {
      if (!value) return true
      return value.type.startsWith('image')
    }),
  backgroundImage: yup
    .mixed()
    .required('Background image is required')
    .test('fileSize', 'File must not exceed 5MB', (value) => {
      if (!value) return true
      return value.size <= 5000000
    })
    .test('fileType', 'File must be in image format', (value) => {
      if (!value) return true
      return value.type.startsWith('image')
    }),
  description: yup.string()
})

export const composerSchema = artistsSchema

export const albumSchema = yup.object({
  title: yup.string().required('Title is required'),
  backgroundImage: yup
    .mixed()
    .required('Background image is required')
    .test('fileSize', 'File must not exceed 5MB', (value) => {
      if (!value) return true
      return value.size <= 5000000
    })
    .test('fileType', 'File must be in image format', (value) => {
      if (!value) return true
      return value.type.startsWith('image')
    }),
  description: yup.string()
})

export const categorySchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string()
})
