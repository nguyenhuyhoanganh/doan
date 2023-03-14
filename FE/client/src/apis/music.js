import axios from '../axios'

export const apiGetSong = (sid) => new Promise(async(resolve, reject) => {
    try {
        const response = await axios({
            url: '/song',
            method: 'GET',
            params: {id: sid}
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetDetailSong = (sid) => new Promise(async(resolve, reject) => {
    try {
        const response = await axios({
            url: '/songs',
            method: 'GET',
            params: {id: sid}
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetDetailPlaylist = (pid) => new Promise(async(resolve, reject) => {
    try {
        const response = await axios({
            url: '/detailplaylist',
            method: 'GET',
            params: {id: pid}
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apigetSongsByAlbumId = (aid) => new Promise(async(resolve, reject) => {
    try {
        const response = await axios({
            url: `songs?album.id=${aid}`,
            method: 'GET',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetAlbumDetail = (aid) => new Promise(async(resolve, reject) => {
    try {
        const response = await axios({
            url: 'albums',
            method: 'GET',
            params: {id: aid}
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetCommentBySId = (sid) => new Promise(async(resolve, reject) => {
    try {
        const response = await axios({
            url: `song/${sid}/comments`,
            method: 'GET',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})