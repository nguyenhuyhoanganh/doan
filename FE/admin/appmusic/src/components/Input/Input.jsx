import { useId } from 'react'

const Input = ({
  label,
  type, // type input: email, password, text ...
  errorMessage, // lấy error từ formState của userForm()
  name, // name của input => truyền vào fn regitser để match key validate schema
  register, // fn register từ useForm() để validate input
  className,
  classNameWrapper = 'mt-2',
  classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600 ml-1',
  ...rest // có thể là palceholder, autocomplete
}) => {
  // nếu không có name hoặc fn register => không validate input
  const registerResult = register && name ? register(name) : {}
  const id = useId()
  return (
    <div className={classNameWrapper}>
      {label && (
        <div className={`ml-1 mb-1 ${errorMessage && 'text-red-600'}`}>
          <label htmlFor={id}>{label}</label>
        </div>
      )}
      <input
        id={id}
        type={type}
        className={`${className} ${
          errorMessage && '!border-red-600 bg-red-50 text-red-600 placeholder:text-red-600 focus:border-red-600'
        }`}
        {...rest}
        {...registerResult}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}

export default Input
