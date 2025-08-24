import {
	ArchiveIcon,
	CircleCheck,
	Code,
	FileArchive,
	FileCode,
	FileCode2,
	FileImage,
	FileMusic,
	FilePlay,
	FilePlus2,
	FileQuestionMark,
	FileSpreadsheet,
	FileText,
	Film,
	ImageIcon,
	ImagePlus,
	Minus,
	Play,
	Plus,
	ScanSearch,
	Search,
	Trash,
	Upload,
	X,
} from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Button } from './Buttons'
import CustomCodeBlock from './CustomCodeBlock'

export const ConstructorTitleInput = ({}) => {
	const [inputValue, setInputValue] = useState('')
	const [inputStatus, setInputStatus] = useState(false)

	const handleInputChange = e => {
		const value = e.target.value
		setInputValue(value)
		const status = validate ? validate(value) : value.trim() !== ''
		setInputStatus(status)
		if (onStatusChange) onStatusChange(status)
	}

	return (
		<input
			type={'text'}
			value={inputValue}
			onChange={handleInputChange}
			className={`outline-0 transition mt-3 text-[20px] font-bold px-4 py-3 rounded-lg ${
				inputStatus ? 'text-[--black]' : 'text-[--middle]'
			}`}
			placeholder={'Заголовок занятия'}
		/>
	)
}

export const ConstructorTextArea = ({ validate, DelComponent }) => {
	const [inputStatus, setInputStatus] = useState(false)
	const [inputValue, setInputValue] = useState('')
	const [selectionState, setSelectionState] = useState({
		start: 0,
		end: 0,
		hasSelection: false,
	})
	const textareaRef = useRef(null)

	// Конфигурация кнопок форматирования
	const formatButtons = [
		{
			tag: 'span',
			className: 'font-bold',
			label: 'B',
			title: 'Жирный',
			icon: '𝐁',
		},
	]

	const handleInputChange = e => {
		const value = e.target.value
		setInputValue(value)
		setInputStatus(validate ? validate(value) : value.trim() !== '')
	}

	const handleSelectionChange = () => {
		if (textareaRef.current) {
			const { selectionStart, selectionEnd } = textareaRef.current
			setSelectionState({
				start: selectionStart,
				end: selectionEnd,
				hasSelection: selectionStart !== selectionEnd,
			})
		}
	}

	// Универсальная функция форматирования
	const wrapInTag = (tagName, className = '') => {
		if (!textareaRef.current || !selectionState.hasSelection) return

		const { start, end } = selectionState
		const selectedText = inputValue.substring(start, end)
		const beforeSelection = inputValue.substring(0, start)
		const afterSelection = inputValue.substring(end)

		// Формируем HTML-тег с классом
		const classAttr = className ? ` class="${className}"` : ''
		const wrappedText = `<${tagName}${classAttr}>${selectedText}</${tagName}>`
		const newValue = beforeSelection + wrappedText + afterSelection

		setInputValue(newValue)

		// Устанавливаем курсор после вставленного тега
		setTimeout(() => {
			if (textareaRef.current) {
				const newPosition = start + wrappedText.length
				textareaRef.current.setSelectionRange(newPosition, newPosition)
				textareaRef.current.focus()
			}
		}, 0)
	}

	// Обработчик для кнопок форматирования
	const handleFormatButtonClick = buttonConfig => {
		wrapInTag(buttonConfig.tag, buttonConfig.className)
	}

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
		}
	}, [inputValue])

	return (
		<div className='flex gap-2'>
			<button
				className='self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
				onClick={DelComponent}
			>
				<X />
			</button>
			<div className='w-full inline-flex flex-col group'>
				{/* Панель инструментов форматирования */}
				<div className='flex flex-wrap gap-1 mb-2'>
					{formatButtons.map((button, index) => (
						<button
							key={index}
							type='button'
							onClick={() => handleFormatButtonClick(button)}
							disabled={!selectionState.hasSelection}
							className={`px-3 py-1 rounded text-sm transition-colors min-w-[36px] flex items-center justify-center ${
								selectionState.hasSelection
									? 'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--hero-epta)] hover:text-[var(--white)] shadow-[var(--shadow)]'
									: 'bg-[var(--light-gray)] text-[var(--middle)] cursor-not-allowed'
							}`}
							title={button.title}
						>
							<span className='font-bold'>{button.icon || button.label}</span>
						</button>
					))}
				</div>

				<textarea
					ref={textareaRef}
					type={'text'}
					value={inputValue}
					onChange={handleInputChange}
					onSelect={handleSelectionChange}
					onMouseUp={handleSelectionChange}
					onKeyUp={handleSelectionChange}
					className={`${
						inputStatus ? 'text-[--black]' : 'text-[--middle]'
					}  px-4 py-3 rounded-lg outline-0 transition h-fit mt-3 resize-none overflow-hidden`}
					placeholder={'Содержимое'}
					rows={1}
					style={{ minHeight: '44px' }}
				/>
			</div>
		</div>
	)
}

