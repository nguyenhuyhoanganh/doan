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
            url: '/infosong',
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