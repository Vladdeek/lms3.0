import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { X } from 'lucide-react'
import { Children } from 'react'
import { createContext, use, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const NotFoundError404 = () => {
	return (
		<div className='md:-mx-10 -mx-2 w-screen h-screen flex flex-col justify-center items-center'>
			<DotLottieReact
				className='w-screen '
				src='/anim/ERROR404.lottie'
				loop
				autoplay
			/>
			<button
				className='bg-[var(--black)] rounded-lg px-4 py-2 text-[var(--white)] hover:bg-[var(--hero-epta)] hover:text-white transition-all cursor-pointer'
				onClick={() => (window.location.href = '/')}
			>
				На главную
			</button>
		</div>
	)
}
export const InternalServerError500 = () => {
	return (
		<div className='md:-mx-10 -mx-2 w-screen h-screen flex flex-col justify-center items-center'>
			<DotLottieReact
				className='w-[75%]'
				src='/anim/ERROR500.lottie'
				loop
				autoplay
			/>
			<button
				className='bg-[var(--black)] rounded-lg px-4 py-2 text-[var(--white)] hover:bg-[var(--hero-epta)] hover:text-white transition-all cursor-pointer'
				onClick={() => (window.location.href = '/')}
			>
				На главную
			</button>
		</div>
	)
}
export const Forbidden403 = () => {
	return (
		<div className='md:-mx-10 -mx-2 w-screen h-screen flex flex-col justify-center items-center '>
			<DotLottieReact
				className='w-[75%]'
				src='/anim/ERROR403.lottie'
				loop
				autoplay
			/>
			<button
				className='bg-[var(--black)] rounded-lg px-4 py-2 text-[var(--white)] hover:bg-[var(--hero-epta)] hover:text-white transition-all cursor-pointer'
				onClick={() => (window.location.href = '/')}
			>
				На главную
			</button>
		</div>
	)
}

const ErrorContext = createContext(null)

export const useError = () => {
	return useContext(ErrorContext)
}

export const ErrorProvider = ({ children }) => {
	const [error, setError] = useState(null)
	const [showError, setShowError] = useState(false)

	useEffect(() => {
		if (
			error !== null &&
			error !== '500' &&
			error !== '403' &&
			error !== '404'
		) {
			setShowError(true)
			const timer = setTimeout(() => {
				setShowError(false)
				setError(null)
			}, 30000)

			return () => clearTimeout(timer)
		}
	}, [error])

	const location = useLocation()
	const navigate = useNavigate()

	const ErrorsDescription = {
		400: 'Некорректный запрос. Проверьте правильность введённых данных.',
		409: 'Конфликт. Данные уже существуют или нарушены ограничения.',
		422: 'Неверный формат входных данных. Проверьте корректность передаваемых параметров.',
		429: 'Слишком много запросов. Попробуйте позже.',
		502: 'Плохой шлюз. Сервер получил некорректный ответ от другого сервера.',
		503: 'Сервис временно недоступен. Попробуйте позже.',
		504: 'Превышено время ожидания ответа от сервера.',
	}

	console.log('error: ', error)

	const { refreshAccessToken } = useContext(AuthContext)

	useEffect(() => {
		const handle401 = async () => {
			if (error === '401') {
				console.log('Ошибка 401 — обновляем токен...')
				const newAccessToken = await refreshAccessToken()

				if (newAccessToken) {
					console.log('Новый access_token получен ✅')
				} else {
					console.warn('Не удалось обновить токен ❌')
				}
			}
		}

		handle401()
	}, [error])
	useEffect(() => {
		if (error) {
			setError(null)
			return () => clearTimeout(timer)
		}
	}, [false])

	return (
		<ErrorContext.Provider value={{ error, setError }}>
			<div className='relative'>
				{error === '404' ? (
					<div className='h-screen'>
						<NotFoundError404 />
					</div>
				) : error === '500' ? (
					<InternalServerError500 />
				) : error === '403' ? (
					<Forbidden403 />
				) : error === '401' ? (
					console.log('401 Unauthorized')
				) : (
					<>
						{children}

						{error && (
							<div
								className={`absolute left-1/2 transform -translate-x-1/2 bg-[var(--red-status-bg)] p-2 rounded-xl shadow-[var(--shadow)] transition-all duration-300 z-1000 ${
									showError ? 'opacity-100 top-5' : 'opacity-0 -top-50'
								}`}
							>
								<div className='relative flex flex-col gap-2'>
									<X
										onClick={() => {
											setShowError(false)
											setError(null)
										}}
										size={20}
										className='absolute right-0 top-0 cursor-pointer text-[var(--red-status-text)]'
									/>
									<p className='text-center font-medium text-[var(--red-status-text)] rounded-lg text-base'>
										Ошибка {error}
									</p>
									<p className='bg-[var(--hard-lvl-bg)] text-[var(--red-status-text)] rounded-lg text-sm p-2 w-75 text-center'>
										{ErrorsDescription[error]}
									</p>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</ErrorContext.Provider>
	)
}
