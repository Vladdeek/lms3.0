import { Check } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import CustomAudioPlayer from '../AudioPlayer'
import FormulaView from '../Viewer/FormulaView'

const StudentCheckbox = ({
	id,
	disabled = false,
	onChange,
	answer,
	checked = false,
	correctAnswers = [],
	showCorrect = false,
}) => {
	const isCorrect = correctAnswers.includes(id)
	const isIncorrectSelected = checked && !isCorrect
	const isCorrectSelected = checked && isCorrect
	const shouldShowCorrect = showCorrect && isCorrect

	const handleChange = () => {
		const newChecked = !checked
		if (onChange) onChange(id, newChecked)
	}

	return (
		<label
			className={`inline-flex items-center justify-between cursor-pointer rounded-lg p-4 w-3/4 select-none transition-all font-medium ${
				shouldShowCorrect
					? 'bg-[var(--correct)] text-[var(--correct-dark)] shadow-[var(--correct-shadow))]' // Правильный ответ
					: isIncorrectSelected
					? 'bg-[var(--not-correct)] text-[var(--not-correct-dark)] shadow-[var(--not-correct-shadow))]' // Неправильный выбранный ответ
					: isCorrectSelected
					? 'bg-[var(--correct)] text-[var(--correct-dark)] shadow-[var(--correct-shadow))]' // Правильный выбранный ответ
					: checked
					? 'bg-[var(--hero-epta)] text-white shadow-[var(--hero-shadow)]' // Обычный выбранный ответ
					: 'bg-[var(--white)] text-[var(--black)] shadow-[var(--shadow)]' // Невыбранный ответ
			} `}
		>
			{answer && <span>{answer}</span>}

			<span className='relative w-5 h-5 flex items-center justify-center rounded bg-transparent transition'>
				{checked && <Check size={24} strokeWidth={3} />}
				<input
					id={`student-answer-${id}`}
					type='checkbox'
					checked={checked}
					disabled={disabled}
					onChange={handleChange}
					className='appearance-none w-5 h-5 absolute opacity-0'
					tabIndex={0}
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
	shuffle = true,
	correctAnswers = [],
	showCorrect = false,
}) => {
	const handleChange = (id, checked) => {
		if (onAnswerSelect && !showCorrect) {
			// Блокируем изменения при показе правильных ответов
			onAnswerSelect(id, checked)
		}
	}

	const shuffleAnswers = useMemo(() => {
		if (shuffle) {
			if (!Answers) return []
			return [...Answers].sort(() => Math.random() - 0.5)
		}
		return Answers
	}, [Answers, shuffle])

	return (
		<div className='flex flex-col justify-center items-center p-4 gap-5 w-3/4'>
			<p className='font-medium text-lg'>{question}</p>

			<p className='font-light text-[var(--middle)] text-sm'>
				Это вопрос с несколькими правильными ответами
				{showCorrect && ' (показаны правильные ответы)'}
			</p>

			<div className='w-full'>
				{media &&
					(media.type === 'audio' ? (
						<CustomAudioPlayer audioUrl={media.info} />
					) : media.type === 'photo' ? (
						<div className='aspect-video h-100 flex justify-center'>
							<img className='w-auto h-full' src={media.info} alt='' />
						</div>
					) : media.type === 'formula' ? (
						<FormulaView Formula={media.info} />
					) : null)}
			</div>

			<div className='flex flex-col items-center gap-3 w-full'>
				{shuffleAnswers.map((answer, index) => (
					<StudentCheckbox
						key={index}
						id={index}
						answer={answer}
						checked={selected.includes(index)}
						onChange={handleChange}
						correctAnswers={correctAnswers}
						showCorrect={showCorrect}
						disabled={showCorrect} // Блокируем изменения при показе правильных ответов
					/>
				))}
			</div>
		</div>
	)
}

export default MoreVariantView
