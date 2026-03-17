import { useEffect, useState } from 'react'
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

export const ScoreMoodBlock = ({ onChange, value }) => {
	const [mood, setMood] = useState(0)
	const maxScore = 5
	const score = maxScore - mood

	useEffect(() => {
		if (value !== null) {
			setMood(value - 1)
		} else {
			setMood(0)
		}
	}, [value])

	const moodLevel = mood + 1 >= 4 ? 'good' : mood + 1 === 3 ? 'mid' : 'bad'

	const colors = {
		good: {
			bg: 'var(--mood-color1-bg)',
			dark: 'var(--mood-color1-dark)',
			pale: 'var(--mood-color1-pale)',
		},
		mid: {
			bg: 'var(--mood-color2-bg)',
			dark: 'var(--mood-color2-dark)',
			pale: 'var(--mood-color2-pale)',
		},
		bad: {
			bg: 'var(--mood-color3-bg)',
			dark: 'var(--mood-color3-dark)',
			pale: 'var(--mood-color3-pale)',
		},
	}

	const { bg, dark, pale } = colors[moodLevel]

	useEffect(() => {
		onChange?.(mood + 1)
	}, [mood])

	return (
		<div
			className='flex flex-col w-full h-fit rounded-xl items-center transition-all shadow-[var(--shadow)] p-2'
			style={{ backgroundColor: bg }}
		>
			{/* FACE */}
			<div className='flex items-center justify-center h-45'>
				<div className='flex flex-col items-center'>
					<div className='flex gap-5'>
						{[0, 1].map(i => (
							<div
								key={i}
								className={`transition-all duration-500 ${
									score <= 2
										? 'rounded-full h-30 w-30'
										: score === 3
											? 'rounded-full h-15 w-30'
											: 'rounded-full h-15 w-15'
								} ${score >= 4 ? (i === 0 ? '-rotate-90' : 'rotate-90') : ''}`}
								style={{ backgroundColor: dark }}
							/>
						))}
					</div>

					<div
						className={`transition-all duration-500 ${
							score >= 3 ? 'rotate-180' : 'rotate-0'
						}`}
					>
						<SmileSVG color={dark} />
					</div>
				</div>
			</div>

			{/* SCORE TEXT */}
			<p
				className='uppercase font-bold text-3xl transition-all'
				style={{ color: pale }}
			>
				{mood + 1}{' '}
				{mood + 1 === 1 ? 'балл' : mood + 1 === 5 ? 'баллов' : 'балла'}
			</p>

			{/* NUMBERS */}
			<div className='flex gap-2 p-2 rounded-lg bg-[var(--white)] shadow-inner w-full mx-auto'>
				{Array.from({ length: maxScore }).map((_, i) => {
					const score = i + 1
					const gradeColor = score >= 4 ? 'good' : score === 3 ? 'mid' : 'bad'

					return (
						<p
							onClick={() => {
								if (value === null) {
									setMood(i)
								}
							}}
							key={i}
							className={`${value !== null && mood !== i && 'opacity-50 grayscale-50'} uppercase text-center font-medium shadow-[var(--shadow)] text-mb w-full p-2 rounded-sm transition-all ${value === null && 'hover:scale-105 cursor-pointer'} `}
							style={{
								color:
									mood === i
										? colors[gradeColor].dark
										: colors[gradeColor].pale,
								backgroundColor:
									mood === i ? colors[gradeColor].pale : colors[gradeColor].bg,
							}}
						>
							{score}
						</p>
					)
				})}
			</div>

			{/* <textarea
				className='bg-[var(--white)] w-full p-1'
				name=''
				id=''
			></textarea> */}
		</div>
	)
}

export default MoodBlock
