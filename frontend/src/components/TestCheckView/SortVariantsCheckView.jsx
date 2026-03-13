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

const SortVariantCheckView = ({ question, answers, media }) => {
	const [heights, setHeights] = useState([])
	const rightRefs = useRef([])
	const [isLoading, setIsLoading] = useState(false)
	const [fullScreenPhoto, setFullScreenPhoto] = useState(null)

	// высоты правой колонки
	useEffect(() => {
		const newHeights = rightRefs.current.map(ref =>
			ref ? ref.getBoundingClientRect().height : 0,
		)
		setHeights(newHeights)
	}, [])

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
					<div className='flex flex-col gap-3 w-full'>
						{answers.map((pair, idx) => {
							const [left, , right] = pair.name.split(' ')

							const statusClass =
								pair.correct === 'correct'
									? 'text-white bg-[var(--correct-lvl)]'
									: pair.correct === 'incorrect'
										? 'text-white bg-[var(--not-correct-lvl)]'
										: 'bg-[var(--white)] text-[var(--black)]'

							return (
								<div key={idx} className='flex items-center gap-3 w-full'>
									<div
										className={`grid grid-cols-7 min-w-50 px-3 py-2 shadow-[var(--shadow)] rounded-lg select-none ${statusClass}`}
									>
										<span className='col-span-4 flex items-center w-full'>
											{left}
										</span>
									</div>

									<div className='flex-1 flex items-center'>
										<div className='h-0 w-5 border-b-2 rounded-full border-[var(--black)]'></div>
									</div>

									<div
										className={`grid grid-cols-7 w-full px-3 py-2 shadow-[var(--shadow)] rounded-lg select-none ${statusClass}`}
									>
										<span className='col-span-4 flex items-center w-full'>
											{right}
										</span>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</>
	)
}

export default SortVariantCheckView
