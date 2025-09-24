import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const Loader1 = () => {
	return (
		<div className='honeycomb'>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	)
}
const Loader = () => {
	return <DotLottieReact src='/anim/LOADER.lottie' loop autoplay />
}
export default Loader
