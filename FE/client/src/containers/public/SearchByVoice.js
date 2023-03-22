import React, {useState} from 'react'
import * as icons from "../../utils/icons"
import * as apis from "../../apis"

const SearchByVoice = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileInputChange = (e) => {
        setSelectedFile(e.target.files[0]);
    }
    const handleSearch = () => {
        console.log('searching...')
        apis.identify_song(selectedFile)
    }
  return (
    <div className='flex flex-col gap-5 m-auto items-center py-[100px] text-center'>
      <div>Icon</div>
      <div className='flex flex-col gap-2'>
        <span>Chọn file nhạc cần biết tên:</span>
        <input
        type="file"
        accept=".mp3"
        className="px-4 py-2 mb-4 text-gray-700 bg-main-300 rounded-lg shadow-md focus:outline-none focus:shadow-outline"
        onChange={handleFileInputChange}
      />
      </div>
      <button
      onClick={handleSearch}
      className='border border-[#276a6c] rounded-md hover:bg-main-400 px-10 py-1'>Tìm tên bài hát</button>
    </div>
  )
}

export default SearchByVoice
