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

// export const getRules = (getValues = undefined) => ({
//   email: {
//     required: {
//       value: true,
//       message: 'Email is required'
//     },
//     pattern: {
//       value: /^\S+@\S+\.\S+$/,
//       message: 'Email is not valid'
//     },
//     maxLength: {
//       value: 160,
//       message: 'Email length from 5 - 160 characters'
//     },
//     minLength: {
//       value: 5,
//       message: 'Email length from 5 - 160 characters'
//     }
//   },
//   password: {
//     required: {
//       value: true,
//       message: 'Password is required'
//     },
//     maxLength: {
//       value: 160,
//       message: 'Password length from 6 - 160 characters'
//     },
//     minLength: {
//       value: 6,
//       message: 'Password length from 6 - 160 characters'
//     }
//   },
//   confirm_password: {
//     required: {
//       value: true,
//       message: 'Confirm password is required'
//     },
//     maxLength: {
//       value: 160,
//       message: 'Confirm password length from 6 - 160 characters'
//     },
//     minLength: {
//       value: 6,
//       message: 'Confirm password length from 6 - 160 characters'
//     },
//     validate: getValues
//       ? (value) => value === getValues('password') || "Confirm password doesn't match password"
//       : undefined
//   }
// })
