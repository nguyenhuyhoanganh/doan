import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
// eslint-disable-next-line no-unused-vars
import { Chart, Tooltip } from 'chart.js/auto'
import { useQuery } from '@tanstack/react-query'
import songApi from '../../../apis/song.api'
import { NavLink } from 'react-router-dom'
import { BsPauseCircle, BsPlayFill } from 'react-icons/bs'
import { BiLoader } from 'react-icons/bi'
import { AudioContext } from '../../../contexts/audio.context'
import './index.css'
import SongItem from '../../Song/List/SongItem'

const ChartSection = () => {
  const [chartData, setChartData] = useState(null)
  const [topSongs, setTopSongs] = useState(null)
  const { data } = useQuery({
    queryKey: ['chart'],
    queryFn: () => {
      return songApi.chart()
    },
    keepPreviousData: true
  })

  const hour = new Date().getHours()

  useEffect(() => {
    if (data !== undefined) {
      const labels = data?.data.data.labels.map((item) =>
        (+item + hour + 1) % 2 === 0 ? (item < 10 ? `0${item}:00` : `${item}:00`) : ''
      )
      const datasets = data?.data.data.datasets
        .filter((_, index) => index < 3)
        .map((data, index) => ({
          ...data,
          borderColor: index === 0 ? '#4a90e2' : index === 1 ? '#50e3c2' : '#e35050',
          tension: 0.3,
          borderWidth: 2,
          pointHoverRadius: 5,
          pointBackgroundColor: 'white',
          pointHitRadius: 4,
          pointBorderColor: index === 0 ? '#4a90e2' : index === 1 ? '#50e3c2' : '#e35050',
          animation: false,
          pointHoverBorderWidth: 3
        }))
      const totalCount = data?.data.data.datasets.reduce((total, data, index) => {
        return index < 3 ? total + data.data[23] : total + 0
      }, 0)
      const top_songs = data?.data.data.top_songs.reduce((topSongs, song, index) => {
        return index < 2
          ? [
              ...topSongs,
              {
                ...song,
                rank: index + 1,
                percent: Math.round((data?.data.data.datasets[index].data[23] / totalCount) * 100)
              }
            ]
          : index === 2
          ? [
              ...topSongs,
              {
                ...song,
                rank: index + 1,
                percent:
                  100 -
                  Math.round((data?.data.data.datasets[0].data[23] / totalCount) * 100) -
                  Math.round((data?.data.data.datasets[1].data[23] / totalCount) * 100)
              }
            ]
          : [...topSongs, { ...song, rank: index + 1 }]
      }, [])
      setTopSongs(top_songs)
      setChartData({ labels, datasets })
    }
  }, [data, hour])
  const options = {
    responsive: true,
    pointRadius: 0,
    // aspectRatio: 2.5,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: { display: false },
        grid: { color: 'rgba(255, 255, 255, 0.3)', drawTicks: false },
        border: { dash: [3, 4] },
        min: 0
        // max: data?.data.data.maxCount
      },
      x: {
        ticks: { color: 'gray' },
        grid: { color: 'transparent' }
      }
    },
    plugins: {
      legend: false
    },
    hover: {
      mode: 'dataset',
      intersect: false
    }
  }

  return (
    <>
      <div className='relative mb-6 h-[400px] w-full rounded-md bg-chart-image bg-cover bg-center'>
        <div className='absolute inset-0 rounded-md bg-gradient-to-t from-[#34224f]/90 to-[#34224f]/70'></div>
        <div className='absolute inset-0 rounded-md p-4'>
          <div className='grid h-full grid-cols-12 gap-4'>
            <h3 className='col-span-12 block text-2xl font-bold text-white'>#Chart</h3>
            <div className='col-span-5 flex flex-col gap-4'>
              {topSongs && topSongs.map((song, index) => (index < 3 ? <Item song={song} key={index} /> : ''))}
            </div>
            <div className='col-span-7 h-full'>{chartData !== null && <Line data={chartData} options={options} />}</div>
          </div>
        </div>
      </div>
      {topSongs && topSongs.map((song, index) => <SongItem song={song} key={index} />)}
    </>
  )
}

export default ChartSection

const Item = ({ song }) => {
  const { songSelected, isLoading, isPlaying, handlePlayAudio: onPlayAudio } = useContext(AudioContext)
  return (
    <>
      <div
        className={`group grid h-auto w-[100%] cursor-default grid-cols-12 rounded-md bg-white/5 pr-[10px] hover:bg-white/20  
        ${song === songSelected && 'bg-white/20'}`}
      >
        <div
          className={`col-span-2 m-auto text-4xl font-bold ${
            song.rank === 1 ? 'top-1' : song.rank === 2 ? 'top-2' : 'top-3'
          }`}
        >
          {song.rank}
        </div>
        <div className='col-span-8 flex py-3'>
          <div
            className='relative h-14 w-14 min-w-[3.5rem] cursor-pointer rounded-md object-cover'
            onClick={() => onPlayAudio(song)}
          >
            <span className='absolute top-0 left-0 h-full w-full'>
              {song === songSelected &&
                (isLoading ? (
                  <div className='absolute top-1/2 flex w-full -translate-y-1/2 transform items-center justify-center'>
                    <BiLoader size={36} className='animate-spin text-white' />
                  </div>
                ) : isPlaying ? (
                  <div className='absolute top-1/2 flex w-full -translate-y-1/2 transform items-center justify-center'>
                    <span
                      className={`h-6 w-6 bg-contain bg-center bg-no-repeat`}
                      style={{
                        backgroundImage: "url('/images/gif/icon-playing.gif')"
                      }}
                    ></span>
                  </div>
                ) : (
                  <BsPauseCircle size={36} className='absolute top-1/2 w-full -translate-y-1/2 transform text-white' />
                ))}
              {song !== songSelected && (
                <BsPlayFill
                  size={36}
                  className={`absolute top-1/2 w-full -translate-y-1/2 transform text-white opacity-0 group-hover:opacity-100`}
                />
              )}
            </span>
            <img src={song.imageUrl} alt={song.title} className='h-14 w-14 rounded-md object-cover' />
          </div>
          <div className='flex max-w-sm flex-col gap-1 overflow-hidden whitespace-nowrap pl-2'>
            <span className='truncate pt-1 text-sm font-medium text-white'>{song.title}</span>
            <span className='truncate'>
              {song.artists &&
                song.artists.map((artist, index, artists) => (
                  <Fragment key={artist?.id}>
                    <NavLink
                      to={`/dashboard/artist/${artist?.slug}`}
                      className='cursor-pointer text-xs text-gray-400 hover:text-main-color hover:underline hover:underline-offset-1'
                    >
                      {artist?.fullName}
                    </NavLink>
                    {index === artists.length - 1 ? '' : ', '}
                  </Fragment>
                ))}
            </span>
          </div>
        </div>
        <div className='col-span-2 m-auto text-lg font-semibold text-white'>{`${song.percent}%`}</div>
      </div>
    </>
  )
}
