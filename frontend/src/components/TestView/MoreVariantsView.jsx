import { Check, X } from 'lucide-react'
import { useState, useEffect, useMemo, use } from 'react'
import CustomAudioPlayer from '../AudioPlayer'
import FormulaView from '../Viewer/FormulaView'
import { API } from '../../API'
import Loader from '../Loader'

const FullScreen = ({ url, prevImg, nextImg, close }) => {
	return (
		<div className='flex fixed top-0 left-0 bg-[#00000025] backdrop-blur-[2px] z-1000 h-screen w-screen justify-center items-center'>
			<div className='relative flex justify-center items-center w-full h-full '>
				<div className='relative w-auto h-[75%] flex items-center rounded-3xl overflow-hidden'>
					<button
						onClick={close}
						className=' bg-red-500 text-white absolute right-3 top-3 p-1 rounded-full flex justify-center items-center hover:scale-110  active:scale-90 active:brightness-80 transition-all cursor-pointer'
					>
						<X size={20} strokeWidth={2.5} />
					</button>

					<img className='w-full h-full' src={url} alt='' />
				</div>
			</div>
		</div>
	)
}

const StudentCheckbox = ({ disabled = false, onChange, answer, checked }) => {
	const handleChange = () => {
		const newChecked = !checked
		if (onChange) onChange(answer.name, newChecked)
	}

	return (
		<label
			className={`inline-flex items-center justify-between cursor-pointer rounded-lg p-4 w-3/4 select-none transition-all font-medium ${
				checked
					? 'bg-[var(--hero-epta)] text-white shadow-[var(--hero-shadow)]'
					: 'bg-[var(--white)] text-[var(--black)] shadow-[var(--shadow)]'
			}`}
		>
			{answer && <span>{answer.name}</span>}

			<span className='relative w-5 h-5 flex items-center justify-center rounded bg-transparent transition'>
				{checked && <Check size={24} strokeWidth={3} />}
				<input
					id={`student-answer-${answer.name}`}
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

const MoreVariantView = ({ onAnswerSelect, correctAnswers = [], testId }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [score, setScore] = useState(1)
	const [answers, setAnswers] = useState([])
	const [question, setQuestion] = useState('')
	const [media, setMedia] = useState()

	const [selected, setSelected] = useState([]) // уже есть, убедись

	const [fullScreenPhoto, setFullScreenPhoto] = useState(null)

	useEffect(() => {
		console.log(
			JSON.stringify({ question_id: testId, student_answer: selected })
		)
		selected !== null &&
			onAnswerSelect({
				question_id: testId,
				student_answer: selected,
			})
	}, [selected])

	const handleChange = (optionCode, checked) => {
		let newSelected
		if (checked) {
			newSelected = [...selected, optionCode] // добавить
		} else {
			newSelected = selected.filter(code => code !== optionCode) // убрать
		}
		setSelected(newSelected)
	}

	useEffect(() => {
		const fetchTest = async id => {
			setIsLoading(true)
			const token = localStorage.getItem('access_token')
			const res = await fetch(`${API}/questions/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			const data = await res.json()

			console.log('question data:', data)

			setIsLoading(false)
			setQuestion(data?.title)
			setAnswers(data?.question_options || [])
			setMedia(data?.media)
			setSelected(data?.student_answer === null ? [] : data?.student_answer)
		}
		if (testId) fetchTest(testId)
	}, [testId])

	if (isLoading) return <Loader />

	return (
		<>
			{fullScreenPhoto !== null && (
				<FullScreen
					url={fullScreenPhoto}
					close={() => setFullScreenPhoto(null)}
				/>
			)}
			<div className='flex flex-col justify-center items-center p-4 gap-5 w-3/4'>
				<p className='font-medium text-lg'>{question}</p>

				<p className='font-light text-[var(--middle)] text-sm'>
					Это вопрос с несколькими правильными ответами
				</p>

				<div className='w-full flex justify-center'>
					{media &&
						(media?.type === 'audio' ? (
							<CustomAudioPlayer audioUrl={JSON.parse(media?.info)?.audioUrl} />
						) : media?.type === 'photo' ? (
							<div className='aspect-video h-100 flex justify-center'>
								<img
									className='w-auto h-full rounded-xl hover:shadow-[var(--shadow)] hover:scale-101 transition'
									src={media.info}
									alt=''
									onClick={() => setFullScreenPhoto(media.info)}
								/>
							</div>
						) : media?.type === 'formula' ? (
							<FormulaView Formula={media?.info} />
						) : null)}
				</div>

				<div className='flex flex-col items-center gap-3 w-full'>
					{answers?.map(answer => (
						<StudentCheckbox
							key={answer.option_code}
							answer={answer}
							checked={selected?.includes(answer.name)}
							onChange={handleChange}
						/>
					))}
				</div>
			</div>
		</>
	)
}

export default MoreVariantView
