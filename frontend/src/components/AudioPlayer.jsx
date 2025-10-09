import React, { useState, useRef, useEffect } from 'react'
import {
	Play,
	Pause,
	Volume2,
	VolumeX,
	SkipBack,
	SkipForward,
	Repeat,
	Shuffle,
} from 'lucide-react'

const CustomAudioPlayer = ({ audioUrl = null, volumeOn, course = false }) => {
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [volume, setVolume] = useState(0.8)
	const [isMuted, setIsMuted] = useState(false)
	const [isLooping, setIsLooping] = useState(false)
	const [isShuffled, setIsShuffled] = useState(false)

	console.log('rl:', audioUrl)

	const audioRef = useRef(null)
	const progressBarRef = useRef(null)

	// Обработчик воспроизведения/паузы
	const togglePlayPause = () => {
		if (isPlaying) {
			audioRef.current.pause()
		} else {
			audioRef.current.play()
		}
		setIsPlaying(!isPlaying)
	}

	// Обновление времени воспроизведения
	const updateTime = () => {
		setCurrentTime(audioRef.current.currentTime)
	}

	// Перемотка аудио
	const handleProgressClick = e => {
		const progressBar = progressBarRef.current
		const clickPosition = e.nativeEvent.offsetX / progressBar.clientWidth
		const newTime = clickPosition * duration

		audioRef.current.currentTime = newTime
		setCurrentTime(newTime)
	}

	// Изменение громкости
	const handleVolumeChange = e => {
		const newVolume = parseFloat(e.target.value)
		setVolume(newVolume)
		audioRef.current.volume = newVolume
		setIsMuted(newVolume === 0)
	}

	// Переключение mute/unmute
	const toggleMute = () => {
		if (isMuted) {
			audioRef.current.volume = volume
		} else {
			audioRef.current.volume = 0
		}
		setIsMuted(!isMuted)
	}

	// Форматирование времени (мм:сс)
	const formatTime = time => {
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}

	// Эффекты для инициализации и очистки
	useEffect(() => {
		const audio = audioRef.current

		const handleLoadedMetadata = () => {
			setDuration(audio.duration)
		}

		const handleEnded = () => {
			setIsPlaying(false)
			setCurrentTime(0)
		}

		audio.addEventListener('loadedmetadata', handleLoadedMetadata)
		audio.addEventListener('timeupdate', updateTime)
		audio.addEventListener('ended', handleEnded)

		return () => {
			audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
			audio.removeEventListener('timeupdate', updateTime)
			audio.removeEventListener('ended', handleEnded)
		}
	}, [])

	return (
		<div className='w-full flex justify-center'>
			<div className={course ? 'w-2/3' : 'w-full'}>
				<div
					className={`bg-[var(--white)] rounded-lg p-4 shadow-[var(--shadow)]`}
				>
					{/* Скрытый нативный audio элемент */}
					<audio ref={audioRef} src={audioUrl} className='hidden' />

					{/* Прогресс бар */}
					<div className='flex gap-3 items-center w-full'>
						<button
							onClick={togglePlayPause}
							className='bg-[var(--hero-epta)] hover:brightness-95 text-white p-3 rounded-full transition-all cursor-pointer'
						>
							{isPlaying ? <Pause size={24} /> : <Play size={24} />}
						</button>
						<div className='flex flex-col w-full gap-1'>
							<div
								ref={progressBarRef}
								className='w-full h-2 bg-[var(--light-middle)] rounded-full cursor-pointer'
								onClick={handleProgressClick}
							>
								<div
									className='h-full bg-[var(--hero-epta)] rounded-full transition-all duration-150'
									style={{ width: `${(currentTime / duration) * 100}%` }}
								/>
							</div>
							<div className='flex justify-between text-sm text-[var(--middle)]'>
								<span>{formatTime(currentTime)}</span>
								<span>{formatTime(duration)}</span>
							</div>
						</div>
						{volumeOn && (
							<div className='flex items-center space-x-2'>
								<input
									type='range'
									min='0'
									max='1'
									step='0.01'
									value={isMuted ? 0 : volume}
									onChange={handleVolumeChange}
									className='w-20 h-1 bg-[var(--light-middle)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full'
								/>
								<button
									onClick={toggleMute}
									className='text-[var(--middle)] hover:text-[var(--hero-epta)] cursor-pointer p-2'
								>
									{isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default CustomAudioPlayer
