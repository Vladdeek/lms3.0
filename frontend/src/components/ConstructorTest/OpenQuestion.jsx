import { useEffect, useState } from 'react'
import { InputDefault } from '../Inputs'
import { AddMediaButton } from './AddMedia'
import { ScoreInput1, ScoreInput2 } from './ScoreInput'
import Loader from '../Loader'
import api, { API } from '../../API'
import { getCookie, token } from '../../TOKEN'
import axios from 'axios'
import QuestionDeleteModal from './QuestionDeleteModal'
import { Trash2 } from 'lucide-react'

const OpenQuestion = ({ sectionId, testId, onChange, deletedQuestion }) => {
	const [question, setQuestion] = useState('')
	const [score, setScore] = useState(1)
	const [media, setMedia] = useState()
	const [isLoading, setIsLoading] = useState(false)
	const [questionId, setQuestionId] = useState('')
	const [deleteModalActive, setDeleteModalActive] = useState(false)

	const [validate, setValidate] = useState(false)

	useEffect(() => {
		testId ? setQuestionId(testId) : setQuestionId('')
	}, [testId])

	useEffect(() => {
		const isInvalid = () => {
			if (!question.trim()) return true
			if (typeof score !== 'number' || score < 1 || score > 5) return true

			return false
		}

		setValidate(isInvalid())
	}, [question, score])

	const handleQuestionChange = e => {
		setQuestion(e.target.value)
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
		} catch (error) {
			console.error('Ошибка при загрузке теста:', error)
		}
	}

	const handleCreate = async () => {
		try {
			const res = await api.post(
				`${API}/questions/test/${sectionId}`,
				{
					question_type: 'open',
					title: question,
					score: Number(score),
					media: media || {},
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
					question_type: 'open',
					title: question,
					score: Number(score),
					media: media || {},
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
		if (testId) fetchTest(testId)
		else {
			setQuestion('')
			setScore(1)
			setMedia({})
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
				</div>
				<div className=' flex justify-center items-center  w-1/4'></div>
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

export default OpenQuestion
