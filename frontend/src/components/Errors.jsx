import { DotLottieReact } from '@lottiefiles/dotlottie-react'
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
