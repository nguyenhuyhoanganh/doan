const Input = ({
  type, // type input: email, password, text ...
  errorMessage, // lấy error từ formState của userForm()
  className,
  name, // name của inpur => truyền vào fn regitser để match key validate schema
  register, // fn register từ useForm() để validate input
  classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
  classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
  ...rest // có thể là palceholder, autocomplete
}) => {
  // nếu không có name hoặc fn register => không validate input
  const registerResult = register && name ? register(name) : {}
  return (
    <div className={className}>
      <input type={type} className={classNameInput} {...rest} {...registerResult} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}

export default Input
