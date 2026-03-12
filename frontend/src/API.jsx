let API = ''
let FILE_API = ''
let WS_API = ''
if (import.meta.env.VITE_ENV === 'dev') {
	API = import.meta.env.VITE_API_URL
	FILE_API = import.meta.env.VITE_IMG_URL
	WS_API = `${API}ws`
} else if (import.meta.env.VITE_ENV === 'prod') {
	API = import.meta.env.VITE_API_URL_VDS
	FILE_API = import.meta.env.VITE_IMG_URL_VDS
	WS_API = `${API}ws`
} else {
	throw new Error('Ошибка при чтении переменной среды ENV')
}
export { API, FILE_API, WS_API }

import axios from 'axios'
import { setGlobalError } from './components/Errors'
import { getCookie } from './TOKEN'

const api = axios.create({
	withCredentials: true,
})
/* 🔥 ДОБАВЛЯЕМ CSRF В КАЖДЫЙ ЗАПРОС */
api.interceptors.request.use(config => {
	const csrf = getCookie('csrftoken')

	if (csrf) {
		config.headers['X-CSRF-TOKEN'] = csrf
	}

	return config
})

let isRefreshing = false
let refreshSubscribers = []

const subscribeTokenRefresh = cb => refreshSubscribers.push(cb)
const onRefreshed = token => refreshSubscribers.forEach(cb => cb(token))

api.interceptors.response.use(
	r => r,
	async error => {
		const status = error.response?.status
		const detail = error.response?.data?.detail
		const originalRequest = error.config

		if (status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise(resolve => {
					subscribeTokenRefresh(() => {
						resolve(api(originalRequest))
					})
				})
			}

			originalRequest._retry = true
			isRefreshing = true

			try {
				const { status: refreshStatus } = await axios.post(
					`${API}/auth/jwt/refresh`,
					{},
					{ withCredentials: true },
				)

				isRefreshing = false
				onRefreshed()
				return api(originalRequest)
			} catch (refreshError) {
				isRefreshing = false
				window.location.href = '/auth'
				return Promise.reject(refreshError)
			}
		}

		if (detail) {
			setGlobalError(detail)
			return Promise.reject(error)
		}

		setGlobalError(status || '500')
		return Promise.reject(error)
	},
)
export default api