export const ConstructorPhotoInput = ({
	title,
	required,
	onStatusChange,
	DelComponent,
}) => {
	const inputId = useId()
	const [inputStatus, setInputStatus] = useState(false)
	const [fileInfo, setFileInfo] = useState(null)
	const [isDragActive, setIsDragActive] = useState(false)
	const [previews, setPreviews] = useState([]) // Изменили на массив для нескольких превью

	const validFormats = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
	const maxSize = 20 * 1024 * 1024 // 20 MB
	const maxFiles = 4 // Максимальное количество файлов

	const handleFileChange = e => {
		const files = Array.from(e.target.files)
		handleFiles(files)
	}

	const handleFiles = files => {
		if (files.length === 0) return

		// Ограничиваем количество файлов до максимума
		const filesToProcess = files.slice(0, maxFiles - previews.length)

		const validFiles = []

		filesToProcess.forEach(file => {
			const isValidFormat = validFormats.includes(file.type)
			const isValidSize = file.size <= maxSize

			if (isValidFormat && isValidSize) {
				validFiles.push({
					file,
					preview: URL.createObjectURL(file),
					info: {
						name: file.name,
						size: (file.size / 1024 / 1024).toFixed(2),
						type: file.type,
					},
				})
			}
		})

		if (validFiles.length > 0) {
			setPreviews(prev => [...prev, ...validFiles])
			setInputStatus(true)
			onStatusChange?.(true)
		}
	}

	const removePreview = index => {
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
		// Проверяем, покидаем ли мы элемент целиком
		if (e.currentTarget.contains(e.relatedTarget)) return
		setIsDragActive(false)
	}

	const handleDrop = e => {
		e.preventDefault()
		setIsDragActive(false)
		const files = Array.from(e.dataTransfer.files)
		handleFiles(files)
	}

	return (
		<div className='flex gap-2'>
			<button
				className='self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
				onClick={DelComponent}
			>
				<X />
			</button>
			<div className='grid grid-cols-2 w-full gap-3'>
				{/* Отображаем превью загруженных изображений */}
				{previews.map((previewData, index) => (
					<div key={index} className='relative col-span-1 aspect-16/9'>
						<img
							src={previewData.preview}
							alt={`preview-${index}`}
							className='w-full h-full object-cover rounded-lg'
						/>

						<X
							size={20}
							onClick={() => removePreview(index)}
							className='absolute top-2 right-2 bg-[var(--white)] text-[var(--black)] hover:bg-red-500 hover:text-[var(--white)] cursor-pointer transition-all rounded-lg h-fit w-fit p-1 flex items-center justify-center'
						/>
					</div>
				))}

				{/* Показываем поле загрузки, если не достигнут лимит */}
				{previews.length < maxFiles && (
					<div
						className={`p-2 flex ${
							previews.length === 0
								? 'col-span-2 aspect-32/9'
								: 'col-span-1 aspect-16/9'
						}   ${
							isDragActive
								? 'border-[var(--hero-epta)]'
								: 'border-[var(--middle)]'
						} ${
							isDragActive ? 'bg-[var(--hero-pale)]' : 'bg-[var(--light-gray)]'
						} rounded-lg transition-all`}
					>
						<label
							htmlFor='dropzone-file'
							className={`rounded-lg p-[10px] gap-[10px] transition border-3 aspect-16/9 w-full h-full border-dashed ${
								isDragActive
									? 'bg-[var(--hero-pale)] border-[var(--hero-epta)]'
									: 'bg-[var(--light-gray)] border-[var(--middle)]'
							}`}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						>
							<div className='flex flex-col items-center justify-center w-full h-full gap-5'>
								<ImagePlus
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
										до 20 мб
									</p>
									{['.png', '.jpg', '.webp', '.gif'].map(ext => (
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
										Загрузить фото
									</button>
								</div>
							</div>

							<input
								id={inputId}
								type='file'
								multiple
								accept='.png,.jpg,.jpeg,.webp,.gif'
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

export const ConstructorVideoInput = ({
	title,
	required,
	onStatusChange,
	DelComponent,
}) => {
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

export const ConstructorFileInput = ({
	title,
	required,
	onStatusChange,
	DelComponent,
}) => {
	const inputId = useId()
	const [inputStatus, setInputStatus] = useState(false)
	const [files, setFiles] = useState([])
	const [isDragActive, setIsDragActive] = useState(false)
	const maxSize = 100 * 1024 * 1024 // 100 MB
	const maxFiles = 10

	const handleFileChange = e => {
		const newFiles = Array.from(e.target.files)
		validateFiles(newFiles)
	}

	const handleFormat = ({ files }) => {
		console.log('handleFormat - ' + files)
	}

	const validateFiles = newFiles => {
		// Проверка на превышение лимита файлов
		if (files.length + newFiles.length > maxFiles) {
			alert(`Можно загрузить не более ${maxFiles} файлов`)
			return
		}

		const validFiles = []

		newFiles.forEach(file => {
			const isValidSize = file.size <= maxSize

			if (isValidSize) {
				validFiles.push(file)
			} else {
				alert(`Файл ${file.name} превышает максимальный размер 100MB`)
			}
		})

		if (validFiles.length > 0) {
			const updatedFiles = [...files, ...validFiles]
			setFiles(updatedFiles)

			const newStatus = updatedFiles.length > 0
			setInputStatus(newStatus)
			onStatusChange?.(newStatus)
		}
	}

	const handleDragOver = e => {
		e.preventDefault()
		setIsDragActive(true)
	}

	const handleDragLeave = e => {
		e.preventDefault()
		// Проверяем, что мы действительно покидаем область drop zone
		if (e.currentTarget.contains(e.relatedTarget)) return
		setIsDragActive(false)
	}

	const handleDrop = e => {
		e.preventDefault()
		setIsDragActive(false)
		const newFiles = Array.from(e.dataTransfer.files)
		validateFiles(newFiles)
	}

	const removeFile = index => {
		const updatedFiles = files.filter((_, i) => i !== index)
		setFiles(updatedFiles)

		const newStatus = updatedFiles.length > 0
		setInputStatus(newStatus)
		onStatusChange?.(newStatus)
	}

	const formatFileSize = bytes => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const getFileIcon = file => {
		const lowerType = file.split('.').pop().toLowerCase()
		const formatMap = {
			image: {
				formats: [
					'jpg',
					'jpeg',
					'png',
					'gif',
					'bmp',
					'webp',
					'svg',
					'tiff',
					'ico',
				],
				icon: <FileImage size={24} color='var(--black)' strokeWidth={1.75} />,
			},
			document: {
				formats: [
					'pdf',
					'doc',
					'docx',
					'txt',
					'rtf',
					'odt',
					'ppt',
					'pptx',
					'odp',
				],
				icon: <FileText size={24} color='var(--black)' strokeWidth={1.75} />,
			},
			spreadsheet: {
				formats: ['xls', 'xlsx', 'csv', 'ods', 'numbers'],
				icon: (
					<FileSpreadsheet size={24} color='var(--black)' strokeWidth={1.75} />
				),
			},
			archive: {
				formats: ['zip', 'rar', '7z', 'tar', 'gz', 'iso'],
				icon: <FileArchive size={24} color='var(--black)' strokeWidth={1.75} />,
			},
			video: {
				formats: ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', 'webm'],
				icon: <FilePlay size={24} color='var(--black)' strokeWidth={1.75} />,
			},
			audio: {
				formats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'],
				icon: <FileMusic size={24} color='var(--black)' strokeWidth={1.75} />,
			},
			code: {
				formats: [
					'js',
					'ts',
					'py',
					'java',
					'html',
					'css',
					'php',
					'json',
					'xml',
					'sql',
					'rb',
					'go',
					'cpp',
					'cs',
					'swift',
					'kt',
					'rs',
				],
				icon: <FileCode size={24} color='var(--black)' strokeWidth={1.75} />,
			},
		}

		// Поиск подходящей иконки
		for (const category in formatMap) {
			if (formatMap[category].formats.includes(lowerType)) {
				return formatMap[category].icon
			}
		}

		return (
			<FileQuestionMark size={24} color='var(--black)' strokeWidth={1.75} />
		)
	}

	return (
		<div className='flex gap-2'>
			<button
				className='self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
				onClick={DelComponent}
			>
				<X />
			</button>
			<div
				className={`${
					files.length > 0 && 'shadow-[var(--shadow)] p-4 rounded-xl'
				} flex flex-col justify-center w-full gap-3`}
			>
				{/* Отображение загруженных файлов */}
				{files.length > 0 && (
					<div className='w-full flex flex-col border-1 border-[var(--light-middle)] rounded-lg h-fit overflow-hidden py-[1px]'>
						{files.map((file, index) => (
							<div
								key={index}
								className={`flex items-center justify-between p-3 file ${
									index % 2 === 0
										? 'bg-[var(--white)]'
										: 'bg-[var(--light-gray)]'
								} w-full`}
							>
								<div className='flex items-center gap-2'>
									{getFileIcon(file.name)}
									<div>
										<p className='text-sm font-medium truncate w-full'>
											{file.name}
										</p>
										<p className='text-xs text-[var(--middle)]'>
											{file.type} • {formatFileSize(file.size)}
										</p>
									</div>
								</div>
								<X
									size={20}
									onClick={() => removeFile(index)}
									className='text-[var(--black)] hover:bg-red-500 hover:text-[var(--white)] cursor-pointer transition-all rounded-lg h-fit w-fit p-1 flex items-center justify-center'
								/>
							</div>
						))}
					</div>
				)}

				{/* Отображение зоны загрузки, если не достигнут лимит файлов */}
				{files.length < maxFiles && (
					<div
						className={`p-2 ${
							isDragActive ? 'bg-[var(--hero-pale)]' : 'bg-[var(--light-gray)]'
						} rounded-lg transition-all`}
					>
						<label
							htmlFor='dropzone-file'
							className={`cursor-pointer rounded-lg p-[10px] flex gap-[10px] items-center w-full transition border-3 border-dashed ${
								isDragActive
									? 'border-[var(--hero-epta)]'
									: 'border-[var(--middle)]'
							}`}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						>
							<div className='w-full flex flex-col justify-center items-center gap-3'>
								<FilePlus2
									size={80}
									strokeWidth={1.5}
									className={`transition-all ${
										isDragActive
											? 'text-[var(--hero-epta)]'
											: 'text-[var(--middle)]'
									}`}
								/>

								<div className='flex flex-wrap gap-[5px] w-full justify-center'>
									<p
										className={`rounded-lg text-sm font-normal py-1 whitespace-nowrap transition-all px-3 ${
											isDragActive
												? 'bg-[var(--hero-epta)] text-[var(--white)]'
												: 'bg-[var(--light-middle)] text-[var(--black)]'
										} `}
									>
										до 100 МБ, максимум {maxFiles} файлов
									</p>
								</div>

								<div className='h-fit'>
									<button
										className='bg-[var(--black)] text-[var(--white)] rounded-lg flex gap-3 px-4 py-3 font-bold hover:bg-[var(--hero-epta)] cursor-pointer transition-all'
										onClick={() => document.getElementById(inputId).click()}
										type='button'
									>
										<Upload strokeWidth={3} />
										Загрузить файл{files.length > 0 ? ' ещё' : ''}
									</button>
								</div>
							</div>

							<input
								id={inputId}
								type='file'
								className='hidden'
								onChange={handleFileChange}
								multiple
							/>
						</label>
					</div>
				)}

				{/* Информация о количестве загруженных файлов */}
				{files.length > 0 && (
					<p className='text-sm text-[var(--middle)]'>
						Загружено {files.length} из {maxFiles} файлов
					</p>
				)}
			</div>
		</div>
	)
}

export const CodeFileInput = ({
	title,
	required,
	onStatusChange,
	onFileChange,
	DelComponent,
}) => {
	const inputId = useId()
	const [inputStatus, setInputStatus] = useState(false)
	const [file, setFile] = useState(null)
	const [isDragActive, setIsDragActive] = useState(false)
	const [codeInfo, setCodeInfo] = useState(null)
	const maxSize = 10 * 1024 * 1024 // 10 MB

	const getLanguageFromExtension = filename => {
		const extension = filename.split('.').pop().toLowerCase()

		const languageMap = {
			js: 'javascript',
			jsx: 'jsx',
			ts: 'typescript',
			tsx: 'tsx',
			py: 'python',
			java: 'java',
			cpp: 'cpp',
			c: 'c',
			cs: 'csharp',
			php: 'php',
			rb: 'ruby',
			go: 'go',
			rs: 'rust',
			html: 'html',
			css: 'css',
			scss: 'scss',
			sass: 'sass',
			less: 'less',
			json: 'json',
			xml: 'xml',
			sql: 'sql',
			md: 'markdown',
			yml: 'yaml',
			yaml: 'yaml',
			sh: 'shell',
			bat: 'batch',
			ps1: 'powershell',
		}

		return languageMap[extension] || extension
	}

	const handleFileChange = e => {
		const newFile = e.target.files[0]
		validateFile(newFile)
	}

	const validateFile = newFile => {
		if (!newFile) return
		const isValidSize = newFile.size <= maxSize
		if (!isValidSize) {
			alert(`Файл ${newFile.name} превышает максимальный размер 10MB`)
			return
		}

		readFile(newFile)
		setFile(newFile)

		const newStatus = true
		setInputStatus(newStatus)
		onStatusChange?.(newStatus)
		onFileChange?.(newFile)
	}

	const readFile = newFile => {
		const reader = new FileReader()
		reader.onload = e => {
			const text = e.target.result
			setCodeInfo([
				{
					code: text,
					language: getLanguageFromExtension(newFile.name),
				},
			])
		}
		reader.readAsText(newFile)
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
		const newFile = e.dataTransfer.files[0]
		validateFile(newFile)
	}

	const removeFile = () => {
		setFile(null)
		setCodeInfo(null)
		const newStatus = false
		setInputStatus(newStatus)
		onStatusChange?.(newStatus)
		onFileChange?.(null)
	}

	return (
		<>
			<div className='flex gap-2'>
				<button
					className='self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
					onClick={DelComponent}
				>
					<X />
				</button>
				{codeInfo ? (
					<CustomCodeBlock
						editMode={true}
						width='w-full'
						codeInfo={codeInfo[0]}
						onClick={removeFile}
					/>
				) : (
					// Зона загрузки
					<div
						className={`p-2 ${
							isDragActive ? 'bg-[var(--hero-pale)]' : 'bg-[var(--light-gray)]'
						} rounded-lg transition-all w-full`}
					>
						<label
							htmlFor={inputId}
							className={`cursor-pointer rounded-md p-[10px] flex gap-[10px] items-center w-full transition border-3 border-dashed ${
								isDragActive
									? 'border-[var(--hero-epta)]'
									: 'border-[var(--middle)]'
							}`}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						>
							<div className='w-full flex flex-col justify-center items-center gap-3'>
								<FileCode2
									size={80}
									strokeWidth={1.5}
									className={`transition-all ${
										isDragActive
											? 'text-[var(--hero-epta)]'
											: 'text-[var(--middle)]'
									}`}
								/>

								<p
									className={`rounded-lg text-sm font-normal py-1 px-3 whitespace-nowrap transition-all ${
										isDragActive
											? 'bg-[var(--hero-epta)] text-[var(--white)]'
											: 'bg-[var(--light-middle)] text-[var(--black)]'
									} `}
								>
									до 10 МБ, только файлы кода
								</p>

								<button
									className='bg-[var(--black)] text-[var(--white)] rounded-lg flex gap-3 px-4 py-3 font-bold hover:bg-[var(--hero-epta)] cursor-pointer transition-all'
									onClick={() => document.getElementById(inputId).click()}
									type='button'
								>
									<Upload strokeWidth={3} />
									Загрузить код
								</button>
							</div>

							<input
								id={inputId}
								type='file'
								className='hidden'
								onChange={handleFileChange}
							/>
						</label>
					</div>
				)}
			</div>
		</>
	)
}

export const TableConstructor = ({ DelComponent }) => {
	const [rows, setRows] = useState(2)
	const [cols, setCols] = useState(2)

	const addRow = () => setRows(prev => prev + 1)
	const removeRow = () =>
		rows > 2 && setRows(prev => (prev > 1 ? prev - 1 : prev))

	const addCol = () => setCols(prev => prev + 1)
	const removeCol = () =>
		cols > 2 && setCols(prev => (prev > 1 ? prev - 1 : prev))

	return (
		<>
			<div className='flex gap-2'>
				<button
					className='self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
					onClick={DelComponent}
				>
					<X />
				</button>
				<div className='flex flex-col bg-[var(--white)] shadow-[var(--shadow)] rounded-lg p-4 w-full'>
					<p className='text-[var(--middle)] font-medium mb-2'>Таблица</p>

					{/* Верхняя панель: таблица + кнопки для столбцов */}
					<div className='w-full flex justify-between'>
						<div
							className={`grid w-full mb-1 mr-1 rounded-lg overflow-hidden border-1 border-[var(--light-middle)]`}
							style={{
								gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
								gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
							}}
						>
							{Array.from({ length: rows * cols }).map((_, i) => {
								const colIndex = i % cols
								const isDark = colIndex % 2 === 1

								return (
									<input
										key={i}
										type='text'
										className={`outline-0 border border-[var(--light-middle)] p-2 transition-all ${
											isDark ? ' bg-[var(--light-gray)]' : ' bg-[var(--white)]'
										}`}
									/>
								)
							})}
						</div>

						{/* Кнопки для управления столбцами */}
						<div className='flex flex-col gap-1'>
							<button
								className='w-10 h-full rounded-lg flex items-center justify-center bg-[var(--light-middle)] hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
								onClick={addCol}
							>
								<Plus color='var(--middle)' />
							</button>
							<button
								className='w-10 h-full rounded-lg flex items-center justify-center bg-[var(--light-middle)] hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
								onClick={removeCol}
							>
								<Minus color='var(--middle)' />
							</button>
						</div>
					</div>

					{/* Нижняя панель: кнопки для строк */}
					<div className='flex'>
						<div className='w-full flex gap-1'>
							<button
								className='w-full h-10 rounded-lg flex items-center gap-3 justify-center bg-[var(--light-middle)] text-[var(--middle)] hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
								onClick={addRow}
							>
								<Plus color='var(--middle)' />
								Добавить строку
							</button>
							<button
								className='w-full h-10 rounded-lg flex items-center gap-3 justify-center bg-[var(--light-middle)] text-[var(--middle)] hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
								onClick={removeRow}
							>
								<Minus color='var(--middle)' />
								Удалить строку
							</button>
						</div>
						<div className='h-10 w-10'></div>
					</div>
				</div>
			</div>
		</>
	)
}
