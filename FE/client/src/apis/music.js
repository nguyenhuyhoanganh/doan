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

export const apiGetComposers = () => new Promise(async(resolve, reject) => {
    try {
        const response = await axios({
            url: 'composers?sortBy=id&page=1&limit=50',
            method: 'GET',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetArtists = () => new Promise(async(resolve, reject) => {
    try {
        const response = await axios({
            url: 'artists?sortBy=followCount&page=1&limit=50',
            method: 'GET',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetArtistBySlug = (slug) => new Promise(async(resolve, reject) => {
    try {
        const response = await axios({
            url: `artists?slug=${slug}`,
            method: 'GET',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiGetSongsByArtistId = (id) => new Promise(async(resolve, reject) => {
    try {
        const response = await axios({
            url: `songs?artists.id=${id}`,
            method: 'GET',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})