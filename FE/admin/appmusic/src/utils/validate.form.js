import * as yup from 'yup'

export const getRules = (getValues = undefined) => ({
  email: {
    required: {
      value: true,
      message: 'Email is required'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email is not valid'
    },
    maxLength: {
      value: 160,
      message: 'Email length from 5 - 160 characters'
    },
    minLength: {
      value: 5,
      message: 'Email length from 5 - 160 characters'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password is required'
    },
    maxLength: {
      value: 160,
      message: 'Password length from 6 - 160 characters'
    },
    minLength: {
      value: 6,
      message: 'Password length from 6 - 160 characters'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Confirm password is required'
    },
    maxLength: {
      value: 160,
      message: 'Confirm password length from 6 - 160 characters'
    },
    minLength: {
      value: 6,
      message: 'Confirm password length from 6 - 160 characters'
    },
    validate: getValues
      ? (value) => value === getValues('password') || "Confirm password doesn't match password"
      : undefined
  }
})

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
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự'),
  confirm_password: yup
    .string()
    .required('Confirm password is required')
    .min(6, 'Confirm password length from 6 - 160 characters')
    .max(160, 'Confirm password length from 6 - 160 characters')
    .oneOf([yup.ref('password')], "Confirm password doesn't match password")
})
