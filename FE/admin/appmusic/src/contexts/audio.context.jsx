import { createContext, useEffect, useState } from 'react'

const initialAudioContext = {
  audio: null,
  setAudio: () => null,
  songSelected: null,
  setSongSelected: () => null,
  isPlaying: false,
  setIsPlaying: () => null,
  isLoading: false,
  setIsLoading: () => null
}

export const AudioContext = createContext(initialAudioContext)

export const AudioProvider = ({ children }) => {
  const [audio, setAudio] = useState(initialAudioContext.audio)
  const [songSelected, setSongSelected] = useState(initialAudioContext.songSelected)
  const [isPlaying, setIsPlaying] = useState(initialAudioContext.isPlaying)
  const [isLoading, setIsLoading] = useState(initialAudioContext.isLoading)

  useEffect(() => {
    const onLoadded = () => {
      setIsLoading(false)
    }

    const onLoading = () => {
      setIsLoading(true)
    }

    const onEnded = () => {
      if (audio.paused) {
        audio.play()
      }
    }

    if (audio instanceof Audio) {
      audio.addEventListener('loadstart', onLoading)
      audio.addEventListener('canplay', onLoadded)
      audio.addEventListener('ended', onEnded)
    }

    return () => {
      if (audio instanceof Audio) {
        audio.pause()
        audio.removeEventListener('loadstart', onLoading)
        audio.removeEventListener('canplay', onLoadded)
        audio.removeEventListener('ended', onEnded)
      }
    }
  }, [audio])

  useEffect(() => {
    if (audio && isPlaying === true) audio.play()
    if (audio && isPlaying === false) audio.pause()
  }, [isPlaying, audio])

  useEffect(() => {
    if (songSelected !== null) {
      setAudio(new Audio(songSelected.sourceUrls[0]))
      setIsPlaying(true)
    }
  }, [songSelected])

  const handlePlayAudio = (song) => {
    song !== songSelected && setSongSelected(song)
    song === songSelected && setIsPlaying((prevState) => !prevState)
  }
  return (
    <AudioContext.Provider
      value={{
        audio,
        setAudio,
        songSelected,
        setSongSelected,
        isPlaying,
        setIsPlaying,
        isLoading,
        setIsLoading,
        handlePlayAudio
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}
