import {
	Check,
	ChevronDown,
	CircleCheck,
	Download,
	Eye,
	EyeClosed,
	FileText,
	ImagePlus,
	Paperclip,
	ScanSearch,
	Search,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { AltLoader } from './Loader'
import { se } from 'date-fns/locale'

export const InputDefault = ({
	type,
	placeholder,
	title,
	required,
	validate,
	onStatusChange,
	value, // Добавляем проп value
	onChange, // Добавляем проп onChange
	blackText = false,
}) => {
	const [inputStatus, setInputStatus] = useState(false)
	const [internalValue, setInternalValue] = useState(value || '')

	// Синхронизируем внутреннее состояние с внешним value
	useEffect(() => {
		setInternalValue(value || '')
	}, [value])

	const handleInputChange = e => {
		const newValue = e.target.value
		setInternalValue(newValue)

		// Вызываем внешний обработчик, если он передан
		if (onChange) {
			onChange(e)
		}

		const status = validate ? validate(newValue) : newValue.trim() !== ''
		setInputStatus(status)
		if (onStatusChange) onStatusChange(status)
	}

	return (
		<div className='w-full inline-flex flex-col group'>
			{title && (
				<div className='inline-flex items-center gap-[10px]'>
					<p
						className={`text-[18px]  ${
							!blackText ? 'text-[var(--middle)]' : 'text-[var(--black)]'
						}`}
					>
						{title}
					</p>
					{required && (
						<CircleCheck
							color={!inputStatus ? 'var(--middle)' : 'var(--hero-epta)'}
							size={16}
						/>
					)}
				</div>
			)}

			<input
				type={type}
				value={internalValue}
				onChange={handleInputChange}
				className='rounded-xl p-[12px] bg-[var(--white)] shadow-[var(--shadow)] outline-0 focus:ring-1 focus:ring-[var(--hero-epta)] focus:shadow-[var(--hero-shadow)] placeholder:text-[var(--middle)] text-[var(--black)] transition mt-3'
				placeholder={placeholder}
			/>
		</div>
	)
}

export const InputAuth = ({
	placeholder,
	title,
	required,
	validate,
	onStatusChange,
	value,
	onChange,
	password = false,
}) => {
	const [inputStatus, setInputStatus] = useState(false)
	const [internalValue, setInternalValue] = useState(value || '')
	const [showPassword, setShowPassword] = useState(false)

	useEffect(() => {
		setInternalValue(value || '')
	}, [value])

	const handleInputChange = e => {
		const newValue = e.target.value
		setInternalValue(newValue)

		if (onChange) {
			onChange(e)
		}

		const status = validate ? validate(newValue) : newValue.trim() !== ''
		setInputStatus(status)
		if (onStatusChange) onStatusChange(status)
	}

	return (
		<div className='w-full inline-flex flex-col group'>
			{title && (
				<div className='inline-flex items-center gap-[10px]'>
					<p className={`text-[18px]  text-[var(--black)]`}>{title}</p>
					{required && (
						<CircleCheck
							color={!inputStatus ? 'var(--middle)' : 'var(--hero-epta)'}
							size={16}
						/>
					)}
				</div>
			)}
			<div
				className={` flex  items-center justify-center rounded-xl overflow-hidden bg-[var(--white)] shadow-[var(--shadow)]  focus-within:ring-1 focus-within:ring-[var(--hero-epta)] focus-within:shadow-[var(--hero-shadow)] placeholder:text-[var(--middle)] text-[var(--black)] transition mt-3`}
			>
				<input
					type={password && !showPassword ? 'password' : 'text'}
					value={internalValue}
					onChange={handleInputChange}
					placeholder={placeholder}
					className='outline-0 w-full p-4'
				/>
				{password && (
					<button
						type='button'
						onClick={() => {
							setShowPassword(prev => !prev)
						}}
						className='mx-3 cursor-pointer'
					>
						<div
							className={`transition-all duration-300 ${
								showPassword ? 'rotate-x-180' : 'rotate-x-0'
							}`}
						>
							{showPassword ? <Eye /> : <EyeClosed />}
						</div>
					</button>
				)}
			</div>
		</div>
	)
}

export const TextArea = ({
	type,
	placeholder,
	title,
	required,
	validate,
	value, // Принимаем value извне
	onChange, // Принимаем onChange извне
	InputStatus, // Принимаем статус извне (если нужно)
	readOnly = false,
}) => {
	const [internalInputStatus, setInternalInputStatus] = useState(false)

	const handleInputChange = e => {
		const value = e.target.value
		// Вызываем внешний обработчик
		if (onChange) {
			onChange(e)
		}
		// Валидация (если нужна)
		if (validate) {
			setInternalInputStatus(validate(value))
		}
	}

	return (
		<div
			className={`w-full inline-flex flex-col group transition-all duration-500 ${
				readOnly && 'opacity-35'
			}`}
		>
			{title && (
				<div className='inline-flex items-center gap-[10px]'>
					<p className='text-[18px] text-[var(--middle)]'>{title}</p>
					{required && (
						<CircleCheck
							className={`transition-all text-[var(--middle)] ${
								!(InputStatus !== undefined
									? InputStatus
									: internalInputStatus) && 'text-[var(--hero-epta)]'
							}`}
							size={16}
						/>
					)}
				</div>
			)}

			<textarea
				type={type}
				value={value} // Используем внешнее значение
				onChange={handleInputChange}
				className={`rounded-xl p-[12px] shadow-[var(--shadow)] outline-0 ${
					!readOnly && 'focus:ring-1 focus:ring-[var(--hero-epta)]'
				}  placeholder:text-[var(--middle)] text-[var(--black)] transition-all min-h-25 mt-3 resize-none`}
				placeholder={placeholder}
				maxLength={300}
				readOnly={readOnly}
			/>
		</div>
	)
}

export const FileInput = ({
	title,
	required,
	onStatusChange,
	onFileChange,
	photoUrl,
}) => {
	const [inputStatus, setInputStatus] = useState(false)
	const [fileInfo, setFileInfo] = useState(null)
	const [isDragActive, setIsDragActive] = useState(false)
	const [preview, setPreview] = useState(null)

	const validFormats = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
	const maxSize = 10 * 1024 * 1024 // 20 MB

	const getImageDimensions = file => {
		return new Promise((resolve, reject) => {
			const img = new Image()
			const url = URL.createObjectURL(file)

			img.onload = function () {
				const dimensions = {
					width: this.width,
					height: this.height,
				}
				URL.revokeObjectURL(url)
				resolve(dimensions)
			}

			img.onerror = function () {
				URL.revokeObjectURL(url)
				reject(new Error('Не удалось загрузить изображение'))
			}

			img.src = url
		})
	}

	const validateFile = async file => {
		if (!file) {
			setInputStatus(false)
			return
		}

		// 1. Валидация формата
		const isValidFormat = validFormats.includes(file.type)
		if (!isValidFormat) {
			setInputStatus(false)
			onStatusChange?.(false)
			setFileInfo(null)
			setPreview(null)
			return
		}

		// 2. Валидация размера
		const isValidSize = file.size <= maxSize
		if (!isValidSize) {
			setInputStatus(false)
			onStatusChange?.(false)
			setFileInfo(null)
			setPreview(null)
			return
		}

		// 3. Валидация разрешения, если это изображение
		if (file.type.startsWith('image/')) {
			try {
				const dimensions = await getImageDimensions(file)

				if (dimensions.width > 4000 || dimensions.height > 4000) {
					setInputStatus(false)
					onStatusChange?.(false)
					setFileInfo(null)
					setPreview(null)
					return
				}
			} catch (error) {
				console.error('Ошибка при проверке разрешения:', error)
				setInputStatus(false)
				onStatusChange?.(false)
				setFileInfo(null)
				setPreview(null)
				return
			}
		}

		// --- Если все ок ---
		setInputStatus(true)
		onStatusChange?.(true)
		setFileInfo({
			name: file.name,
			size: (file.size / 1024 / 1024).toFixed(2),
		})
		setPreview(URL.createObjectURL(file))
		onFileChange?.(file)
	}

	const handleFileChange = e => validateFile(e.target.files[0])
	const handleDrop = e => {
		e.preventDefault()
		setIsDragActive(false)
		validateFile(e.dataTransfer.files[0])
	}

	const handleDragOver = e => {
		e.preventDefault()
		setIsDragActive(true)
	}

	const handleDragLeave = () => {
		setIsDragActive(false)
	}

	return (
		<div className='flex flex-col justify-center w-full gap-3'>
			{title && (
				<div className='inline-flex items-center gap-[10px]'>
					<p className='text-[18px] text-[var(--middle)]'>{title}</p>
					{required && (
						<CircleCheck
							color={!inputStatus ? 'var(--middle)' : 'var(--hero-epta)'}
							size={16}
						/>
					)}
				</div>
			)}

			<label
				htmlFor='dropzone-file'
				className={`cursor-pointer rounded-lg bg-[var(--white)] shadow-[var(--shadow)] p-[10px] flex gap-[10px] items-center w-full transition ring-1 ${
					isDragActive
						? 'ring-[var(--hero-epta)] shadow-[2px_1px_8px_2px_var(--glow-hero-epta)]'
						: 'ring-transparent'
				}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<div className='w-1/5 flex justify-center items-center'>
					{preview || photoUrl ? (
						<img
							src={preview || photoUrl}
							alt='preview'
							className='w-[80px] h-[80px] object-cover rounded-lg'
						/>
					) : (
						<ImagePlus size={80} strokeWidth={1.5} color='var(--middle)' />
					)}
				</div>
				<div className='flex flex-wrap gap-[5px] w-2/5'>
					<p
						className={`rounded-lg text-xs font-normal p-1 whitespace-nowrap ${
							fileInfo && fileInfo.size <= 10
								? 'bg-[var(--hero-epta)] text-white'
								: 'bg-[var(--bg)] text-[var(--black)]'
						}`}
					>
						до 10 мб
					</p>
					{['.png', '.jpg', '.webp', '.gif'].map(ext => (
						<p
							key={ext}
							className={`rounded-lg text-xs font-normal p-1 whitespace-nowrap ${
								fileInfo && fileInfo.name.endsWith(ext)
									? 'bg-[var(--hero-epta)] text-white'
									: 'bg-[var(--bg)] text-[var(--black)]'
							}`}
						>
							{ext}
						</p>
					))}
				</div>
				<p
					className={`w-2/5 text-xs text-[var(--black)] font-normal ${
						fileInfo && 'truncate'
					}  text-center`}
				>
					{fileInfo ? (
						<>
							{fileInfo.name}
							<br />({fileInfo.size} МБ)
						</>
					) : (
						<>
							Перетащите файл сюда
							<br />
							или
							<br />
							нажмите для загрузки
						</>
					)}
				</p>

				<input
					id='dropzone-file'
					type='file'
					accept='.png,.jpg,.jpeg,.webp,.gif'
					className='hidden'
					onChange={handleFileChange}
				/>
			</label>
		</div>
	)
}

export const FileInputDocument = ({
	title,
	required,
	onStatusChange,
	onFileChange,
	fileUrl,
}) => {
	const [inputStatus, setInputStatus] = useState(false)
	const [fileInfo, setFileInfo] = useState(null)
	const [isDragActive, setIsDragActive] = useState(false)

	// Форматы документов
	const validFormats = [
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'application/zip',
		'application/x-rar-compressed',
		'text/plain',
	]

	const maxSize = 20 * 1024 * 1024 // 20MB

	const formatBytes = bytes => (bytes / 1024 / 1024).toFixed(2)

	const validateFile = file => {
		if (!file) {
			setInputStatus(false)
			return
		}

		// формат
		if (!validFormats.includes(file.type)) {
			setInputStatus(false)
			onStatusChange?.(false)
			setFileInfo(null)
			return
		}

		// размер
		if (file.size > maxSize) {
			setInputStatus(false)
			onStatusChange?.(false)
			setFileInfo(null)
			return
		}

		// всё ок
		setInputStatus(true)
		onStatusChange?.(true)
		setFileInfo({
			name: file.name,
			size: formatBytes(file.size),
		})
		onFileChange?.(file)
	}

	const handleFileChange = e => validateFile(e.target.files[0])

	const handleDrop = e => {
		e.preventDefault()
		setIsDragActive(false)
		validateFile(e.dataTransfer.files[0])
	}

	const handleDragOver = e => {
		e.preventDefault()
		setIsDragActive(true)
	}

	const handleDragLeave = () => setIsDragActive(false)

	return (
		<div className='flex flex-col justify-center w-full gap-3'>
			{title && (
				<div className='inline-flex items-center gap-[10px]'>
					<p className='text-[18px] text-[var(--middle)]'>{title}</p>
					{required && (
						<CircleCheck
							color={!inputStatus ? 'var(--middle)' : 'var(--hero-epta)'}
							size={16}
						/>
					)}
				</div>
			)}

			<label
				htmlFor='file-upload'
				className={`cursor-pointer rounded-lg bg-[var(--white)] shadow-[var(--shadow)] p-[10px] flex gap-[10px] items-center w-full transition ring-1 ${
					isDragActive
						? 'ring-[var(--hero-epta)] shadow-[2px_1px_8px_2px_var(--glow-hero-epta)]'
						: 'ring-transparent'
				}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				{/* Иконка файла */}
				<div className='w-1/5 flex justify-center items-center'>
					<Download size={32} strokeWidth={1.5} color='var(--middle)' />
				</div>

				{/* ограничения */}
				<div className='flex flex-wrap gap-[5px] w-2/5 text-[var(--black)]'>
					<p className='rounded-lg text-xs p-1 bg-[var(--bg)]'>до 10 мб</p>
					{['.docx'].map(ext => (
						<p
							key={ext}
							className={`rounded-lg text-xs p-1 whitespace-nowrap ${
								fileInfo && fileInfo.name.endsWith(ext)
									? 'bg-[var(--hero-epta)] text-white'
									: 'bg-[var(--bg)]'
							}`}
						>
							{ext}
						</p>
					))}
				</div>

				{/* текст */}
				<p
					className={`w-3/5 text-xs text-center text-[var(--black)] ${fileInfo && 'truncate'}`}
				>
					{fileInfo ? (
						<>
							{fileInfo.name}
							<br />({fileInfo.size} МБ)
						</>
					) : (
						<>
							Перетащите файл сюда
							<br />
							или нажмите для загрузки
						</>
					)}
				</p>

				<input
					id='file-upload'
					type='file'
					className='hidden'
					onChange={handleFileChange}
				/>
			</label>
		</div>
	)
}

export const SearchInput = ({
	width,
	height = 'auto',
	onChange,
	value,
	loading,
}) => {
	const [isLoading, setIsLoading] = useState()

	useEffect(() => {
		setIsLoading(loading)
	}, [loading])

	return (
		<div
			className='w-[383px] max-md:w-full inline-flex group rounded-lg p-[6px] bg-[var(--white)] text-[var(--black)] shadow-[var(--shadow)] gap-3 outline-0 focus:ring-1 focus:ring-[var(--hero-epta)] transition'
			style={{ width: width && width, height: height && height }}
		>
			<ScanSearch className='h-full w-auto aspect-square' strokeWidth={1.5} />
			<input
				className='outline-0 placeholder:text-[var(--middle)] w-full'
				type={'text'}
				placeholder={'Поиск'}
				onChange={onChange}
				value={value}
			/>
			{isLoading && <AltLoader />}
		</div>
	)
}

export const Checkbox = ({
	checked: checkedProp = false, // управляемое состояние
	onChange,
	label = '',
	id,
	disabled = false,
	className = '',
}) => {
	const [checked, setChecked] = useState(checkedProp)

	const handleChange = e => {
		const value = e.target.checked
		setChecked(value)
		onChange && onChange(value)
	}

	// Синхронизация внешнего checked
	// (если компонент используют как управляемый)
	if (checked !== checkedProp) {
		setChecked(checkedProp)
	}

	return (
		<label
			className={`inline-flex items-center gap-2 cursor-pointer select-none ${
				disabled ? 'opacity-50 cursor-not-allowed' : ''
			} ${className}`}
			htmlFor={id}
		>
			<span
				className={`w-5 h-5 flex items-center justify-center rounded border transition
                    ${
											checked
												? 'bg-[var(--hero-epta)] border-[var(--hero-epta)]'
												: 'bg-white border-[var(--middle)]'
										}
                    ${disabled ? 'pointer-events-none' : ''}
                `}
			>
				<input
					id={id}
					type='checkbox'
					checked={checked}
					disabled={disabled}
					onChange={handleChange}
					className='appearance-none w-5 h-5 absolute opacity-0'
					tabIndex={0}
				/>
				{checked && <Check size={18} color='white' strokeWidth={3} />}
			</span>
			{label && <span className='text-[16px]'>{label}</span>}
		</label>
	)
}

export const OptionInput = ({
	Options = [],
	color = 'white',
	placeholder = '',
	onChange,
	labelKey = 'name', // 👈 добавили ключ, по которому будем доставать текст
}) => {
	const [Selected, setSelected] = useState(0)
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		onChange?.(Selected)
	}, [Selected])

	return (
		<div className='relative select-none'>
			<div
				onClick={() => setIsOpen(prev => !prev)}
				className={`${
					color === 'white'
						? 'bg-[var(--white)] text-[var(--black)]'
						: 'bg-[var(--black)] text-[var(--white)]'
				} flex justify-between rounded-lg shadow-[var(--shadow)] cursor-pointer px-4 py-2 font-medium w-full`}
			>
				{placeholder.length === 0 ? (
					<span>
						{Options[Selected]
							? typeof Options[Selected] === 'object'
								? Options[Selected][labelKey] // 👈 если объект — берем нужное поле
								: Options[Selected]
							: '—'}
					</span>
				) : (
					<p className='whitespace-nowrap'>{placeholder}</p>
				)}
				<ChevronDown
					className={`transition-all rotate-0 ${isOpen && 'rotate-180'}`}
				/>
			</div>

			{isOpen && (
				<div
					className='absolute bg-[var(--white)] flex flex-col rounded-lg shadow-[var(--shadow)]
					max-h-50 overflow-y-scroll hide-scrollbar hide-scrollbar w-full top-14 z-10 text-[var(--black)]'
				>
					{Options.map((item, index) => (
						<p
							onClick={() => {
								setSelected(index)
								setIsOpen(false)
							}}
							key={index}
							className='px-3 py-2 transition-all hover:bg-[var(--light-middle)] cursor-pointer'
						>
							{typeof item === 'object' ? item[labelKey] : item}
						</p>
					))}
				</div>
			)}
		</div>
	)
}

