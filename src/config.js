import axios from 'axios'

export const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    timeout: '5000', // Because you don't have money for AWS
})