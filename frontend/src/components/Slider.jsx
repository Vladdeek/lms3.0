import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { BlackButton, GrayButton } from './Buttons'

const Slider = () => {
	const Slides = [
		{
			image:
				'https://i.pinimg.com/736x/49/92/b2/4992b25ad56cb8ef454e32b651c2cbed.jpg',
			title: 'Привет, Moodle 4!',
			subtitle:
				'МелГУ СУО 1.2 предназначен для Moodle версий 4.5, 4.4, 4.3, 4.2 и 4,1, а МелГУ СУО 1.1 - для Moodle версий 3.9 - 3.11.',
			description:
				'Нужна помощь с настройкой темы? Или вы хотите сообщить об ошибке?',
		},
		{
			image:
				'https://space.rosea.dev/pluginfile.php/1/theme_space/block1slideimg2/1749469386/hero-2.jpg',
			title: 'Запрос функций',
			subtitle:
				'МелГУ СУО 1.2 предназначен для Moodle версий 4.5, 4.4, 4.3, 4.2 и 4,1, а МелГУ СУО 1.1 - для Moodle версий 3.9 - 3.11.',
			description:
				'Нужна помощь с настройкой темы? Или вы хотите сообщить об ошибке?',
		},
		{
			image:
				'https://space.rosea.dev/pluginfile.php/1/theme_space/block1slideimg3/1749469386/hero-3.jpg',
			title: 'Просто прелесть!',
			subtitle:
				'МелГУ СУО 1.2 предназначен для Moodle версий 4.5, 4.4, 4.3, 4.2 и 4,1, а МелГУ СУО 1.1 - для Moodle версий 3.9 - 3.11.',
			description:
				'Нужна помощь с настройкой темы? Или вы хотите сообщить об ошибке?',
		},
	]

	const [slideNow, setSlideNow] = useState(0)
	const intervalRef = useRef(null)
	const pauseTimeoutRef = useRef(null)

	const goToNextSlide = () => {
		setSlideNow(prev => (prev + 1) % Slides.length)
	}

	const startAutoSlide = () => {
		clearInterval(intervalRef.current)
		intervalRef.current = setInterval(goToNextSlide, 5000)
	}

	const pauseAutoSlide = () => {
		clearInterval(intervalRef.current)
		clearTimeout(pauseTimeoutRef.current)
		pauseTimeoutRef.current = setTimeout(() => {
			startAutoSlide()
		}, 15000)
	}

	useEffect(() => {
		startAutoSlide()
		return () => {
			clearInterval(intervalRef.current)
			clearTimeout(pauseTimeoutRef.current)
		}
	}, [])

	const nextSlide = () => {
		setSlideNow(prev => (prev + 1) % Slides.length)
		pauseAutoSlide()
	}

	const prevSlide = () => {
		setSlideNow(prev => (prev - 1 + Slides.length) % Slides.length)
		pauseAutoSlide()
	}

	const progressWidth = `${((slideNow + 1) / Slides.length) * 100}%`

	return (
		<>
			<div className='relative rounded-md md:flex md:flex-col overflow-hidden h-150'>
				{/* Прогрессбар */}
				<div className='absolute w-[98%] rounded-full bg-[var(--glass)] h-2 top-3 mx-3 backdrop-blur-xs z-21'>
					<div
						className='rounded-full backdrop-blur-sm absolute inset-0 z-0 transition-all'
						style={{ filter: "url('/glass.svg#lg-dist')" }}
					></div>
					<div className='rounded-full shadow-[inset_1px_1px_1px_0_var(--glass-light-border),inset_-1px_-1px_2px_0_var(--glass-dark-border)] absolute inset-0 z-0 transition-all'></div>
					<div
						className='absolute rounded-full bg-[var(--primary)] h-2 transition-all duration-300'
						style={{ width: progressWidth }}
					></div>
				</div>

				<div className='z-20 rounded-md w-full lg:w-4/5 xl:w-3/5 2xl:w-2/5 h-auto p-5 lg:p-10 text-center lg:absolute lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 relative bg-[var(--glass-bg)]'>
					{/* Эффект изгиба стекла */}
					<div
						className='rounded-md backdrop-blur-sm absolute inset-0 z-0'
						style={{ filter: "url('/glass.svg#lg-dist')" }}
					></div>
					<div className='rounded-md  shadow-[inset_1px_1px_1px_0_var(--glass-light-border),inset_-1px_-1px_2px_0_var(--glass-dark-border)] absolute inset-0 z-0'></div>
					<div className='inline-flex flex-col items-center gap-3 relative z-[3]'>
						<p className='text-[var(--text)] md:text-2xl xl:text-3xl font-semibold '>
							{Slides[slideNow].title}
						</p>
						<p className='text-[var(--text)] text-md font-medium w-6/7 text-center'>
							{Slides[slideNow].subtitle}
						</p>
						<p className='text-[var(--text)] text-sm font-normal w-1/2 text-center'>
							{Slides[slideNow].description}
						</p>
						<div className='inline-flex xl:flex-col gap-3'>
							<div className='inline-flex mx-auto'>
								<GrayButton namebtn={'Получить эту тему!'} />
							</div>
							<div className='inline-flex mx-auto'>
								<BlackButton title={'МелГУ СУО 1.2 для Moodle 4.5 - 4.0 '} />
							</div>
						</div>
					</div>
				</div>

				{/* Картинка */}
				<img
					src={Slides[slideNow].image}
					alt={`Slide ${slideNow + 1}`}
					className='w-full transition-all'
				/>

				{/* Кнопки */}
				<button
					onClick={prevSlide}
					className='absolute left-3 top-1/2 transform -translate-y-1/2 rounded-full text-[#f4f4f4] p-2 hover:scale-105 transition-all bg-[var(--glass-bg)]'
				>
					<ChevronLeft className='z-10 relative' />
					<div
						className='rounded-full backdrop-blur-sm absolute inset-0 z-0 transition-all'
						style={{ filter: "url('/glass.svg#lg-dist')" }}
					></div>
					<div className='rounded-full shadow-[inset_1px_1px_1px_0_var(--glass-light-border),inset_-1px_-1px_2px_0_var(--glass-dark-border)] absolute inset-0 z-0 transition-all'></div>
				</button>
				<button
					onClick={nextSlide}
					className='absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full text-[#f4f4f4] p-2 hover:scale-105 transition-all bg-[var(--glass-bg)]'
				>
					<ChevronRight className='z-10 relative' />
					<div
						className='rounded-full backdrop-blur-sm absolute inset-0 z-0 transition-all'
						style={{ filter: "url('/glass.svg#lg-dist')" }}
					></div>
					<div className='rounded-full shadow-[inset_1px_1px_1px_0_var(--glass-light-border),inset_-1px_-1px_2px_0_var(--glass-dark-border)] absolute inset-0 z-0 transition-all'></div>
				</button>
			</div>
		</>
	)
}

export default Slider
