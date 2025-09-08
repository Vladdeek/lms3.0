import { Angry, Frown, Smile } from 'lucide-react'
import { useEffect, useState } from 'react'

export const ScoreInput1 = () => {
	return (
		<div className='flex flex-col'>
			<p className='text-[var(--middle)] mb-2'>Балл</p>
			<input
				type={'number'}
				className='rounded-xl p-[10px] shadow-[var(--shadow)] outline-0 focus:ring-1 focus:ring-[var(--hero-epta)] transition text-lg font-medium w-20'
			/>
		</div>
	)
}

export const ScoreInput2 = () => {
	const levels = [
		{
			colorbg: 'var(--easy-lvl-bg)',
			colortext: 'var(--easy-lvl-text)',
			icon: <Smile size={32} />,
			title: 'Легкий',
		},
		{
			colorbg: 'var(--mid-lvl-bg)',
			colortext: 'var(--mid-lvl-text)',
			icon: <Frown size={32} />,
			title: 'Средний',
		},
		{
			colorbg: 'var(--hard-lvl-bg)',
			colortext: 'var(--hard-lvl-text)',
			icon: <Angry size={32} />,
			title: 'Сложный',
		},
	]
	const [isActive, setIsActive] = useState(0)
	return (
		<div className='flex justify-between'>
			{levels.map((item, index) => {
				return (
					<button
						onClick={() => setIsActive(index)}
						className={`h-35 w-35 rounded-lg flex flex-col gap-3 justify-center items-center font-medium ${
							isActive !== index && 'grayscale-95'
						}`}
						style={{ backgroundColor: item.colorbg, color: item.colortext }}
					>
						{item.icon}
						{item.title}
					</button>
				)
			})}
		</div>
	)
}
