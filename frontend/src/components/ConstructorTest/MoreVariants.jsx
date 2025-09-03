import { useState, useEffect } from 'react'
import { Check, X, Plus } from 'lucide-react'
import { InputDefault } from '../Inputs'
import { Button } from '../Buttons'
import { AddMediaButton } from './AddMedia'

// Компонент для нескольких правильных ответов
const CheckboxCreateMultiple = ({
	checked: checkedProp = false,
	onChange,
	onAnswerChange,
	onCorrectChange,
	onDelete,
	label = '',
	answer = '',
	isCorrect = false,
	id,
	disabled = false,
	className = '',
	showInput = true,
	showCorrectToggle = true,
	canDelete = false,
}) => {
	const [checked, setChecked] = useState(checkedProp)
	const [answerText, setAnswerText] = useState(answer)
	const [correct, setCorrect] = useState(isCorrect)

	const handleCheckboxChange = e => {
		const value = e.target.checked
		setChecked(value)
		onChange && onChange(value)
	}

	const handleAnswerChange = e => {
		const value = e.target.value
		setAnswerText(value)
		onAnswerChange && onAnswerChange(value)
	}

	const handleCorrectChange = e => {
		const value = e.target.checked
		setCorrect(value)
		onCorrectChange && onCorrectChange(value)
	}

	const handleDelete = () => {
		onDelete && onDelete(id)
	}

	useEffect(() => {
		if (checked !== checkedProp) {
			setChecked(checkedProp)
		}
	}, [checkedProp])

	useEffect(() => {
		if (answerText !== answer) {
			setAnswerText(answer)
		}
	}, [answer])

	useEffect(() => {
		if (correct !== isCorrect) {
			setCorrect(isCorrect)
		}
	}, [isCorrect])

	return (
		<div className={`flex items-center gap-3 w-full ${className}`}>
			{showCorrectToggle && (
				<label
					className={`inline-flex items-center gap-2 cursor-pointer select-none ${
						disabled ? 'opacity-50 cursor-not-allowed' : ''
					}`}
					htmlFor={`correct-multiple-${id}`}
				>
					<span
						className={`w-5 h-5 flex items-center justify-center rounded border transition
              ${
								correct
									? 'bg-[var(--hero-epta)] border-[var(--hero-epta)]'
									: 'bg-transparent border-[var(--middle)]'
							}
              ${disabled ? 'pointer-events-none' : ''}
            `}
					>
						<input
							id={`correct-multiple-${id}`}
							type='checkbox'
							checked={correct}
							disabled={disabled}
							onChange={handleCorrectChange}
							className='appearance-none w-5 h-5 absolute opacity-0'
							tabIndex={0}
						/>
						{correct && <Check size={18} color='white' strokeWidth={3} />}
					</span>
				</label>
			)}

			{showInput && (
				<input
					type='text'
					value={answerText}
					onChange={handleAnswerChange}
					disabled={disabled}
					placeholder='Введите ответ...'
					className={`flex w-full px-3 py-2 shadow-[var(--shadow)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--hero-epta)] transition-all ${
						disabled ? 'bg-[var(--light-gray)] opacity-50' : 'bg-transparent'
					}`}
				/>
			)}

			<button
				onClick={handleDelete}
				className={`p-2 ${
					canDelete
						? 'text-[var(--red-status-text)] bg-[var(--red-status-bg)] hover:bg-red-500 hover:text-white cursor-pointer'
						: 'text-[var(--middle)] bg-[var(--light-middle)] cursor-not-allowed'
				} rounded-lg transition-colors`}
				aria-label='Удалить вариант ответа'
				disabled={!canDelete}
			>
				<X size={18} />
			</button>
		</div>
	)
}

const MoreVariant = ({
	currentType,
	setQuestions,
	questions,
	setActiveIndex,
}) => {
	const [answers, setAnswers] = useState([
		{ id: '1', text: '', correct: false },
		{ id: '2', text: '', correct: false },
	])

	const handleAnswerChange = (id, text) => {
		setAnswers(prev =>
			prev.map(answer => (answer.id === id ? { ...answer, text } : answer))
		)
	}

	const handleCorrectChange = (id, isCorrect) => {
		setAnswers(prev =>
			prev.map(answer =>
				answer.id === id ? { ...answer, correct: isCorrect } : answer
			)
		)
	}

	const handleCheckChange = (id, checked) => {
		setAnswers(prev =>
			prev.map(answer => (answer.id === id ? { ...answer, checked } : answer))
		)
	}

	const handleAddAnswer = () => {
		const maxId = Math.max(...answers.map(answer => parseInt(answer.id)))
		const newId = (maxId + 1).toString()
		setAnswers(prev => [...prev, { id: newId, text: '', correct: false }])
	}

	const handleDeleteAnswer = id => {
		if (answers.length <= 2) return
		setAnswers(prev => prev.filter(answer => answer.id !== id))
	}

	const getCorrectAnswersCount = () => {
		return answers.filter(answer => answer.correct).length
	}

	return (
		<>
			<div className='flex'>
				<div className='flex flex-col justify-center items-end p-4 w-3/4'>
					<div className='flex flex-col gap-3 w-2/3 mb-5'>
						<InputDefault title={'Введите вопрос'} required={true} />
						<AddMediaButton />
					</div>

					<div className='flex flex-col items-center gap-3 w-2/3'>
						<div className='flex flex-col items-center gap-3 w-full'>
							<h3 className='text-lg font-medium mb-2 text-[var(--middle)]'>
								Варианты ответов:
							</h3>
							{answers.map((answer, index) => (
								<CheckboxCreateMultiple
									key={answer.id}
									id={answer.id}
									answer={answer.text}
									isCorrect={answer.correct}
									checked={answer.checked}
									onAnswerChange={text => handleAnswerChange(answer.id, text)}
									onCorrectChange={correct =>
										handleCorrectChange(answer.id, correct)
									}
									onChange={checked => handleCheckChange(answer.id, checked)}
									onDelete={handleDeleteAnswer}
									label={`Вариант ${index + 1}`}
									canDelete={answers.length > 2}
								/>
							))}
						</div>
					</div>

					<button
						onClick={handleAddAnswer}
						className='flex items-center w-2/3 gap-3 mt-3 justify-center py-2 bg-[var(--light-middle)] text-[var(--middle)] rounded-lg hover:bg-[var(--black)] hover:text-[var(--white)] transition-all active:scale-95'
					>
						<Plus size={18} />
						Добавить вариант ответа
					</button>

					<div className='mt-6 p-4 bg-gray-50 rounded-md w-1/3 hidden'>
						<h4 className='font-medium mb-2'>Текущее состояние:</h4>
						<pre className='text-sm'>{JSON.stringify(answers, null, 2)}</pre>
					</div>
				</div>
				<div className=' flex justify-center items-center  w-1/4'>
					<p className='border-3 border-dashed p-5 rounded-xl border-[var(--light-middle)] font-light text-[var(--middle)]'>
						<span className='text-center w-full flex justify-center'>
							Как создать вопрос:
						</span>
						<br /> 1. Заголовок: Четко сформулируйте задание. <br />
						2. Варианты ответов: Внесите все возможные варианты. <br /> 3. Выбор
						правильных ответов: Отметьте галочкой несколько пунктов.
					</p>
				</div>
			</div>
		</>
	)
}

export default MoreVariant
