import { use, useEffect, useState } from 'react'
import { X, Plus } from 'lucide-react'
import { InputDefault } from '../Inputs'
import { AddMediaButton } from './AddMedia'
import { ScoreInput1 } from './ScoreInput'
import api, { API } from '../../API'
import Loader from '../Loader'
import { getCookie, token } from '../../TOKEN'
import axios from 'axios'

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
				className='flex-1 px-3 py-2 shadow-[var(--shadow)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--hero-epta)] transition-all bg-transparent'
			/>

			<div className='text-[var(--middle)]'>—</div>

			<input
				type='text'
				value={rightValue}
				onChange={e => onRightChange(id, e.target.value)}
				disabled={disabled}
				placeholder='Правое значение...'
				className='flex-1 px-3 py-2 shadow-[var(--shadow)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--hero-epta)] transition-all bg-transparent'
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

const SortVariants = ({ sectionId, testId, onChange }) => {
	const [pairs, setPairs] = useState([])
	const [left_option, setLeft_option] = useState(['', ''])
	const [right_option, setRight_option] = useState(['', ''])
	const [score, setScore] = useState(1)
	const [media, setMedia] = useState()
	const [isLoading, setIsLoading] = useState(false)
	const [question, setQuestion] = useState('')

	console.log('score out: ', score)

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
		if (left_option.length <= 2) return
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
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			const data = res.data
			if (data) {
				setIsLoading(false)
				setQuestion(data?.title)
				setScore(data?.score)
				setMedia(data?.media)
				setLeft_option(data?.answer_data?.left_options || ['', ''])
				setRight_option(data?.answer_data?.right_options || ['', ''])
			}
		} catch (error) {
			console.error('Ошибка при загрузке теста:', error)
		}
	}

	const handleCreate = async () => {
		console.log('score in: ', score)
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
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				}
			)

			const data = res.data
			onChange?.(data?.id)
			fetchTest(data?.id)
		} catch (error) {
			console.error(error)
		}
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
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				}
			)

			const data = res.data
			fetchTest(data?.id)
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
			setMedia({})
			setLeft_option(['', ''])
			setRight_option(['', ''])
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
			<div className='flex'>
				<div className='flex flex-col justify-center items-end p-4 w-3/4'>
					<div className='flex flex-col gap-3 w-2/3 mb-5'>
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

					<div className='flex flex-col items-center gap-3 w-2/3'>
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
										canDelete={pairs.length > 2}
										label={`Пара ${index + 1}`}
									/>
								))}
							</div>
						</div>
					</div>

					<button
						onClick={handleAddPair}
						className='flex items-center w-2/3 gap-3 mt-3 justify-center py-2 bg-[var(--light-middle)] text-[var(--middle)] rounded-lg hover:bg-[var(--black)] hover:text-[var(--white)] transition-all active:scale-95'
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
			<button
				onClick={handleSave}
				className='bg-[var(--black)] text-[var(--white)] rounded-lg w-fit self-center px-4 py-2 cursor-pointer hover:bg-[var(--hero-epta)] hover:text-white transition-all active:scale-95'
			>
				{testId ? 'Обновить' : 'Сохранить'}
			</button>
		</>
	)
}

export default SortVariants
