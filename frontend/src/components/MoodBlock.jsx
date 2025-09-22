import { useState } from 'react'
import SmileSVG from '../../public/assets/smile'

const MoodBlock = () => {
	const [mood, setMood] = useState(0)
	const moods = ['хорошо', 'не плохо', 'плохо']

	const bgColor = `var(--mood-color${mood + 1}-bg)`
	const darkColor = `var(--mood-color${mood + 1}-dark)`
	const paleColor = `var(--mood-color${mood + 1}-pale)`

	return (
		<div
			className='flex flex-col w-full h-106 rounded-xl items-center transition-all shadow-[var(--shadow)] p-5'
			style={{ backgroundColor: bgColor }}
		>
			<p
				className='font-medium text-2xl transition-all'
				style={{ color: darkColor }}
			>
				Как твое настроение?
			</p>
			<div className='flex items-center justify-center h-45'>
				<div className='flex flex-col items-center'>
					<div className='flex gap-5'>
						<div
							className={`transition-all duration-500 ${
								mood === 0
									? 'rounded-full h-30 w-30'
									: mood === 1
									? 'rounded-full h-15 w-30'
									: mood === 2 && 'rounded-full h-15 w-15 -rotate-90'
							}`}
							style={{ backgroundColor: darkColor }}
						></div>
						<div
							className={`transition-all duration-500 ${
								mood === 0
									? 'rounded-full h-30 w-30'
									: mood === 1
									? 'rounded-full h-15 w-30'
									: mood === 2 && 'rounded-full h-15 w-15 rotate-90'
							}`}
							style={{ backgroundColor: darkColor }}
						></div>
					</div>
					<div
						className={`${
							mood > 0 ? 'rotate-180' : 'rotate-0'
						} transition-all duration-500`}
					>
						<SmileSVG color={darkColor} />
					</div>
				</div>
			</div>

			<p
				className='uppercase font-bold text-3xl mb-5 transition-all'
				style={{ color: paleColor }}
			>
				{moods[mood]}
			</p>

			<div
				className='relative rounded-2xl h-2 w-3/4 mx-auto flex items-center transition-all'
				style={{ backgroundColor: paleColor }}
			>
				<div
					onClick={() => setMood(2)}
					className='absolute left-0 h-4 w-4 rounded-full hover:scale-150 transition-all cursor-pointer'
					style={{ backgroundColor: paleColor }}
				></div>
				<div
					onClick={() => setMood(1)}
					className='absolute left-[50%] -translate-x-[50%] h-4 w-4 rounded-full hover:scale-150 transition-all cursor-pointer'
					style={{ backgroundColor: paleColor }}
				></div>
				<div
					onClick={() => setMood(0)}
					className='absolute right-0 h-4 w-4 rounded-full hover:scale-150 transition-all cursor-pointer'
					style={{ backgroundColor: paleColor }}
				></div>
				<div
					className={`absolute ${
						mood === 0
							? 'right-0 '
							: mood === 1
							? 'left-[50%] -translate-x-[50%]'
							: mood === 2 && 'left-0 '
					} h-8 w-8 rounded-full transition-all cursor-pointer`}
					style={{ backgroundColor: darkColor }}
				></div>
			</div>
			<div className='flex flex-row-reverse justify-between w-[85%] mx-auto mt-3 mb-5'>
				{moods.map((item, index) => (
					<p
						className='uppercase text-center font-medium text-mb transition-all'
						style={{ color: paleColor }}
						key={index}
					>
						{item}
					</p>
				))}
			</div>
			<button
				className='rounded-lg px-10 py-3 transition-all text-xl font-medium cursor-pointer hover:scale-105 active:scale-95'
				style={{ backgroundColor: darkColor, color: paleColor }}
			>
				Отправить
			</button>
		</div>
	)
}
export default MoodBlock
