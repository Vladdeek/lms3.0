import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { X } from 'lucide-react'
import { Children } from 'react'
import { createContext, use, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const NotFoundError404 = () => {
	return (
		<div className='h-181 overflow-hidden md:-mx-10 -mx-2'>
			<DotLottieReact
				className='w-screen '
				src='/anim/ERROR404.lottie'
				loop
				autoplay
			/>
		</div>
	)
}
export const InternalServerError500 = () => {
	return (
		<div className='md:-mx-10 -mx-2 w-screen flex justify-center items-center '>
			<DotLottieReact
				className='w-[75%]'
				src='/anim/ERROR500.lottie'
				loop
				autoplay
			/>
		</div>
	)
}
export const Forbidden403 = () => {
	return (
		<div className='md:-mx-10 -mx-2 w-screen flex justify-center items-center '>
			<DotLottieReact
				className='w-[75%]'
				src='/anim/ERROR403.lottie'
				loop
				autoplay
			/>
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
		error !== null && error !== '500' && error !== '403' && setShowError(true)
		setTimeout(() => {
			setShowError(false)
		}, 30000)
	}, [error])

	const location = useLocation()
	const navigate = useNavigate()

	const ErrorsDescription = {
		400: 'Некорректный запрос. Проверьте правильность введённых данных.',

		403: 'Доступ запрещён. Недостаточно прав для выполнения действия.',
		409: 'Конфликт. Данные уже существуют или нарушены ограничения.',
		422: 'Неверный формат входных данных. Проверьте корректность передаваемых параметров.',
		429: 'Слишком много запросов. Попробуйте позже.',
		502: 'Плохой шлюз. Сервер получил некорректный ответ от другого сервера.',
		503: 'Сервис временно недоступен. Попробуйте позже.',
		504: 'Превышено время ожидания ответа от сервера.',
	}

	console.log('error: ', error)

	useEffect(() => {
		if (error === '401') navigate('/auth')
	}, [error])

	useEffect(() => {
		setError(null)
	}, [location])

	return (
		<ErrorContext.Provider value={{ error, setError }}>
			{error ? (
				error === '404' ? (
					<NotFoundError404 />
				) : error === '500' ? (
					<InternalServerError500 />
				) : error === '403' ? (
					<Forbidden403 />
				) : (
					<>
						<div className='relative flex justify-center'>
							<div
								className={`absolute bg-[var(--red-status-bg)] p-2 rounded-xl  shadow-[var(--shadow)] transition-all duration-300 ${
									showError ? 'opacity-100 top-5' : 'opacity-0 -top-50'
								}`}
							>
								<div className='relative flex flex-col gap-2'>
									<X
										onClick={() => setShowError(false)}
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
						</div>
						<>{children}</>
					</>
				)
			) : (
				children
			)}
		</ErrorContext.Provider>
	)
}
