import { BlackButton, GrayButton } from '../components/Buttons'
import { ProductCard } from '../components/Cards'
import Slider from '../components/Slider'

const MainPage = () => {
	return (
		<>
			<div className='px-20 py-10 '>
				<div className='w-full inline-flex flex-col justify-center mt-10'>
					<p className='text-[var(--text)] text-5xl text-center font-black leading-18'>
						Привет! Hi! <br /> МелГУ СУО 1.2 уже здесь!
					</p>
				</div>

				<Slider />

				<div className='w-full flex justify-center mt-10'>
					<img
						src='https://space.rosea.dev/pluginfile.php/1/theme_space/spacesettingsimgs/0/logo-sq.svg'
						alt=''
					/>
				</div>
				<div className='w-full inline-flex justify-center'>
					<p className='text-[var(--text)] text-2xl font-medium w-3/5 text-center'>
						«Поистине отличный шаблон и отличная поддержка. Очень точная
						документация со многими функциями хорошо объяснена.»
					</p>
				</div>
				<div className='w-full grid grid-cols-3 gap-10 mt-20'>
					<ProductCard
						namebtn={'Больше быстрых гайдов'}
						title={'Начните'}
						subtitle={
							'С вспомогательным текстом ниже как естественное введение к дополнительному контенту.'
						}
						color={1}
					>
						<svg
							width='60'
							height='60'
							viewBox='0 0 25 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M17.45 12C17.45 14.8995 15.0994 17.25 12.2 17.25C9.30046 17.25 6.94995 14.8995 6.94995 12C6.94995 9.10051 9.30046 6.75 12.2 6.75C15.0994 6.75 17.45 9.10051 17.45 12Z'
								stroke='currentColor'
								stroke-width='1.5'
								stroke-linecap='round'
								stroke-linejoin='round'
							></path>
							<path
								d='M14.7 13C14.7 13.2761 14.4761 13.5 14.2 13.5C13.9238 13.5 13.7 13.2761 13.7 13C13.7 12.7239 13.9238 12.5 14.2 12.5C14.4761 12.5 14.7 12.7239 14.7 13Z'
								stroke='currentColor'
								stroke-linecap='round'
								stroke-linejoin='round'
							></path>
							<path
								d='M9.94031 7.02836C7.63854 5.28601 5.78831 4.43988 5.21547 5.01271C4.33767 5.89052 6.79189 9.76794 10.6971 13.6732C14.6024 17.5784 18.4798 20.0327 19.3576 19.1549C19.9442 18.5682 19.0427 16.6419 17.2145 14.2629'
								stroke='currentColor'
								stroke-width='1.5'
								stroke-linecap='round'
								stroke-linejoin='round'
							></path>
						</svg>
					</ProductCard>
					<ProductCard
						namebtn={'Больше для учителей'}
						title={'Управляйте своим курсом'}
						subtitle={
							'С вспомогательным текстом ниже как естественное введение к дополнительному контенту.'
						}
						color={2}
					>
						<svg
							width='60'
							height='60'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M12 10.75V13.25M12 10.75H8.75M12 10.75H15.25M12 13.25L9.75 16.25M12 13.25L14.25 16.25M19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12Z'
								stroke='currentColor'
								stroke-width='1.5'
								stroke-linecap='round'
								stroke-linejoin='round'
							></path>
							<path
								d='M12.5 8C12.5 8.27614 12.2761 8.5 12 8.5C11.7239 8.5 11.5 8.27614 11.5 8C11.5 7.72386 11.7239 7.5 12 7.5C12.2761 7.5 12.5 7.72386 12.5 8Z'
								stroke='currentColor'
								stroke-linecap='round'
								stroke-linejoin='round'
							></path>
						</svg>
					</ProductCard>
					<ProductCard
						namebtn={'Cписок новых функций'}
						title={'Что нового'}
						subtitle={
							'С вспомогательным текстом ниже как естественное введение к дополнительному контенту.'
						}
					>
						<svg
							width='60'
							height='60'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M10 15.75C10 15.75 11 16.25 12 16.25C13 16.25 14 15.75 14 15.75M9.75 10.75V13.25M7 9.25C5.75736 9.25 4.75 8.24264 4.75 7C4.75 5.75736 5.75736 4.75 7 4.75C8.24264 4.75 9.25 5.75736 9.25 7M17 9.25C18.2426 9.25 19.25 8.24264 19.25 7C19.25 5.75736 18.2426 4.75 17 4.75C15.7574 4.75 14.75 5.75736 14.75 7M14.25 10.75V13.25M18.25 13C18.25 16.4518 15.4518 19.25 12 19.25C8.54822 19.25 5.75 16.4518 5.75 13C5.75 9.54822 8.54822 6.75 12 6.75C15.4518 6.75 18.25 9.54822 18.25 13Z'
								stroke='currentColor'
								stroke-width='1.5'
								stroke-linecap='round'
								stroke-linejoin='round'
							></path>
						</svg>
					</ProductCard>
				</div>
			</div>
		</>
	)
}
export default MainPage
