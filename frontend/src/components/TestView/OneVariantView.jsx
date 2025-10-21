import { useState, useEffect, useMemo, use } from 'react'
import { Check, CoinsIcon, X } from 'lucide-react'
import CustomAudioPlayer from '../AudioPlayer'
import FormulaView from '../Viewer/FormulaView'
import { API } from '../../API'
import Loader from '../Loader'
import { se } from 'date-fns/locale'

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

// Радиокнопка без correct
const StudentRadio = ({ answer, selectedName, onChange }) => {
	const isSelected = selectedName === answer?.name

	const handleChange = () => {
		onChange(answer?.name)
	}

	return (
		<label
			className={`inline-flex items-center justify-between cursor-pointer rounded-lg p-4 w-3/4 select-none transition-all font-medium ${
				isSelected
					? 'bg-[var(--hero-epta)] text-white shadow-[var(--hero-shadow)]'
					: 'bg-[var(--white)] text-[var(--black)] shadow-[var(--shadow)]'
			}`}
		>
			{answer && <span>{answer?.name || answer}</span>}

			<span className='relative w-5 h-5 flex items-center justify-center rounded bg-transparent transition'>
				<input
					id={`student-answer-${selectedName}`}
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
	onAnswerSelect,
	testId,
	shuffle = true,
	onChange,
	select,
}) => {
	const [isLoading, setIsLoading] = useState(true)
	const [question, setQuestion] = useState('')
	const [answers, setAnswers] = useState([])
	const [media, setMedia] = useState()
	const [selectedName, setSelectedName] = useState(null)
	const [fullScreenPhoto, setFullScreenPhoto] = useState(null)

	useEffect(() => {
		selectedName !== null &&
			onAnswerSelect({
				question_id: testId,
				student_answer: selectedName,
			})
	}, [selectedName])

	const handleSelect = id => {
		setSelectedName(id)
	}

	const shuffleAnswers = useMemo(() => {
		if (!answers) return []
		return shuffle ? [...answers].sort(() => Math.random() - 0.5) : answers
	}, [answers, shuffle])

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

			setIsLoading(false)
			setQuestion(data?.title)
			setAnswers(data?.question_options || [])
			setMedia(data?.media)
			setSelectedName(
				data?.student_answer === null ? null : data?.student_answer
			)
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
			<div className='flex flex-col gap-5 justify-center items-center p-4 w-3/4'>
				<p className='font-medium text-lg'>{question}</p>

				<p className='font-light text-[var(--middle)] text-sm'>
					Это вопрос с единственным правильным ответом
				</p>

				<div className='w-full flex justify-center'>
					{media &&
						(media?.type === 'audio' ? (
							<CustomAudioPlayer
								audioUrl={JSON.parse(media?.info)?.audioUrl || media?.info}
							/>
						) : media?.type === 'photo' ? (
							<div className='aspect-video h-100 flex justify-center'>
								<img
									className='w-auto h-full rounded-xl hover:shadow-[var(--shadow)] hover:scale-101 transition'
									src={media?.info}
									alt=''
									onClick={() => setFullScreenPhoto(media?.info)}
								/>
							</div>
						) : media?.type === 'formula' ? (
							<FormulaView Formula={media?.info} />
						) : null)}
				</div>

				<div className='flex flex-col items-center gap-3 w-full'>
					{shuffleAnswers?.map((answer, index) => (
						<StudentRadio
							key={index}
							id={index}
							answer={answer}
							selectedName={selectedName}
							onChange={handleSelect}
						/>
					))}
				</div>
			</div>
		</>
	)
}

export default OneVariantView
