import { useState, useEffect, useMemo } from 'react'
import { Check } from 'lucide-react'

// Кастомная радиокнопка
const StudentRadio = ({
	id,
	answer,
	selectedId,
	onChange,
	correctAnswerId,
}) => {
	const isSelected = selectedId === id
	const isCorrect = correctAnswerId === id
	const showCorrect = correctAnswerId !== null && correctAnswerId !== undefined

	const handleChange = () => {
		onChange(id)
	}

	return (
		<label
			className={`inline-flex items-center justify-between cursor-pointer rounded-lg p-4 w-3/4 select-none transition-all font-medium ${
				showCorrect && isCorrect
					? 'bg-[var(--correct)] text-[var(--correct-dark)] shadow-[var(--correct-shadow))]' // Правильный ответ
					: showCorrect && isSelected && !isCorrect
					? 'bg-[var(--not-correct)] text-[var(--not-correct-dark)] shadow-[var(--not-correct-shadow))]' // Неправильный выбранный ответ
					: isSelected
					? 'bg-[var(--hero-epta)] text-white shadow-[var(--hero-shadow)]' // Обычный выбранный ответ
					: 'bg-[var(--white)] text-[var(--black)] shadow-[var(--shadow)]' // Невыбранный ответ
			}`}
		>
			{answer && <span className=''>{answer}</span>}

			<span
				className={`relative w-5 h-5 flex items-center justify-center rounded bg-transparent transition
         
        `}
			>
				<input
					id={`student-answer-${id}`}
					type='radio'
					name='student-question'
					checked={isSelected}
					onChange={handleChange}
					className='appearance-none w-5 h-5 absolute opacity-0'
				/>
				{isSelected && <Check size={24} strokeWidth={3} />}
			</span>
		</label>
	)
}

const OneVariantView = ({
	question,
	Answers,
	onAnswerSelect,
	media,
	selectedId = null,
	shuffle = true,
	CorrectAnswer = null,
}) => {
	const handleSelect = id => {
		if (onAnswerSelect) onAnswerSelect(id)
	}

	const shuffleAnswers = useMemo(() => {
		if (shuffle) {
			if (!Answers) return []
			return [...Answers].sort(() => Math.random() - 0.5)
		}
		return Answers
	}, [Answers])

	return (
		<div className='flex flex-col gap-5 justify-center items-center p-4 w-3/4'>
			<p className='font-medium text-lg'>{question}</p>

			<p className='font-light text-[var(--middle)] text-sm'>
				Это вопрос с единственным правильным ответом
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
					<StudentRadio
						key={index}
						id={index}
						answer={answer}
						selectedId={selectedId}
						onChange={handleSelect}
						correctAnswerId={CorrectAnswer}
					/>
				))}
			</div>
		</div>
	)
}

export default OneVariantView
