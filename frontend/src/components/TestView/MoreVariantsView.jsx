import { Check } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import CustomAudioPlayer from '../AudioPlayer'
import FormulaView from '../Viewer/FormulaView'

const StudentCheckbox = ({ id, disabled = false, onChange, answer }) => {
	const [checked, setChecked] = useState(false)

	const handleChange = () => {
		const newChecked = !checked
		setChecked(newChecked)
		if (onChange) onChange(id, newChecked)
	}

	return (
		<label
			className={`inline-flex items-center justify-between cursor-pointer  rounded-lg p-4 w-200 select-none transition-all font-medium   ${
				checked
					? 'bg-[var(--hero-epta)] text-white shadow-[var(--hero-shadow)]'
					: 'bg-[var(--white)] text-[var(--black)] shadow-[var(--shadow)]'
			} `}
		>
			{answer && <span>{answer}</span>}

			<span
				className={`relative w-5 h-5 flex items-center justify-center rounded bg-transparent transition
        
         
        `}
			>
				{checked && <Check size={24} color='white' strokeWidth={3} />}
				<input
					id={`student-answer-${id}`}
					type='checkbox'
					checked={checked}
					disabled={disabled}
					onChange={handleChange}
					className='appearance-none w-5 h-5 absolute opacity-0'
					tabIndex={0}
					htmlFor={`student-answer-${id}`}
				/>
			</span>
		</label>
	)
}

const MoreVariantView = ({
	question,
	Answers,
	onAnswerSelect,
	media,
	selected = [],
}) => {
	const handleChange = (id, checked) => {
		if (onAnswerSelect) {
			onAnswerSelect(id, checked)
		}
	}

	const shuffleAnswers = useMemo(() => {
		if (!Answers) return []
		return [...Answers].sort(() => Math.random() - 0.5)
	}, [Answers])

	return (
		<div className='flex flex-col justify-center items-center p-4 gap-5 w-3/4'>
			<p className='font-medium text-lg'>{question}</p>

			<p className='font-light text-[var(--middle)] text-sm'>
				Это вопрос с несколькими правильными ответами
			</p>
			<div className='w-full'>
				{media &&
					(media.type === 'audio' ? (
						<>
							<CustomAudioPlayer audioUrl={media.info} />
						</>
					) : media.type === 'photo' ? (
						<div className='aspect-video h-100 flex justify-center'>
							<img className='w-auto h-full' src={media.info} alt='' />
						</div>
					) : media.type === 'formula' ? (
						<>
							<FormulaView Formula={media.info} />
						</>
					) : (
						<></>
					))}
			</div>

			<div className='flex flex-col items-center gap-3 w-full'>
				{shuffleAnswers.map((answer, index) => (
					<StudentCheckbox
						key={index}
						id={index}
						answer={answer}
						checked={selected.includes(index)}
						onChange={handleChange}
					/>
				))}
			</div>
		</div>
	)
}

export default MoreVariantView
