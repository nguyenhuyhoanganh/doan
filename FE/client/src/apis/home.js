import axios from '../axios'

export const getHome = () => new Promise(async(resolve, reject) => {
    try {
        const response = await axios({
            url: '/home',
            method: 'GET',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})