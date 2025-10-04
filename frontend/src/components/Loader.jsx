import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const Loader = () => {
	return <DotLottieReact src='/anim/LOADER.lottie' loop autoplay />
}
export const BlockLoader = ({ width, height }) => {
	return <div style={{ width, height }} className='rounded-md shimmer'></div>
}

export default Loader
