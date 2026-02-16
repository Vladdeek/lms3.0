import React, { useState, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'
import { API, FILE_API } from '../API'

const VideoPlayer = ({ url, course = false }) => {
	const [playing, setPlaying] = useState(false)
	const [volume, setVolume] = useState(0.8)
	const [muted, setMuted] = useState(false)
	const [progress, setProgress] = useState(0)
	const [duration, setDuration] = useState(0)
	const videoRef = useRef(null)
	const [fullScreen, setFullScreen] = useState(false)

	const getEmbedUrl = url => {
		if (course === true) {
			url = url?.[0]?.fileUrl || url?.[0]?.videoUrl
		}

		// если вообще нет ссылки — выходим
		if (!url || typeof url !== 'string') return null

		// YOUTUBE
		const ytMatch = url.match(/(?:youtube\.com.*v=|youtu\.be\/)([^&?/]+)/)
		if (ytMatch) {
			return {
				type: 'iframe',
				src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&controls=0`,
			}
		}

		// RUTUBE
		const ruMatch = url.match(/rutube\.ru\/video\/([a-zA-Z0-9]+)/)
		if (ruMatch) {
			return {
				type: 'iframe',
				src: `https://rutube.ru/play/embed/${ruMatch[1]}`,
			}
		}

		// VK
		const vkMatch = url.match(/vk\.com\/video(-?\d+)_(\d+)/)
		if (vkMatch) {
			return {
				type: 'iframe',
				src: `https://vk.com/video_ext.php?oid=${vkMatch[1]}&id=${vkMatch[2]}`,
			}
		}

		// ВСЁ ОСТАЛЬНОЕ → НАТИВНОЕ VIDEO (локальная статика, mp4 и тд)
		return {
			type: 'video',
			src: `${url}`,
		}
	}

	const source = getEmbedUrl(url)

	const togglePlay = () => {
		if (source?.type === 'video') {
			if (playing) {
				videoRef.current.pause()
			} else {
				videoRef.current.play()
			}
		}
		setPlaying(!playing)
	}

	const toggleMute = () => {
		if (source?.type === 'video') {
			videoRef.current.muted = !muted
		}
		setMuted(!muted)
	}

	const handleVolume = v => {
		setVolume(v)
		if (source?.type === 'video') {
			videoRef.current.volume = v
		}
	}

	const handleSeek = e => {
		if (source?.type === 'video') {
			const rect = e.target.getBoundingClientRect()
			const percent = (e.clientX - rect.left) / rect.width
			videoRef.current.currentTime = percent * duration
		}
	}

	const formatTime = seconds => {
		if (!seconds) return '0:00'
		const mm = Math.floor(seconds / 60)
		const ss = Math.floor(seconds % 60)
			.toString()
			.padStart(2, '0')
		return `${mm}:${ss}`
	}

	return (
		<div
			className={`transition-all ${
				fullScreen && 'fixed h-screen w-screen top-0 left-0 z-1000 '
			}`}
		>
			<div
				className={` flex justify-center ${
					fullScreen && 'absolute w-full'
				} transition-all`}
			>
				<div className={course ? 'w-2/3' : 'w-full'}>
					<div
						className={`relative w-full pt-[56.25%] rounded-xl overflow-hidden  ${
							!fullScreen
								? 'bg-[var(--light-gray)] '
								: 'bg-[#00000025] backdrop-blur-[3px] h-screen'
						}  shadow-[var(--shadow)] transition-all`}
					>
						{source ? (
							source?.type === 'iframe' ? (
								<iframe
									src={source.src}
									width='100%'
									height='100%'
									frameBorder='0'
									allow='autoplay; encrypted-media'
									allowFullScreen
									className='absolute top-0 left-0 w-full h-full'
								/>
							) : (
								<video
									ref={videoRef}
									src={source.src}
									className={`absolute  left-0 w-full transition-all  ${
										!fullScreen ? 'h-full top-0' : 'h-[90%] top-[2.5%]'
									}`}
									onTimeUpdate={e =>
										setProgress(e.target.currentTime / duration)
									}
									onLoadedMetadata={e => setDuration(e.target.duration)}
								/>
							)
						) : (
							<div className='absolute inset-0 flex items-center justify-center bg-[var(--light-middle)]'>
								<p className='text-[var(--middle)]'>Неверная ссылка на видео</p>
							</div>
						)}

						{source?.type !== 'iframe' && (
							<div className='absolute bottom-2 left-2 right-2 p-4 bg-[var(--white)] shadow-[var(--shadow)] rounded-lg'>
								{source?.type === 'video' && (
									<div
										className='w-full h-1 bg-[var(--light-middle)] rounded-md mb-3 cursor-pointer'
										onClick={handleSeek}
									>
										<div
											className='h-full bg-[var(--hero-epta)] rounded-md transition-all'
											style={{ width: `${progress * 100}%` }}
										/>
									</div>
								)}

								<div className='flex items-center justify-between text-[var(--black)]'>
									<div className='flex items-center gap-4'>
										<button
											onClick={togglePlay}
											className='hover:text-[var(--hero-epta)] cursor-pointer transition-all hover:scale-95'
										>
											{playing ? <Pause size={20} /> : <Play size={20} />}
										</button>

										<div className='flex items-center gap-2'>
											<button
												onClick={toggleMute}
												className=' hover:text-[var(--hero-epta)] transition-all cursor-pointer hover:scale-95'
											>
												{muted || volume === 0 ? (
													<VolumeX size={18} />
												) : (
													<Volume2 size={18} />
												)}
											</button>
											{source?.type === 'video' && (
												<input
													type='range'
													min='0'
													max='1'
													step='0.1'
													value={volume}
													onChange={e =>
														handleVolume(parseFloat(e.target.value))
													}
													className='w-16 accent-[var(--hero-epta)]'
												/>
											)}
										</div>

										{source?.type === 'video' && (
											<span className='text-[var(--middle)] text-sm'>
												{formatTime(progress * duration)} /{' '}
												{formatTime(duration)}
											</span>
										)}
									</div>
									<div className='flex items-center gap-4'>
										<button
											onClick={() => setFullScreen(prev => !prev)}
											className='hover:text-[var(--hero-epta)] cursor-pointer transition-all hover:scale-95'
										>
											{!fullScreen ? (
												<Maximize size={20} />
											) : (
												<Minimize size={20} />
											)}
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default VideoPlayer
