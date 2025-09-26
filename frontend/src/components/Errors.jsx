import { DotLottieReact } from '@lottiefiles/dotlottie-react'
export const NotFoundError404 = () => {
	return (
		<div className='w-screen relative flex justify-center -mx-10 z-1000'>
			<DotLottieReact
				className='w-[125%] object-cover aspect-20/9 h-auto absolute '
				src='/anim/404(2).lottie'
				loop
				autoplay
			/>
		</div>
	)
}
