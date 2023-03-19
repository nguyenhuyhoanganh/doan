import axios from '../axios'

export const getChart = () => new Promise(async(resolve, reject) => {
    try {
        const response = await axios({
            url: 'songs?sortBy=view&sortBy=likeCount',
            method: 'GET',
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})