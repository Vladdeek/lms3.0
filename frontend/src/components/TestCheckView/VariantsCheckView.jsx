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

const StudentCheckbox = ({ info }) => {
	return (
		<label
			className={`inline-flex items-center justify-between cursor-pointer rounded-lg p-4 w-3/4 select-none transition-all font-medium  ${
				info?.correct === 'correct'
					? 'bg-[var(--correct-lvl)] text-white shadow-[var(--correct-glow)]'
					: info?.correct === 'incorrect'
					? 'bg-[var(--not-correct-lvl)] text-white shadow-[var(--not-correct-glow)]'
					: info?.correct === 'not-attempted'
					? 'bg-[var(--white)] text-[var(--black)] shadow-[var(--shadow)]'
					: 'bg-[var(--white)] text-[var(--black)] shadow-[var(--shadow)]'
			}`}
		>
			{info && <span>{info?.name}</span>}
		</label>
	)
}

const VariantCheckView = ({ answers, media, question, type }) => {
	const [isLoading, setIsLoading] = useState(false)
	const [fullScreenPhoto, setFullScreenPhoto] = useState(null)

	if (isLoading) return <Loader />

	console.log('answer in: ', answers)

	return (
		<>
			{fullScreenPhoto !== null && (
				<FullScreen
					url={fullScreenPhoto}
					close={() => setFullScreenPhoto(null)}
				/>
			)}
			<div className='flex flex-col justify-center items-center p-4 gap-5 w-3/4'>
				<p className='font-medium text-lg text-[var(--black)]'>{question}</p>

				{type === 'multiple' ? (
					<p className='font-light text-[var(--middle)] text-sm'>
						Это вопрос с несколькими правильными ответами
					</p>
				) : (
					type === 'single' && (
						<p className='font-light text-[var(--middle)] text-sm'>
							Это вопрос с единственным правильным ответом
						</p>
					)
				)}

				<div className='w-full flex justify-center'>
					{media?.type === 'audio' ? (
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
					) : (
						media?.type === null && null
					)}
				</div>

				<div className='flex flex-col items-center gap-3 w-full'>
					{answers?.map(answer => {
						return <StudentCheckbox info={answer} />
					})}
				</div>
			</div>
		</>
	)
}

export default VariantCheckView
