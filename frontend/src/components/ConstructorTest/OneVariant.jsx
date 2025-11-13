import { useState, useEffect } from 'react'
import { Check, X, Plus } from 'lucide-react'
import { InputDefault } from '../Inputs'
import { AddMediaButton } from './AddMedia'
import { ScoreInput1 } from './ScoreInput'
import { API } from '../../API'
import Loader from '../Loader'
import { token } from '../../TOKEN'

const CheckboxCreate = ({
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
					htmlFor={`correct-${id}`}
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
							id={`correct-${id}`}
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
					className={`flex w-full px-3 py-2 shadow-[var(--shadow)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--hero-epta)] placeholder:text-[var(--middle)] text-[var(--black)] transition-all ${
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

const OneVariant = ({ sectionId, testId, onChange }) => {
	const [question, setQuestion] = useState('')
	const [score, setScore] = useState(1)
	const [answers, setAnswers] = useState([
		{ option_code: '1', name: '', correct: false },
		{ option_code: '2', name: '', correct: false },
	])
	const [media, setMedia] = useState()

	const [questionId, setQuestionId] = useState()

	useEffect(() => {
		testId && setQuestionId(testId)
	}, [])

	const [showMassage, setShowMassage] = useState(false)

	const showMessageFunc = () => {
		setShowMassage(true)
		setTimeout(() => {
			setShowMassage(false)
		}, 5000)
		return
	}

	const [isLoading, setIsLoading] = useState(false)

	const [withAnswers, setWithAnswers] = useState(true)

	const handleQuestionChange = e => {
		setQuestion(e.target.value)
	}

	const handleScoreChange = value => {
		setScore(value)
	}

	const handleAnswerChange = (id, text) => {
		setAnswers(prev =>
			prev.map(answer =>
				answer.option_code === id ? { ...answer, name: text } : answer
			)
		)
	}

	const handleCorrectChange = (id, isCorrect) => {
		setAnswers(prev =>
			prev.map(answer => ({
				...answer,
				correct: answer.option_code === id ? isCorrect : false,
			}))
		)
	}

	const handleCheckChange = (id, checked) => {
		setAnswers(prev =>
			prev.map(answer =>
				answer.option_code === id ? { ...answer, checked } : answer
			)
		)
	}

	const handleAddAnswer = () => {
		const maxId = Math.max(
			...answers.map(answer => parseInt(answer.option_code))
		)
		const newId = (maxId + 1).toString()
		setAnswers(prev => [
			...prev,
			{ option_code: newId, name: '', correct: false },
		])
	}

	const handleDeleteAnswer = id => {
		if (answers.length <= 2) return
		setAnswers(prev => prev.filter(answer => answer.option_code !== id))
	}

	const fetchTest = async id => {
		const res = await fetch(`${API}/questions/${id}`, {
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
		})
		const data = await res.json()

		console.log(data)

		if (data) setIsLoading(false)
		setQuestion(data?.title)
		setScore(data?.score)
		setMedia(data?.media)
		setAnswers(data?.question_options)
	}

	const hasDuplicateAnswers = answers => {
		const names = answers.map(a => a.name.trim())
		const unique = new Set(names)
		return unique.size !== names.length
	}

	const handleCreate = async () => {
		if (hasDuplicateAnswers(answers)) {
			showMessageFunc()
			return
		}
		const correctAnswer = answers.find(answer => answer.correct)

		try {
			const res = await fetch(`${API}/questions/test/${sectionId}`, {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					question_type: 'single',
					title: question,
					score: Number(score),
					answer_data: {
						type: 'single',
						correct_answer: correctAnswer ? correctAnswer?.name : '',
					},
					question_options: answers.map(answer => ({
						name: answer?.name,
						option_code: answer?.option_code,
					})),
					media: media || [],
				}),
			})

			if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`)
			const data = await res.json()

			onChange?.(data?.id)

			console.log('questionId: ', questionId)

			fetchTest(questionId)
		} catch (error) {
			console.error(error)
		}
	}
	const handleEdit = async () => {
		if (hasDuplicateAnswers(answers)) {
			showMessageFunc()
			return
		}

		const correctAnswer = answers.find(answer => answer.correct)

		try {
			const res = await fetch(`${API}/questions/${questionId}`, {
				method: 'PUT',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					question_type: 'single',
					title: question,
					score: Number(score),
					answer_data: {
						type: 'single',
						correct_answer: correctAnswer ? correctAnswer.text : '',
					},
					question_options: answers.map(answer => ({
						name: answer?.text,
						option_code: answer?.id,
					})),
					media: media || [],
				}),
			})

			if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`)
			const data = await res.json()

			fetchTest(questionId)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		setIsLoading(true)
		if (testId) {
			fetchTest(testId)
		} else {
			setQuestion('')
			setScore(1)
			setMedia({})
			setAnswers([
				{ option_code: '1', name: '', correct: false },
				{ option_code: '2', name: '', correct: false },
			])
			setIsLoading(false)
		}
	}, [testId])

	const handleSave = () => {
		testId ? handleEdit() : handleCreate()
	}

	return isLoading ? (
		<Loader />
	) : (
		<>
			<div
				className={`relative h-full w-full flex justify-center items-center transition-all  ${
					showMassage ? '-top-15 opacity-100' : '-top-40 opacity-0'
				}`}
			>
				<div className='absolute text-[var(--red-status-text)] bg-[var(--red-status-bg)] rounded-xl p-2'>
					<p className='text-center mb-1 font-medium'>Дубликаты!</p>
					<p className='text-[var(--red-status-text)] px-3 py-2 bg-[var(--hard-lvl-bg)] rounded-lg'>
						В вопросах находятся дубликаты
					</p>
				</div>
			</div>
			<div className='flex'>
				<div className='flex flex-col justify-center items-end p-4 w-3/4'>
					<div className='flex flex-col gap-3 w-2/3 mb-5'>
						<div className='flex gap-3 items-end'>
							<InputDefault
								title={'Введите вопрос'}
								required={true}
								value={question}
								onChange={handleQuestionChange}
							/>
							<ScoreInput1 value={score} onChange={setScore} />
						</div>

						<AddMediaButton
							onChange={setMedia}
							type={media?.type}
							info={media?.info}
						/>
					</div>

					<div className='flex flex-col items-center gap-3 w-2/3'>
						<div className='flex flex-col items-center gap-3 w-full'>
							<div className='flex gap-3 items-center'>
								<p className='text-lg font-medium text-[var(--middle)]'>
									Варианты ответов
								</p>
							</div>
							{withAnswers &&
								answers.map((answer, index) => (
									<CheckboxCreate
										key={answer?.option_code}
										id={answer?.option_code}
										answer={answer?.name}
										isCorrect={answer?.correct}
										checked={answer.checked}
										onAnswerChange={text =>
											handleAnswerChange(answer.option_code, text)
										}
										onCorrectChange={correct =>
											handleCorrectChange(answer.option_code, correct)
										}
										onChange={checked =>
											handleCheckChange(answer.option_code, checked)
										}
										onDelete={handleDeleteAnswer}
										label={`Вариант ${index + 1}`}
										canDelete={answers.length > 2}
									/>
								))}
						</div>
					</div>
					{withAnswers && (
						<button
							onClick={handleAddAnswer}
							className='flex items-center w-2/3 gap-3 mt-3 justify-center py-2 bg-[var(--light-middle)] text-[var(--middle)] rounded-lg hover:bg-[var(--black)] hover:text-[var(--white)] transition-all active:scale-95'
						>
							<Plus size={18} />
							Добавить вариант ответа
						</button>
					)}
				</div>
				<div className=' flex justify-center items-center  w-1/4'>
					<p className='border-3 border-dashed p-5 rounded-xl border-[var(--light-middle)] font-light text-[var(--middle)]'>
						<span className='text-center w-full flex justify-center'>
							Как создать вопрос:
						</span>
						<br /> 1. Заголовок: Четко сформулируйте задание. <br />
						2. Варианты ответов: Внесите все возможные варианты. <br /> 3. Выбор
						правильного ответа: Отметьте галочкой только один пункт.
					</p>
				</div>
			</div>
			<button
				onClick={handleSave}
				className='bg-[var(--black)] text-[var(--white)] rounded-lg w-fit self-center px-4 py-2 cursor-pointer hover:bg-[var(--hero-epta)] hover:text-white transition-all active:scale-95'
			>
				{testId ? 'Обновить' : 'Сохранить'}
			</button>
		</>
	)
}

export default OneVariant
