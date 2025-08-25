import { Film, Upload, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'

export const ConstructorVideoInput = ({ onStatusChange, DelComponent }) => {
	const inputId = useId()
	const [inputStatus, setInputStatus] = useState(false)
	const [fileInfo, setFileInfo] = useState(null)
	const [isDragActive, setIsDragActive] = useState(false)
	const [previews, setPreviews] = useState([])

	const validFormats = [
		'video/mp4',
		'video/webm',
		'video/ogg',
		'video/quicktime',
		'video/x-msvideo',
		'video/x-ms-wmv',
		'video/x-matroska',
		'video/3gpp',
		'video/3gpp2',
		'video/mpeg',
	]
	const maxSize = 100 * 1024 * 1024 // 100 MB
	const maxFiles = 1

	const handleFileChange = e => {
		const files = Array.from(e.target.files)
		handleFiles(files)
	}

	const handleFiles = files => {
		if (files.length === 0) return

		const filesToProcess = files.slice(0, maxFiles - previews.length)
		const validFiles = []

		filesToProcess.forEach(file => {
			const isValidFormat = validFormats.includes(file.type)
			const isValidSize = file.size <= maxSize

			if (isValidFormat && isValidSize) {
				// Создаем видео элемент для получения превью
				const video = document.createElement('video')
				video.src = URL.createObjectURL(file)
				video.currentTime = 1 // Берем кадр на 1 секунде

				video.onloadeddata = () => {
					// Создаем canvas для захвата кадра
					const canvas = document.createElement('canvas')
					canvas.width = video.videoWidth
					canvas.height = video.videoHeight

					const ctx = canvas.getContext('2d')
					ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

					const thumbnail = canvas.toDataURL('image/jpeg')

					validFiles.push({
						file,
						preview: thumbnail,
						videoUrl: URL.createObjectURL(file),
						info: {
							name: file.name,
							size: (file.size / 1024 / 1024).toFixed(2),
							type: file.type,
							duration: video.duration || 0,
						},
					})

					setPreviews(prev => [...prev, ...validFiles])
					setInputStatus(true)
					onStatusChange?.(true)
				}
			}
		})
	}

	const removePreview = index => {
		// Освобождаем URL объекта
		if (previews[index]?.videoUrl) {
			URL.revokeObjectURL(previews[index].videoUrl)
		}
		setPreviews(prev => prev.filter((_, i) => i !== index))
		if (previews.length === 1) {
			setInputStatus(false)
			onStatusChange?.(false)
		}
	}

	const handleDragOver = e => {
		e.preventDefault()
		setIsDragActive(true)
	}

	const handleDragLeave = e => {
		e.preventDefault()
		if (e.currentTarget.contains(e.relatedTarget)) return
		setIsDragActive(false)
	}

	const handleDrop = e => {
		e.preventDefault()
		setIsDragActive(false)
		const files = Array.from(e.dataTransfer.files)
		handleFiles(files)
	}

	// Очищаем URL при размонтировании
	useEffect(() => {
		return () => {
			previews.forEach(preview => {
				if (preview.videoUrl) {
					URL.revokeObjectURL(preview.videoUrl)
				}
			})
		}
	}, [])

	return (
		<div className='flex gap-2'>
			<button
				className='self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
				onClick={DelComponent}
			>
				<X />
			</button>
			<div className='flex justify-center w-full gap-3'>
				{/* Отображаем превью загруженных видео */}
				{previews.map((previewData, index) => (
					<div key={index} className='relative w-1/2 aspect-16/9 group'>
						<video
							src={previewData.videoUrl}
							className='w-full h-full object-cover rounded-lg'
							controls // добавляем элементы управления видео
							preload='metadata' // предзагрузка метаданных для быстрого отображения
						>
							Ваш браузер не поддерживает видео.
						</video>

						{/* Информация о видео */}
						<div className='absolute top-2 left-2 right-2 bg-black bg-opacity-70 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity'>
							<div className='truncate'>{previewData.info.name}</div>
							<div className='flex justify-between text-[10px] opacity-80'>
								<span>{previewData.info.size} MB</span>
								{previewData.info.duration > 0 && (
									<span>{Math.round(previewData.info.duration)}s</span>
								)}
							</div>
						</div>

						<X
							size={20}
							onClick={() => removePreview(index)}
							className='absolute top-2 right-2 bg-[var(--white)] text-[var(--black)] hover:bg-red-500 hover:text-[var(--white)] cursor-pointer transition-all rounded-lg h-fit w-fit p-1 flex items-center justify-center'
						/>
					</div>
				))}

				{/* Поле загрузки */}
				{previews.length < maxFiles && (
					<div
						className={`p-2 w-full h-full flex aspect-32/9 ${
							isDragActive ? 'bg-[var(--hero-pale)]' : 'bg-[var(--light-gray)]'
						} rounded-lg transition-all`}
					>
						<label
							htmlFor='dropzone-file'
							className={`rounded-lg p-[10px] transition border-3 w-full border-dashed ${
								isDragActive
									? 'border-[var(--hero-epta)]'
									: 'border-[var(--middle)]'
							}`}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						>
							<div className='flex flex-col items-center justify-center w-full h-full gap-5'>
								<Film
									size={80}
									strokeWidth={1.5}
									className={`transition-all ${
										isDragActive
											? 'text-[var(--hero-epta)]'
											: 'text-[var(--middle)]'
									}`}
								/>
								<div className='flex flex-wrap gap-[5px] w-50 justify-center'>
									<p
										className={`rounded-lg text-sm font-normal py-1 whitespace-nowrap transition-all px-3 ${
											isDragActive
												? 'bg-[var(--hero-epta)] text-[var(--white)]'
												: 'bg-[var(--light-middle)] text-[var(--black)]'
										} `}
									>
										до 100 мб
									</p>
									{['.mp4', '.webm', '.mov', '.avi'].map(ext => (
										<p
											key={ext}
											className={`rounded-lg text-sm font-normal py-1 whitespace-nowrap transition-all px-3 ${
												isDragActive
													? 'bg-[var(--hero-epta)] text-[var(--white)]'
													: 'bg-[var(--light-middle)] text-[var(--black)]'
											} `}
										>
											{ext}
										</p>
									))}
								</div>
								<div className='h-fit'>
									<button
										className='bg-[var(--black)] text-[var(--white)] rounded-lg flex gap-3 px-4 py-3 font-bold hover:bg-[var(--hero-epta)] cursor-pointer transition-all'
										onClick={() => document.getElementById(inputId).click()}
										type='button'
									>
										<Upload strokeWidth={3} />
										Загрузить видео
									</button>
								</div>
							</div>

							<input
								id={inputId}
								type='file'
								multiple
								accept='.mp4,.webm,.ogg,.mov,.avi,.wmv,.mkv,.3gp,.mpeg'
								className='hidden'
								onChange={handleFileChange}
							/>
						</label>
					</div>
				)}
			</div>
		</div>
	)
}