export const OptionInput2 = ({
	Options = [],
	color = 'white',
	placeholder = '',
	onChange,
	value,
	labelKey = 'name',
	width = 'w-full',
}) => {
	const [Selected, setSelected] = useState(
		value !== undefined && value !== null
			? value
			: placeholder.length !== 0
				? null
				: 0,
	)
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		if (value !== undefined && value !== Selected) {
			setSelected(value)
		}
	}, [value])

	useEffect(() => {
		onChange?.(Selected)
	}, [Selected])

	return (
		<div className='relative select-none'>
			<div
				onClick={() => setIsOpen(prev => !prev)}
				className={`${
					color === 'white'
						? 'bg-[var(--white)] text-[var(--black)]'
						: 'bg-[var(--black)] text-[var(--white)]'
				} flex justify-between items-center rounded-lg shadow-[var(--shadow)] cursor-pointer px-4 py-2 font-medium ${width}`}
			>
				{Selected !== null ? (
					<span>{Options[Selected]}</span>
				) : (
					placeholder?.length && <p>{placeholder}</p>
				)}
				<ChevronDown
					className={`transition-all ${isOpen ? 'rotate-180' : ''}`}
				/>
			</div>

			{isOpen && (
				<div
					className='absolute bg-[var(--white)] flex flex-col rounded-lg shadow-[var(--shadow)]
					max-h-50 overflow-y-scroll w-full top-11 z-10 text-[var(--black)]'
				>
					{Options.map((item, index) => (
						<p
							key={index}
							onClick={() => {
								setSelected(index)
								setIsOpen(false)
							}}
							className='px-3 py-2 hover:bg-[var(--light-middle)] cursor-pointer'
						>
							{typeof item === 'object' ? item[labelKey] : item}
						</p>
					))}
				</div>
			)}
		</div>
	)
}

