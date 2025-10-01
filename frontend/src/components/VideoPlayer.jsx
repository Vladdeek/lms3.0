import React, { useState, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

const VideoPlayer = ({ url, course = false }) => {
	const [playing, setPlaying] = useState(false)
	const [volume, setVolume] = useState(0.8)
	const [muted, setMuted] = useState(false)
	const [progress, setProgress] = useState(0)
	const [duration, setDuration] = useState(0)
	const videoRef = useRef(null)

	const getEmbedUrl = url => {
		if (course === true) {
			url = url[0]?.fileUrl
		}

		try {
			const ytMatch = url.match(/(?:youtube\.com.*v=|youtu\.be\/)([^&]+)/)
			if (ytMatch) {
				return {
					type: 'iframe',
					src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&controls=0`,
				}
			}

			const ruMatch = url.match(/rutube\.ru\/video\/([a-zA-Z0-9]+)/)
			if (ruMatch) {
				return {
					type: 'iframe',
					src: `https://rutube.ru/play/embed/${ruMatch[1]}`,
				}
			}

			if (url.endsWith('.mp4')) {
				return { type: 'video', src: url }
			}

			return null
		} catch {
			return null
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
		<div className='w-full flex justify-center'>
			<div className={course ? 'w-2/3' : 'w-full'}>
				<div className='relative w-full pt-[56.25%] rounded-xl overflow-hidden bg-[var(--light-gray)] shadow-[var(--shadow)]'>
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
								className='absolute top-0 left-0 w-full h-full'
								onTimeUpdate={e => setProgress(e.target.currentTime / duration)}
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
										className='hover:text-[var(--hero-epta)] transition-colors cursor-pointer'
									>
										{playing ? <Pause size={20} /> : <Play size={20} />}
									</button>

									<div className='flex items-center gap-2'>
										<button
											onClick={toggleMute}
											className=' hover:text-[var(--hero-epta)] transition-colors cursor-pointer'
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
												onChange={e => handleVolume(parseFloat(e.target.value))}
												className='w-16 accent-[var(--hero-epta)]'
											/>
										)}
									</div>

									{source?.type === 'video' && (
										<span className='text-[var(--middle)] text-sm'>
											{formatTime(progress * duration)} / {formatTime(duration)}
										</span>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default VideoPlayer
