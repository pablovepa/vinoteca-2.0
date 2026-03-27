import axios from 'axios'


const api = axios.create({ baseURL: 'http://localhost:5000/api' })


// añadir interceptor para Authorization
api.interceptors.request.use((config) => {
const userVinoteca = JSON.parse(localStorage.getItem('userVinoteca'))
const token = userVinoteca?.token
if (token) config.headers.Authorization = `Bearer ${token}`
return config
})


export default api