export const FilterOptionInput = ({
	Options = [],
	color = 'white',
	placeholder = '',
	onChange,
	value,
	labelKey = 'name',
	width = 'w-full',
	showReset = true, // 👈 можно выключать при желании
}) => {
	const [Selected, setSelected] = useState(
		value !== undefined && value !== null
			? value
			: placeholder.length !== 0
				? null
				: 0,
	)
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		if (value !== undefined && value !== Selected) {
			setSelected(value)
		}
	}, [value])

	useEffect(() => {
		onChange?.(Selected)
	}, [Selected])

	return (
		<div className='relative select-none'>
			<div
				onClick={() => setIsOpen(prev => !prev)}
				className={`${
					color === 'white'
						? 'bg-[var(--white)] text-[var(--black)]'
						: 'bg-[var(--black)] text-[var(--white)]'
				} flex justify-between items-center rounded-lg shadow-[var(--shadow)] cursor-pointer px-4 py-2 font-medium ${width}`}
			>
				{Selected !== null ? (
					<span>{Options[Selected]}</span>
				) : (
					placeholder?.length && <p>{placeholder}</p>
				)}
				<ChevronDown
					className={`transition-all ${isOpen ? 'rotate-180' : ''}`}
				/>
			</div>

			{isOpen && (
				<div
					className='absolute bg-[var(--white)] flex flex-col rounded-lg shadow-[var(--shadow)]
		max-h-[220px] overflow-y-auto hide-scrollbar w-full top-11 z-10 text-[var(--black)]'
				>
					{Options.map((item, index) => (
						<div
							key={index}
							onClick={() => {
								setSelected(index)
								setIsOpen(false)
							}}
							className='px-3 py-2 hover:bg-[var(--light-middle)] cursor-pointer'
						>
							{typeof item === 'object' ? item[labelKey] : item}
						</div>
					))}

					{/* 🔽 КНОПКА СБРОСА */}
					{showReset && (
						<div
							onClick={() => {
								setSelected(null)
								setIsOpen(false)
							}}
							className='px-3 bg-[var(--black)] rounded-md m-1 py-2 text-center
				text-[var(--white)] hover:bg-red-500 hover:text-red-50
				cursor-pointer font-medium transition-all'
						>
							Сбросить
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export const OptionSearch = ({
	Options = [],
	color = 'white',
	placeholder = '',
	onChange,
	onSearch, // ← НОВОЕ
	labelKey = 'name',
	onSelect,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [query, setQuery] = useState('')
	const [selectedIndex, setSelectedIndex] = useState(null)

	// УДАЛЯЕМ useMemo — фильтр больше не нужен!
	// ДАННЫЕ уже приходят с бэка.

	const handleChange = e => {
		const value = e.target.value
		setQuery(value)
		onSearch?.(value) // ← передаём вверх, запускаем fetch
	}

	useEffect(() => {
		if (selectedIndex !== null) {
			onChange?.(Options[selectedIndex])
		}
	}, [selectedIndex])

	return (
		<div className='relative select-none'>
			<div
				className={`${
					color === 'white'
						? 'bg-[var(--white)] text-[var(--black)]'
						: 'bg-[var(--black)] text-[var(--white)]'
				} flex justify-between rounded-lg shadow-[var(--shadow)] px-4 py-3 font-medium w-full
					focus-within:ring-2 focus-within:ring-[var(--hero-epta)] transition-all items-center`}
			>
				<input
					value={query}
					onChange={handleChange}
					placeholder={placeholder}
					className='w-full bg-transparent outline-none'
					onFocus={() => setIsOpen(true)}
					onBlur={() => setTimeout(() => setIsOpen(false), 150)}
				/>

				<ChevronDown
					className={`transition-all rotate-0 ${isOpen && 'rotate-180'}`}
				/>
			</div>

			{isOpen && (
				<div
					className='absolute bg-[var(--white)] flex flex-col rounded-lg shadow-[var(--shadow)]
					max-h-50 overflow-y-scroll hide-scrollbar w-full top-13 z-10 text-[var(--black)]'
				>
					{Options.length === 0 &&
						(query.length === 0 ? (
							<p className='px-3 py-2 opacity-50'>Ничего нет</p>
						) : (
							<div className='w-full h-15 flex justify-center items-center'>
								<AltLoader />
							</div>
						))}

					{Options.map((item, index) => (
						<button
							type='button'
							key={index}
							onClick={() => {
								setSelectedIndex(index)
								setQuery(item)
								onSelect?.(item)
							}}
							className='text-left px-3 py-2 transition-all hover:bg-[var(--hero-epta)] hover:text-white cursor-pointer w-full'
						>
							{item}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
