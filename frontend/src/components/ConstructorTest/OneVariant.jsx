import { useState, useEffect } from 'react'
import { Check, X, Plus, Trash2, Save } from 'lucide-react'
import { InputDefault } from '../Inputs'
import { AddMediaButton } from './AddMedia'
import { ScoreInput1 } from './ScoreInput'
import api, { API } from '../../API'
import Loader from '../Loader'
import { getCookie, token } from '../../TOKEN'
import axios from 'axios'
import { set } from 'date-fns'
import QuestionDeleteModal from './QuestionDeleteModal'

const MIN_COUNT_ANSWERS = 4

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

const OneVariant = ({ sectionId, testId, onChange, deletedQuestion }) => {
	const [question, setQuestion] = useState('')
	const [score, setScore] = useState(1)
	const [answers, setAnswers] = useState([
		{ option_code: '1', name: '', correct: false },
		{ option_code: '2', name: '', correct: false },
		{ option_code: '3', name: '', correct: false },
		{ option_code: '4', name: '', correct: false },
	])
	const [media, setMedia] = useState([])

	const [questionId, setQuestionId] = useState()

	const [validate, setValidate] = useState(false)

	const [deleteModalActive, setDeleteModalActive] = useState(false)

	useEffect(() => {
		const isInvalid = () => {
			if (!question.trim()) return true
			if (typeof score !== 'number' || score < 1 || score > 5) return true
			for (let ans of answers) {
				if (!ans.name.trim()) return true
			}
			if (!answers.some(ans => ans.correct)) return true

			return false
		}

		setValidate(isInvalid())
	}, [question, score, answers])

	useEffect(() => {
		testId ? setQuestionId(testId) : setQuestionId('')
	}, [testId])

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
				answer.option_code === id ? { ...answer, name: text } : answer,
			),
		)
	}

	const handleCorrectChange = (id, isCorrect) => {
		setAnswers(prev =>
			prev.map(answer => ({
				...answer,
				correct: answer.option_code === id ? isCorrect : false,
			})),
		)
	}

	const handleCheckChange = (id, checked) => {
		setAnswers(prev =>
			prev.map(answer =>
				answer.option_code === id ? { ...answer, checked } : answer,
			),
		)
	}

	const handleAddAnswer = () => {
		const maxId = Math.max(
			...answers.map(answer => parseInt(answer.option_code)),
		)
		const newId = (maxId + 1).toString()
		setAnswers(prev => [
			...prev,
			{ option_code: newId, name: '', correct: false },
		])
	}

	const handleDeleteAnswer = id => {
		if (answers.length <= MIN_COUNT_ANSWERS) return
		setAnswers(prev => prev.filter(answer => answer.option_code !== id))
	}

	const fetchTest = async id => {
		try {
			const res = await api.get(`${API}/questions/${id}`, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
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
		const correctAnswer = answers.find(answer => answer.correct)

		try {
			const res = await api.post(
				`${API}/questions/test/${sectionId}`,
				{
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
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)

			const data = res.data
			onChange?.(data?.id)
			fetchTest(data?.id)
		} catch (error) {}
	}

	const handleEdit = async () => {
		if (hasDuplicateAnswers(answers)) {
			showMessageFunc()
			return
		}

		const correctAnswer = answers.find(answer => answer.correct)

		try {
			const res = await api.put(
				`${API}/questions/${questionId}`,
				{
					question_type: 'single',
					title: question,
					score: Number(score),
					answer_data: {
						type: 'single',
						correct_answer: correctAnswer ? correctAnswer.name : '',
					},
					question_options: answers.map(answer => ({
						name: answer?.name,
						option_code: answer?.option_code,
					})),
					media: media || [],
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)

			const data = res.data
			fetchTest(data?.id)
		} catch (error) {}
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
				{ option_code: '3', name: '', correct: false },
				{ option_code: '4', name: '', correct: false },
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
			{deleteModalActive && (
				<QuestionDeleteModal
					questionId={questionId}
					setDeleteModalActive={setDeleteModalActive}
					deletedQuestion={deletedQuestion}
				/>
			)}
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
					<div className='flex flex-col gap-3 2xl:w-2/3 w-full mb-5'>
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

					<div className='flex flex-col items-center gap-3 2xl:w-2/3 w-full'>
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
										canDelete={answers.length > MIN_COUNT_ANSWERS}
									/>
								))}
						</div>
					</div>
					{withAnswers && (
						<button
							onClick={handleAddAnswer}
							className='flex items-center 2xl:w-2/3 w-full gap-3 mt-3 justify-center py-2 bg-[var(--light-middle)] text-[var(--middle)] rounded-lg hover:bg-[var(--black)] hover:text-[var(--white)] transition-all active:scale-95'
						>
							<Plus size={18} />
							Добавить вариант ответа
						</button>
					)}
				</div>
				<div className=' flex justify-center items-center  w-1/4'>
					<p className='border-3 flex flex-col border-dashed p-5 rounded-xl border-[var(--light-middle)] font-light text-[var(--middle)]'>
						<span className='text-center w-full flex justify-center'>
							Как создать вопрос:
						</span>
						<span>
							1. <span className='font-medium'>Заголовок:</span> чётко
							сформулируйте задание;{' '}
						</span>
						<span>
							2. <span className='font-medium'>Варианты ответов:</span> внесите
							искомый вариант ответа и дистракторы;
						</span>
						<span>
							3.{' '}
							<span className='font-medium'>
								Выбор правильного варианта ответа:
							</span>{' '}
							отметьте галочкой только один пункт;
						</span>
						<span>
							4. Между вариантами ответа по завершению задания знаки препинания
							не ставятся. Воздержитесь от точек с запятой между вариантами
							ответов;
						</span>
						<span>
							5. В вариантах ответа не допускается использование нумерации,
							введённой вручную в текстовое поле, в связи с автоматическим
							перемешиванием вопросов.
						</span>
					</p>
				</div>
			</div>
			<div className='w-full flex justify-center gap-3'>
				<button
					onClick={handleSave}
					disabled={validate}
					className={`${
						validate
							? 'opacity-50 cursor-not-allowed'
							: 'cursor-pointer hover:bg-[var(--hero-epta)] hover:text-white active:scale-95'
					} bg-[var(--black)] flex gap-1 items-center text-[var(--white)] rounded-lg w-fit px-4 py-2  transition-all `}
				>
					<p>{testId ? 'Обновить' : 'Сохранить'}</p>
				</button>
				<button
					title='Удалить вопрос'
					onClick={() => setDeleteModalActive(true)}
					className={`cursor-pointer hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-95 bg-transparent text-[var(--black)] border-1 border-[var(--black)] font-medium rounded-lg w-fit self-center  p-2 aspect-square  transition-all `}
				>
					<Trash2 size={24} strokeWidth={1.5} />
				</button>
			</div>
		</>
	)
}

export default OneVariant
