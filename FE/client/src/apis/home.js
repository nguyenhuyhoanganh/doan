import axios from '../axios'

export const getHome = () => new Promise(async(resolve, reject) => {
    try {
        const response = await axios({
            url: '/albums',
            method: 'GET',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
export const getNewRelease = () => new Promise(async(resolve, reject) => {
    try {
        const response = await axios({
            url: 'songs?sortBy=createdAt',
            method: 'GET',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const getTop10 = () => new Promise(async(resolve, reject) => {
    try {
        const response = await axios({
            url: 'songs?sortBy=view',
            method: 'GET',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})