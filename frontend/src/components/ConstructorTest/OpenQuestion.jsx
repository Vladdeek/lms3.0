import { useEffect, useState } from 'react'
import { InputDefault } from '../Inputs'
import { AddMediaButton } from './AddMedia'
import { ScoreInput1, ScoreInput2 } from './ScoreInput'
import Loader from '../Loader'
import { API } from '../../API'

const OpenQuestion = ({ sectionId, testId }) => {
	const [question, setQuestion] = useState('')
	const [score, setScore] = useState(1)
	const [media, setMedia] = useState()
	const [isLoading, setIsLoading] = useState(false)

	const handleQuestionChange = e => {
		setQuestion(e.target.value)
	}

	const fetchTest = async id => {
		const res = await fetch(`${API}/questions/${id}`)
		const data = await res.json()
		if (data) setIsLoading(false)
		console.log('get: ', data)
		setQuestion(data?.title)
		setScore(data?.score)
		setMedia(data?.media)
	}

	const handleCreate = async () => {
		console.log('POST create')
		try {
			const res = await fetch(`${API}/questions/test/${sectionId}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					question_type: 'open',
					title: question,
					score: Number(score),
					media: media || {},
				}),
			})

			if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`)
			const data = await res.json()

			console.log('open Ответ сервера: ', data)

			fetchTest(data?.id)
		} catch (error) {
			console.error(error)
		}
	}

	const handleEdit = async () => {
		console.log('PUT edit')
		try {
			const res = await fetch(`${API}/questions/${testId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					question_type: 'open',
					title: question,
					score: Number(score),
					media: media || {},
				}),
			})

			if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`)
			const data = await res.json()

			console.log('open Ответ сервера: ', data)

			fetchTest(data?.id)
		} catch (error) {
			console.error(error)
		}
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
							url={media?.info}
						/>
					</div>
				</div>
				<div className=' flex justify-center items-center  w-1/4'></div>
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

export default OpenQuestion
