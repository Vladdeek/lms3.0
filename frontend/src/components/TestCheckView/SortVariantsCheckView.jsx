import { useState, useEffect, useRef, forwardRef, use } from 'react'
import { ChevronsUp, ChevronsDown, GripHorizontal, X } from 'lucide-react'
import api, { API } from '../../API'
import Loader from '../Loader'
import { set } from 'date-fns'
import { getCookie, token } from '../../TOKEN'

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

const PairItem = forwardRef(
	(
		{
			pair,
			index,
			side,
			moveUp,
			moveDown,
			onDragStart,
			onDrop,
			height,
			length,
		},
		ref,
	) => {
		const isRight = side === 'right'

		return (
			<div
				ref={ref}
				draggable={isRight}
				onDragStart={e => isRight && onDragStart(e, index)}
				onDragOver={e => isRight && e.preventDefault()}
				onDrop={e => isRight && onDrop(e, index)}
				style={{ height: height ? `${height}px` : undefined }}
				className={`grid grid-cols-7 min-w-50 px-3 py-2 shadow-[var(--shadow)] rounded-lg bg-white cursor-default select-none`}
			>
				<span className='col-span-4 flex items-center w-full'>
					{side === 'left' ? pair : pair}
				</span>

				{isRight && (
					<div className='col-span-2 flex items-center justify-center w-full cursor-grab'>
						<GripHorizontal size={24} />
					</div>
				)}

				{isRight && (
					<div className='col-span-1 flex items-center justify-center w-full'>
						<button
							onClick={() => moveUp(index)}
							className={`p-1 z-10 rounded  ${
								index === 0
									? 'opacity-25 cursor-not-allowed'
									: 'hover:bg-gray-200 cursor-pointer'
							}`}
							aria-label='Переместить вверх'
							disabled={index === 0}
						>
							<ChevronsUp size={24} />
						</button>
						<button
							onClick={() => moveDown(index)}
							className={`p-1 z-10 rounded  ${
								index === length - 1
									? 'opacity-25 cursor-not-allowed'
									: 'hover:bg-gray-200 cursor-pointer'
							}`}
							aria-label='Переместить вниз'
							disabled={index === length - 1}
						>
							<ChevronsDown size={24} />
						</button>
					</div>
				)}
			</div>
		)
	},
)

const SortVariantCheckView = ({ testId, onAnswerSelect }) => {
	const [heights, setHeights] = useState([])
	const rightRefs = useRef([])
	const [isLoading, setIsLoading] = useState(false)
	const [left_option, setLeft_option] = useState([])
	const [right_option, setRight_option] = useState([])
	const [score, setScore] = useState(1)
	const [media, setMedia] = useState()
	const [question, setQuestion] = useState('')
	const [fullScreenPhoto, setFullScreenPhoto] = useState(null)

	useEffect(() => {
		onAnswerSelect?.({
			question_id: testId,
			student_answer: {
				left_options: left_option,
				right_options: right_option,
			},
		})
	}, [right_option, left_option])

	useEffect(() => {
		const fetchTest = async id => {
			setIsLoading(true)
			try {
				const res = await api.get(`${API}/questions/${id}`, {
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				})

				const data = res.data
				setQuestion(data?.title)
				setMedia(data?.media)
				setScore(data?.score)
				setLeft_option(data?.answer_data?.left_options || [])
				setRight_option(data?.answer_data?.right_options || [])
			} catch (error) {
				console.error('Ошибка при загрузке теста:', error)
			} finally {
				setIsLoading(false)
			}
		}

		if (testId) fetchTest(testId)
	}, [testId])

	// высоты правой колонки
	useEffect(() => {
		const newHeights = rightRefs.current.map(ref =>
			ref ? ref.getBoundingClientRect().height : 0,
		)
		setHeights(newHeights)
	}, [right_option])

	const moveUp = index => {
		if (index === 0) return
		setRight_option(prev => {
			const newArr = [...prev]
			;[newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]]
			return newArr
		})
	}

	const moveDown = index => {
		if (index === right_option.length - 1) return
		setRight_option(prev => {
			const newArr = [...prev]
			;[newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]]
			return newArr
		})
	}

	const handleDragStart = (e, index) => {
		e.dataTransfer.setData('dragIndex', index)
	}

	const handleDrop = (e, dropIndex) => {
		const dragIndex = parseInt(e.dataTransfer.getData('dragIndex'))
		if (isNaN(dragIndex)) return

		setRight_option(prev => {
			const newArr = [...prev]
			const [dragged] = newArr.splice(dragIndex, 1)
			newArr.splice(dropIndex, 0, dragged)
			return newArr
		})
	}

	if (isLoading) return <Loader />

	return (
		<>
			{fullScreenPhoto !== null && (
				<FullScreen
					url={fullScreenPhoto}
					close={() => setFullScreenPhoto(null)}
				/>
			)}
			<div className='flex flex-col items-center gap-5'>
				<p className='font-medium text-lg'>{question}</p>

				<p className='font-light text-[var(--middle)] text-sm'>
					Это вопрос на установление соответствия, где нужно правильно
					сопоставить элементы
				</p>

				<div className='w-full flex justify-center'>
					{media &&
						(media.type === 'audio' ? (
							<>
								<CustomAudioPlayer
									audioUrl={JSON.parse(media?.info)?.audioUrl}
								/>
							</>
						) : media.type === 'photo' ? (
							<div className='aspect-video h-100 flex justify-center'>
								<img
									className='w-auto h-full rounded-xl hover:shadow-[var(--shadow)] hover:scale-101 transition'
									src={media.info}
									alt=''
									onClick={() => setFullScreenPhoto(media.info)}
								/>
							</div>
						) : media.type === 'formula' ? (
							<>
								<FormulaView Formula={media.info} />
							</>
						) : (
							<></>
						))}
				</div>

				<div className='flex justify-between gap-3 w-full'>
					<div className='flex flex-col gap-3'>
						{left_option.map((pair, idx) => (
							<div
								key={idx}
								className='grid grid-cols-7 min-w-50 px-3 py-2 shadow-[var(--shadow)] rounded-lg bg-white select-none'
								style={{
									height: heights[idx] ? `${heights[idx]}px` : undefined,
								}}
							>
								<span className='col-span-4 flex items-center w-full'>
									{pair}
								</span>
							</div>
						))}
					</div>

					<div className='flex flex-col gap-3'>
						{left_option.map((_, idx) => (
							<div key={idx} className='w-full h-full flex items-center'>
								<div className='h-0 w-5 border-b-2 border-[var(--black)]'></div>
							</div>
						))}
					</div>

					<div className='flex flex-col gap-3'>
						{right_option.map((pair, index) => (
							<PairItem
								key={pair.id || index}
								pair={pair}
								index={index}
								side='right'
								moveUp={moveUp}
								moveDown={moveDown}
								onDragStart={handleDragStart}
								onDrop={handleDrop}
								ref={el => (rightRefs.current[index] = el)}
								height={heights[index]}
								length={right_option.length}
							/>
						))}
					</div>
				</div>
			</div>
		</>
	)
}

export default SortVariantCheckView
