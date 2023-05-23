import { useEffect, useState } from 'react'
import ChartSection from './components/ChartSection'
import { useQuery } from '@tanstack/react-query'
import songApi from '../../apis/song.api'
import './index.css'

const Analytics = () => {
  const [statistics, setStatistics] = useState({})
  const { data } = useQuery({
    queryKey: ['statistics'],
    queryFn: () => {
      return songApi.statistics()
    },
    keepPreviousData: true
  })
  useEffect(() => {
    if (data !== undefined) {
      setStatistics(data.data.data)
    }
  }, [data])
  const convertNuamber = (n) => {
    if (n >= 1000000) {
      return (n / 1000000).toFixed(2) + 'M'
    } else if (n >= 1000) {
      return n.toLocaleString()
    } else {
      return n
    }
  }
  return (
    <div className='min-h-screen'>
      <div className='grid w-full grid-cols-12 gap-1 pb-2'>
        <div className='col-span-3 min-h-[6rem] rounded-lg border p-2'>
          <div>
            <span className='mb-2 text-gray-600'>{`Total listens for the day: `}</span>
          </div>
          <div>
            <span className='number-custom text-4xl font-bold'>{`${convertNuamber(
              statistics?.play_statistics?.total_listens
            )}`}</span>
          </div>
        </div>
        <div className='col-span-3 min-h-[6rem] rounded-lg border p-2'>
          <div>
            <span className='mb-2 text-gray-600'>{`Total number of songs: `}</span>
          </div>
          <div>
            <span className='number-custom text-4xl font-bold'>{`${convertNuamber(statistics.number_of_songs)}`}</span>
          </div>
        </div>
        <div className='col-span-3 min-h-[6rem] rounded-lg border p-2'>
          <span className='mb-2 text-gray-600'>{`Number of new songs: `}</span>
          <div>
            <span className='number-custom text-4xl font-bold'>{`${convertNuamber(
              statistics.number_of_new_songs
            )}`}</span>
          </div>
        </div>
        <div className='col-span-3 min-h-[6rem] rounded-lg border p-2'>
          <span className='mb-2 text-gray-600'>{`Total number of users: `}</span>
          <div>
            <span className='number-custom text-4xl font-bold'>{`${convertNuamber(statistics.number_of_users)}`}</span>
          </div>
        </div>
      </div>
      {console.log(statistics)}
      <ChartSection />
    </div>
  )
}

export default Analytics
