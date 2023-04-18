import React, { Fragment, useContext, useEffect, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
// eslint-disable-next-line no-unused-vars
import { Chart, Tooltip } from 'chart.js/auto'
import { useQuery } from '@tanstack/react-query'
import songApi from '../../../apis/song.api'
import { NavLink, createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { BsPauseCircle, BsPlayFill } from 'react-icons/bs'
import { BiLoader } from 'react-icons/bi'
import { AudioContext } from '../../../contexts/audio.context'
import './index.css'
import SongItem from '../../Song/List/SongItem'
import { isEqual } from 'lodash'
import Popover from '../../../components/Popover'
import useQueryParams from '../../../hoocs/useQueryParams'

const ChartSection = () => {
  const [chartData, setChartData] = useState(null)
  const queryParams = useQueryParams()
  const [topSongs, setTopSongs] = useState(null)
  const [songIndexHover, setSongIndexHover] = useState(null)
  const [isShowTooltip, setIsShowTooltip] = useState(false)
  const [tooltipState, setTooltipState] = useState({
    opacity: 0,
    top: 0,
    left: 0
  })
  const chartRef = useRef()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { data, isFetching, isLoading } = useQuery({
    queryKey: ['chart', { top: queryParams.top || 10 }],
    queryFn: () => {
      return songApi.chart(queryParams.top || 10)
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
          tension: 0.2,
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
        min: 0,
        max: 250
      },
      x: {
        ticks: { color: 'gray' },
        grid: { color: 'transparent' }
      }
    },
    plugins: {
      legend: false,
      tooltip: {
        enabled: false,
        external: ({ tooltip }) => {
          if (!chartRef || !chartRef.current) return
          if (tooltip.opacity === 0) {
            if (tooltipState.opacity !== 0) setTooltipState((prev) => ({ ...prev, opacity: 0 }))
            return
          }
          const color = tooltip?.labelColors[0]?.borderColor
          const index = color === '#4a90e2' ? 0 : color === '#50e3c2' ? 1 : 2
          setSongIndexHover(index)
          const newTooltipState = {
            opacity: 1,
            left: tooltip.caretX,
            top: tooltip.caretY
          }
          if (!isEqual(tooltipState, newTooltipState)) setTooltipState(newTooltipState)
        }
      }
    },
    hover: {
      mode: 'dataset',
      intersect: false
    }
  }

  return (
    <>
      <div className='relative h-[400px] w-full rounded-md bg-chart-image bg-cover bg-center'>
        <div className='absolute inset-0 rounded-md bg-gradient-to-t from-[#34224f]/90 to-[#34224f]/70'></div>
        <div className='absolute inset-0 rounded-md p-4'>
          <div className='grid h-full grid-cols-12 gap-4'>
            <h3 className='col-span-12 block text-2xl font-bold text-white'>#Rating today</h3>
            <div className='col-span-5 flex flex-col gap-4'>
              {topSongs && topSongs.map((song, index) => (index < 3 ? <Item song={song} key={index} /> : null))}
            </div>
            <div className='relative col-span-7 h-full'>
              {chartData !== null && <Line data={chartData} ref={chartRef} options={options} />}
              {songIndexHover !== null && topSongs && (
                <div
                  className={`group h-4 w-4 rounded-full bg-transparent ${
                    isShowTooltip === true ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    top: tooltipState.top - 8,
                    left: tooltipState.left - 8,
                    position: 'absolute'
                    // opacity: tooltipState.opacity
                  }}
                >
                  <Popover
                    placement='top'
                    trigger='hover'
                    shrinkedPopoverPosition='bottom'
                    renderPopover={<Item song={topSongs[songIndexHover]} isTooltip={true} />}
                    offsetValue={{ mainAxis: 7, crossAxis: 0 }}
                    delayHover={{
                      open: 0,
                      close: 0
                    }}
                    onOpenChange={(isOpen) => setIsShowTooltip(isOpen)}
                  >
                    <div
                      className={`absolute z-50 flex h-4 w-4 items-center justify-center rounded-full 
                      ${isShowTooltip === true ? 'bg-white' : 'bg-transparent'}`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          isShowTooltip === true
                            ? songIndexHover === 0
                              ? 'bg-[#4a90e2]'
                              : songIndexHover === 1
                              ? 'bg-[#50e3c2]'
                              : 'bg-[#e35050]'
                            : 'bg-transparent'
                        }`}
                      ></div>
                    </div>
                  </Popover>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='my-6'>
        {topSongs && topSongs.map((song, index) => <SongItem song={song} key={index} />)}
        {!isLoading && +queryParams.top !== 100 && (
          <div className='mt-3 flex items-center justify-center'>
            <button
              className='min-w-[9rem] rounded-full border border-[#aaa] py-3 px-4 text-center text-[#333] hover:bg-gray-100'
              onClick={() => {
                navigate({
                  pathname: pathname,
                  search: createSearchParams({ top: 100 }).toString()
                })
              }}
            >
              See top 100
            </button>
          </div>
        )}
        {!isLoading && +queryParams.top === 100 && isFetching && (
          <div className='mt-3 flex items-center justify-center'>
            <button className='flex min-w-[9rem] items-center justify-center rounded-full border border-[#aaa] py-3 px-4 text-[#333] hover:bg-gray-100'>
              <svg
                aria-hidden='true'
                className='h-5 w-5 animate-spin'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default ChartSection

const Item = ({ song, isTooltip }) => {
  const { songSelected, isLoading, isPlaying, handlePlayAudio: onPlayAudio } = useContext(AudioContext)
  return (
    <>
      <div
        className={`group grid h-auto w-[100%] cursor-default grid-cols-12 rounded-md pr-[10px] 
        ${song === songSelected && 'bg-white/20'} 
        ${isTooltip === true ? 'w-[18rem] bg-gray-400/30 hover:bg-gray-400/40' : 'bg-white/5 hover:bg-white/20'}`}
      >
        {isTooltip !== true && (
          <div
            className={`col-span-2 m-auto text-4xl font-bold 
          ${song.rank === 1 ? 'top-1' : song.rank === 2 ? 'top-2' : 'top-3'}`}
          >
            {song.rank}
          </div>
        )}
        <div className={`flex py-3 ${isTooltip === true ? 'col-span-10 pl-[10px]' : 'col-span-8'}`}>
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
        <div
          className={`col-span-2 m-auto text-lg font-semibold ${
            isTooltip === true
              ? song.rank === 1
                ? 'text-[#4a90e2]'
                : song.rank === 2
                ? 'text-[#50e3c2]'
                : 'text-[#e35050]'
              : 'text-white'
          }`}
        >{`${song.percent}%`}</div>
      </div>
    </>
  )
}
