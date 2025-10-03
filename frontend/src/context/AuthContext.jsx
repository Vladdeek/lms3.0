import { createContext, useState, useEffect } from 'react'
import { API } from '../API'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const [accessToken, setAccessToken] = useState(null)
	const [refreshToken, setRefreshToken] = useState(null)
	const navigate = useNavigate()

	useEffect(() => {
		const storedAccess = localStorage.getItem('access_token')
		const storedRefresh = localStorage.getItem('refresh_token')

		if (storedAccess) setAccessToken(storedAccess)
		if (storedRefresh) setRefreshToken(storedRefresh)
	}, [])

	const login = data => {
		setAccessToken(data.access_token)
		setRefreshToken(data.refresh_token)

		localStorage.setItem('access_token', data.access_token)
		localStorage.setItem('refresh_token', data.refresh_token)

		if (accessToken?.length !== 0 && refreshToken?.length !== 0) navigate('/')
	}

	const logout = () => {
		setAccessToken(null)
		setRefreshToken(null)

		localStorage.removeItem('access_token')
		localStorage.removeItem('refresh_token')
	}

	const refreshAccessToken = async () => {
		const storedRefresh = localStorage.getItem('refresh_token')
		console.log('Access token expired, refreshing... \n', storedRefresh)
		if (!storedRefresh) return null

		const res = await fetch(`${API}/auth/jwt/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${storedRefresh}`,
			},
		})

		if (!res.ok) {
			console.log('Access token not refreshed.')
			logout()
			return null
		}

		const data = await res.json()
		console.log('refresh in context: ', data)
		setAccessToken(data.access_token)
		localStorage.setItem('access_token', data.access_token)
		console.log('Access token refreshed!')
		return data.access_token
	}

	return (
		<AuthContext.Provider
			value={{ accessToken, refreshToken, login, logout, refreshAccessToken }}
		>
			{children}
		</AuthContext.Provider>
	)
}
