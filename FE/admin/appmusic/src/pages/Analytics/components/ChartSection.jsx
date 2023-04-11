import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
// eslint-disable-next-line no-unused-vars
import { Chart } from 'chart.js/auto'
import { useQuery } from '@tanstack/react-query'
import songApi from '../../../apis/song.api'

const ChartSection = () => {
  const [chart, setChart] = useState(null)
  const { data } = useQuery({
    queryKey: ['chart'],
    queryFn: () => {
      return songApi.chart()
    },
    keepPreviousData: true
  })

  useEffect(() => {
    if (data !== undefined) {
      const labels = data.data.data?.labels.filter((item) => +item % 2 === 0)
      const datasets = data.data.data?.datasets.filter((_, index) => index < 3)
      setChart({ labels, datasets })
      console.log(data.data.data)
    }
  }, [data])

  return (
    <div className='relative h-[25rem] w-full rounded-md bg-chart-image bg-cover bg-center'>
      <div className='absolute inset-0 rounded-md bg-gradient-to-t from-main-color/90 to-main-color/30'></div>
      <div className='absolute inset-0 rounded-md'>
        <h3 className='text-2xl font-bold text-white'>#Chart</h3>
        <div className='grid grid-cols-12'>
          <div className='col-span-5'>Ranks</div>
          <div className='col-span-7'>{chart !== null && <Line data={chart} />}</div>
        </div>
      </div>
    </div>
  )
}

export default ChartSection
