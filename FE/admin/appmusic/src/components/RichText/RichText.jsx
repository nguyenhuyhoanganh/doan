import DOMPurify from 'dompurify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './index.css'
const RichText = ({ value, onChange, showPreview }) => {
  return (
    <div className='mb-8'>
      <ReactQuill value={value} onChange={onChange} placeholder='Write something...' />
      {showPreview && <div className='' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }} />}
    </div>
  )
}

export default RichText
// quill with image resize: https://codesandbox.io/s/react-quill-editor-with-image-resize-kv7u2f
