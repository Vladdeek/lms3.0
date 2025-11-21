import { useState, useEffect, use } from 'react'
import { Check, X, Plus } from 'lucide-react'
import { InputDefault } from '../Inputs'
import { Button } from '../Buttons'
import { AddMediaButton } from './AddMedia'
import { ScoreInput1 } from './ScoreInput'
import { API } from '../../API'
import Loader from '../Loader'
import { getCookie, token } from '../../TOKEN'
import axios from 'axios'
import { setGlobalError } from '../Errors'

// Компонент для нескольких правильных ответов
const CheckboxCreateMultiple = ({
	id,
	value = '',
	isCorrect = false,
	checked = false,
	onChange,
	onAnswerChange,
	onCorrectChange,
	onDelete,
	label = '',
	disabled = false,
	className = '',
	showInput = true,
	showCorrectToggle = true,
	canDelete = false,
}) => {
	const handleCheckboxChange = e => {
		onChange?.(e.target.checked)
	}

	const handleAnswerChange = e => {
		onAnswerChange?.(e.target.value)
	}

	const handleCorrectChange = e => {
		onCorrectChange?.(e.target.checked)
	}

	const handleDelete = () => {
		onDelete?.(id)
	}

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
								isCorrect
									? 'bg-[var(--hero-epta)] border-[var(--hero-epta)]'
									: 'bg-transparent border-[var(--middle)]'
							}
							${disabled ? 'pointer-events-none' : ''}
						`}
					>
						<input
							id={`correct-multiple-${id}`}
							type='checkbox'
							checked={isCorrect}
							disabled={disabled}
							onChange={handleCorrectChange}
							className='appearance-none w-5 h-5 absolute opacity-0'
							tabIndex={0}
						/>
						{isCorrect && <Check size={18} color='white' strokeWidth={3} />}
					</span>
				</label>
			)}

			{showInput && (
				<input
					type='text'
					value={value}
					onChange={handleAnswerChange}
					disabled={disabled}
					placeholder='Введите ответ...'
					className={`flex w-full px-3 py-2 shadow-[var(--shadow)] rounded-lg focus:outline-none focus:ring-2 placeholder:text-[var(--middle)] text-[var(--black)] focus:ring-[var(--hero-epta)] transition-all ${
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
	testId,
	sectionId,
	onChange,
}) => {
	const [question, setQuestion] = useState('')
	const [score, setScore] = useState(1)
	const [answers, setAnswers] = useState([
		{ option_code: '1', name: '', correct: false },
		{ option_code: '2', name: '', correct: false },
	])

	const [isLoading, setIsLoading] = useState(false)

	const [media, setMedia] = useState()

	const [showMassage, setShowMassage] = useState(false)

	const [index, setIndex] = useState(0)

	const showMessageFunc = () => {
		setShowMassage(true)
		setTimeout(() => {
			setShowMassage(false)
		}, 5000)
		return
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
			prev.map(answer =>
				answer.option_code === id ? { ...answer, correct: isCorrect } : answer
			)
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

	const getCorrectAnswers = () => {
		return answers.filter(answer => answer.correct)
	}

	const handleQuestionChange = e => {
		setQuestion(e.target.value)
	}

	const fetchTest = async id => {
		try {
			const res = await axios.get(`${API}/questions/${id}`, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			const data = res.data

			if (data) setIsLoading(false)
			setQuestion(data?.title)
			setScore(data?.score)
			setMedia(data?.media)
			setAnswers(data?.question_options)
		} catch (error) {
			console.error('Ошибка при загрузке теста:', error)
			setGlobalError(error.response?.status || '500')
		}
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

		const correctAnswers = getCorrectAnswers()

		try {
			const res = await axios.post(
				`${API}/questions/test/${sectionId}`,
				{
					question_type: 'multiple',
					title: question,
					score: Number(score),
					answer_data: {
						type: 'multiple',
						correct_answer: correctAnswers.map(answer => answer.name) || [],
					},
					question_options: answers.map(answer => ({
						name: answer?.name,
						option_code: answer?.option_code,
					})),
					media: media || {},
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				}
			)

			const data = res.data
			onChange?.(data?.id)
			fetchTest(data?.id)
		} catch (error) {
			console.error(error)
			setGlobalError(error.response?.status || '500')
		}
	}

	const handleEdit = async () => {
		const correctAnswers = getCorrectAnswers()

		try {
			const res = await axios.put(
				`${API}/questions/${testId}`,
				{
					question_type: 'multiple',
					title: question,
					score: Number(score),
					answer_data: {
						type: 'multiple',
						correct_answer: correctAnswers.map(answer => answer.name) || [],
					},
					question_options: answers.map(answer => ({
						name: answer?.name,
						option_code: answer?.option_code,
					})),
					media: media || {},
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				}
			)

			const data = res.data
			fetchTest(data?.id)
		} catch (error) {
			console.error(error)
			setGlobalError(error.response?.status || '500')
		}
	}

	useEffect(() => {
		setIsLoading(true)
		if (testId) fetchTest(testId)
		else {
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
							<h3 className='text-lg font-medium mb-2 text-[var(--middle)]'>
								Варианты ответов:
							</h3>
							{answers.map((answer, index) => (
								<CheckboxCreateMultiple
									key={answer.option_code}
									id={answer.option_code}
									value={answer.name}
									isCorrect={answer.correct}
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
			<button
				onClick={handleSave}
				className='bg-[var(--black)] text-[var(--white)] rounded-lg w-fit self-center px-4 py-2 cursor-pointer hover:bg-[var(--hero-epta)] hover:text-white transition-all active:scale-95'
			>
				{testId ? 'Обновить' : 'Сохранить'}
			</button>
		</>
	)
}

export default MoreVariant
