const InDevelopment = () => {
	return (
		<div className='w-screen h-screen flex flex-col justify-center items-center'>
			<img className='w-2/7 h-1/3 object-cover' src='/inDev.png' alt='' />
			<p className='font-semibold text-4xl text-[var(--black)]'>
				Данная страница находиться в разработке
			</p>
		</div>
	)
}
export default InDevelopment
