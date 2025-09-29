import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Children } from 'react'
import { createContext, use, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
export const NotFoundError404 = () => {
	return (
		<div className='w-screen relative flex justify-center -mx-10 z-1000'>
			<DotLottieReact
				className='w-[125%] object-cover aspect-20/9 h-auto absolute '
				src='/anim/ERROR404.lottie'
				loop
				autoplay
			/>
		</div>
	)
}
export const InternalServerError500 = () => {
	return (
		<div className='w-screen h-screen  flex justify-center items-center '>
			<DotLottieReact
				className='w-[75%]'
				src='/anim/ERROR500.lottie'
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
	const location = useLocation()

	console.log('error: ', error)

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
				) : (
					<div className='flex justify-center'>
						<p className='bg-[var(--red-status-bg)] text-[var(--red-status-text)] w-fit px-6 py-3 rounded-lg text-xl mt-5'>
							Ошибка {error}
						</p>
					</div>
				)
			) : (
				children
			)}
		</ErrorContext.Provider>
	)
}
