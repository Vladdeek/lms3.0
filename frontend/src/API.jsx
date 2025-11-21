export const API = import.meta.env.VITE_API_URL
export const FILE_API = import.meta.env.VITE_IMG_URL

import axios from 'axios'
import { setGlobalError } from './components/Errors'

const api = axios.create({
	withCredentials: true,
})

api.interceptors.response.use(
	r => r,
	error => {
		// Silent refresh
		if (error.response?.status === 498) {
			return api(error.config)
		}

		// отправляем ошибку в error provider
		setGlobalError(error.response?.status || '500')

		return Promise.reject(error)
	}
)

export default api
