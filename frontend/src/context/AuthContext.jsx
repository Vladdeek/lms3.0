// import { createContext, useState, useEffect } from 'react'
// import { API } from '../API'
// import { useNavigate } from 'react-router-dom'
// import { getCookie } from '../TOKEN'
// import axios from 'axios'

// export const AuthContext = createContext()

// export const AuthProvider = ({ children }) => {
// 	const [accessToken, setAccessToken] = useState(null)
// 	const [refreshToken, setRefreshToken] = useState(null)
// 	const navigate = useNavigate()

// 	useEffect(() => {
// 		const storedAccess = localStorage.getItem('access_token')
// 		const storedRefresh = localStorage.getItem('refresh_token')

// 		if (storedAccess) setAccessToken(storedAccess)
// 		if (storedRefresh) setRefreshToken(storedRefresh)
// 	}, [])

// 	const login = data => {
// 		console.log('login data: ', data)
// 		setAccessToken(data.access_token)
// 		setRefreshToken(data.refresh_token)

// 		localStorage.setItem('access_token', data.access_token)
// 		localStorage.setItem('refresh_token', data.refresh_token)

// 		if (accessToken?.length !== 0 && refreshToken?.length !== 0) navigate('/')
// 	}

// 	//LOGOUT
// 	const logout = () => {
// 		setAccessToken(null)
// 		setRefreshToken(null)

// 		localStorage.removeItem('access_token')
// 		localStorage.removeItem('refresh_token')
// 	}

// 	//REFRESH
// 	const refreshAccessToken = async () => {
// 		console.log('refresh')
// 		try {
// 			const res = await axios.post(
// 				`${API}/auth/jwt/refresh`,
// 				{},
// 				{
// 					withCredentials: true,
// 					headers: {
// 						'X-CSRF-TOKEN': getCookie('csrftoken'),
// 					},
// 				}
// 			)

// 			console.log('refresh done')

// 			const data = res.data
// 			console.log('refresh in context:', data)

// 			setAccessToken(data.access_token)
// 			console.log('Access token refreshed!')

// 			return data.access_token
// 		} catch (error) {
// 			console.log('Error while refreshing token:', error.message)

// 			logout()
// 			navigate('/auth')
// 			return null
// 		}
// 	}

// 	return (
// 		<AuthContext.Provider
// 			value={{ accessToken, refreshToken, login, logout, refreshAccessToken }}
// 		>
// 			{children}
// 		</AuthContext.Provider>
// 	)
// }
