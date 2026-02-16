import { useState, useEffect, useMemo } from 'react'
import { Check, X } from 'lucide-react'
import api, { API } from '../../API'
import FormulaView from '../Viewer/FormulaView'
import CustomAudioPlayer from '../AudioPlayer'
import Loader from '../Loader'
import { getCookie, token } from '../../TOKEN'
import { tr } from 'date-fns/locale'
import axios from 'axios'

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

const OpenQuestionModerationView = ({ testId }) => {
	const [isLoading, setIsLoading] = useState(false)

	const [fullScreenPhoto, setFullScreenPhoto] = useState(null)

	const [question, setQuestion] = useState('')
	const [media, setMedia] = useState(null)

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
			} catch (error) {
				console.error('Ошибка при загрузке теста:', error)
			} finally {
				setIsLoading(false)
			}
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
				<p className='font-medium text-lg text-[var(--black)]'>{question}</p>

				<p className='font-light text-[var(--middle)] text-sm'>
					Это вопрос на который нужно ответить самостоятельно
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

				<div className='flex flex-col items-center gap-3 w-full'>
					<input
						type='text'
						className='rounded-xl p-[12px] shadow-[var(--shadow)] outline-0 focus:ring-1 focus:ring-[var(--hero-epta)] transition mt-3 w-full text-[var(--black)] placeholder:text-[var(--middle)]'
						placeholder={'Поле для ввода ответа...'}
						readOnly={true}
					/>
				</div>
			</div>
		</>
	)
}

export default OpenQuestionModerationView
