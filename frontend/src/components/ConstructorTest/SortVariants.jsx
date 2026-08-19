import { use, useEffect, useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { InputDefault } from '../Inputs'
import { AddMediaButton } from './AddMedia'
import { ScoreInput1 } from './ScoreInput'
import api, { API } from '../../API'
import Loader from '../Loader'
import { getCookie, token } from '../../TOKEN'
import axios from 'axios'
import QuestionDeleteModal from './QuestionDeleteModal'

const MIN_COUNT_ANSWERS = 4

// Компонент для пары сопоставления
const MatchPair = ({
	id,
	leftValue = '',
	rightValue = '',
	onLeftChange,
	onRightChange,
	onDelete,
	canDelete = false,
	disabled = false,
}) => {
	return (
		<div className='flex items-center gap-3 w-full mb-3'>
			<input
				type='text'
				value={leftValue}
				onChange={e => onLeftChange(id, e.target.value)}
				disabled={disabled}
				placeholder='Левое значение...'
				className='flex-1 px-3 py-2 shadow-[var(--shadow)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--hero-epta)] transition-all bg-transparent placeholder:text-[var(--middle)] text-[var(--black)]'
			/>

			<div className='text-[var(--middle)]'>—</div>

			<input
				type='text'
				value={rightValue}
				onChange={e => onRightChange(id, e.target.value)}
				disabled={disabled}
				placeholder='Правое значение...'
				className='flex-1 px-3 py-2 shadow-[var(--shadow)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--hero-epta)] transition-all bg-transparent placeholder:text-[var(--middle)] text-[var(--black)]'
			/>

			<button
				onClick={() => onDelete(id)}
				className={`p-2 rounded-lg transition-colors ${
					canDelete
						? 'text-[var(--red-status-text)] bg-[var(--red-status-bg)] hover:bg-red-500 hover:text-white cursor-pointer'
						: 'text-[var(--middle)] bg-[var(--light-middle)] cursor-not-allowed'
				}`}
				aria-label='Удалить пару'
				disabled={!canDelete}
			>
				<X size={18} />
			</button>
		</div>
	)
}

const SortVariants = ({ sectionId, testId, onChange, deletedQuestion }) => {
	const [pairs, setPairs] = useState([])
	const [left_option, setLeft_option] = useState(['', '', '', ''])
	const [right_option, setRight_option] = useState(['', '', '', ''])
	const [score, setScore] = useState(1)
	const [media, setMedia] = useState()
	const [isLoading, setIsLoading] = useState(false)
	const [question, setQuestion] = useState('')
	const [questionId, setQuestionId] = useState('')
	const [deleteModalActive, setDeleteModalActive] = useState(false)
	useEffect(() => {
		testId ? setQuestionId(testId) : setQuestionId('')
	}, [testId])

	const [validate, setValidate] = useState(false)

	useEffect(() => {
		const isInvalid = () => {
			if (!question.trim()) return true
			if (typeof score !== 'number' || score < 1 || score > 5) return true

			// Проверяем, что все элементы left_option заполнены
			if (left_option.some(opt => !opt.trim())) return true
			// Проверяем, что все элементы right_option заполнены
			if (right_option.some(opt => !opt.trim())) return true

			return false // Всё ок
		}

		setValidate(isInvalid())
	}, [question, score, left_option, right_option])

	useEffect(() => {
		const combinedPairs = left_option.map((left, index) => ({
			id: (index + 1).toString(),
			left: left,
			right: right_option[index] || '',
		}))
		setPairs(combinedPairs)
	}, [left_option, right_option])

	const handleLeftChange = (index, value) => {
		setLeft_option(prev => {
			const updated = [...prev]
			updated[index] = value
			return updated
		})
	}

	const handleRightChange = (index, value) => {
		setRight_option(prev => {
			const updated = [...prev]
			updated[index] = value
			return updated
		})
	}

	const handleDeletePair = index => {
		if (left_option.length <= MIN_COUNT_ANSWERS) return
		setLeft_option(prev => prev.filter((_, i) => i !== index))
		setRight_option(prev => prev.filter((_, i) => i !== index))
	}

	const handleAddPair = () => {
		setLeft_option(prev => [...prev, ''])
		setRight_option(prev => [...prev, ''])
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
			if (data) {
				setIsLoading(false)
				setQuestion(data?.title)
				setScore(data?.score)
				setMedia(data?.media)
				setLeft_option(data?.answer_data?.left_options || ['', '', '', ''])
				setRight_option(data?.answer_data?.right_options || ['', '', '', ''])
			}
		} catch (error) {
			console.error('Ошибка при загрузке теста:', error)
		}
	}

	const handleCreate = async () => {
		try {
			const res = await api.post(
				`${API}/questions/test/${sectionId}`,
				{
					title: question,
					question_type: 'matching',
					media: media || {},
					score: Number(score),
					answer_data: {
						type: 'matching',
						left_options: left_option,
						right_options: right_option,
					},
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
		try {
			const res = await api.put(
				`${API}/questions/${testId}`,
				{
					title: question,
					question_type: 'matching',
					media: media || {},
					score: Number(score),
					answer_data: {
						type: 'matching',
						left_options: left_option,
						right_options: right_option,
					},
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
			setMedia({})
			setLeft_option(['', '', '', ''])
			setRight_option(['', '', '', ''])
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
			<div className='flex'>
				<div className='flex flex-col justify-center items-end p-4 w-3/4'>
					<div className='flex flex-col gap-3 2xl:w-2/3 w-full mb-5'>
						<div className='flex gap-3 items-end'>
							<InputDefault
								title={'Введите вопрос'}
								required={true}
								value={question}
								onChange={e => setQuestion(e.target.value)}
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
							<h3 className='text-lg font-medium mb-2 text-[var(--middle)]'>
								Пары для сопоставления:
							</h3>

							<div className='w-full'>
								{pairs.map((pair, index) => (
									<MatchPair
										key={pair.id}
										id={index} // или pair.id
										leftValue={left_option[index]} // конкретный элемент массива
										rightValue={right_option[index]} // конкретный элемент массива
										onLeftChange={(id, value) => handleLeftChange(index, value)}
										onRightChange={(id, value) =>
											handleRightChange(index, value)
										}
										onDelete={() => handleDeletePair(index)}
										canDelete={pairs.length > MIN_COUNT_ANSWERS}
										label={`Пара ${index + 1}`}
									/>
								))}
							</div>
						</div>
					</div>

					<button
						onClick={handleAddPair}
						className='flex items-center 2xl:w-2/3 w-full gap-3 mt-3 justify-center py-2 bg-[var(--light-middle)] text-[var(--middle)] rounded-lg hover:bg-[var(--black)] hover:text-[var(--white)] transition-all active:scale-95'
					>
						<Plus size={18} />
						Добавить пару
					</button>

					<div className='mt-6 p-4 bg-gray-50 rounded-md w-1/3 hidden'>
						<h4 className='font-medium mb-2'>Текущее состояние:</h4>
						<pre className='text-sm'>{JSON.stringify(pairs, null, 2)}</pre>
					</div>
				</div>
				<div className='flex justify-center items-center w-1/4'>
					<p className='border-3 border-dashed p-5 rounded-xl border-[var(--light-middle)] font-light text-[var(--middle)]'>
						<span className='text-center w-full flex justify-center'>
							Как создать вопрос на сопоставление:
						</span>
						<br /> 1. Заголовок: Четко сформулируйте задание. <br />
						2. Пары соответствия: В левом столбце укажите элементы, в правом -
						соответствующие им значения.
						<span className='text-center w-full flex justify-center mt-10'>
							Система автоматически перемешает элементы для тестирования.
						</span>
						<br /> <br /> Например: "процессор" — "центральное процессорное
						устройство"
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
					} bg-[var(--black)] text-[var(--white)] rounded-lg w-fit self-center px-4 py-2  transition-all `}
				>
					{testId ? 'Обновить' : 'Сохранить'}
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

export default SortVariants
