import {
	Check,
	ChevronDown,
	CircleCheck,
	FileText,
	ImagePlus,
	ScanSearch,
	Search,
} from 'lucide-react'
import { useEffect, useState } from 'react'

export const InputDefault = ({
	type,
	placeholder,
	title,
	required,
	validate,
	onStatusChange,
	value, // Добавляем проп value
	onChange, // Добавляем проп onChange
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
					<p className='text-[18px] text-[var(--middle)]'>{title}</p>
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
				className='rounded-xl p-[12px] shadow-[var(--shadow)] outline-0 focus:ring-1 focus:ring-[var(--hero-epta)] transition mt-3'
				placeholder={placeholder}
			/>
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
		<div className='w-full inline-flex flex-col group'>
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
				className='rounded-xl p-[12px] shadow-[var(--shadow)] outline-0 focus:ring-1 focus:ring-[var(--hero-epta)] transition min-h-25 mt-3 resize-none'
				placeholder={placeholder}
			/>
		</div>
	)
}

export const FileInput = ({
	title,
	required,
	onStatusChange,
	onFileChange,
}) => {
	const [inputStatus, setInputStatus] = useState(false)
	const [fileInfo, setFileInfo] = useState(null)
	const [isDragActive, setIsDragActive] = useState(false)
	const [preview, setPreview] = useState(null)

	const validFormats = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
	const maxSize = 20 * 1024 * 1024 // 20 MB

	const validateFile = file => {
		if (!file) return setInputStatus(false)
		const isValidFormat = validFormats.includes(file.type)
		const isValidSize = file.size <= maxSize

		if (isValidFormat && isValidSize) {
			setInputStatus(true)
			onStatusChange?.(true)
			setFileInfo({
				name: file.name,
				size: (file.size / 1024 / 1024).toFixed(2),
			})
			setPreview(URL.createObjectURL(file))
			onFileChange?.(file) // отправляем файл наружу
		} else {
			setInputStatus(false)
			onStatusChange?.(false)
			setFileInfo(null)
			setPreview(null)
		}
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
					{preview ? (
						<img
							src={preview}
							alt='preview'
							className='w-[80px] h-[80px] object-cover rounded-lg'
						/>
					) : (
						<ImagePlus size={80} strokeWidth={1.5} color='var(--middle)' />
					)}
				</div>
				<div className='flex flex-wrap gap-[5px] w-2/5'>
					<p
						className={`rounded-lg text-sm font-normal p-1 whitespace-nowrap ${
							fileInfo && fileInfo.size <= 20
								? 'bg-[var(--hero-epta)] text-white'
								: 'bg-[var(--bg)] text-[var(--black)]'
						}`}
					>
						до 20 мб
					</p>
					{['.png', '.jpg', '.webp', '.gif'].map(ext => (
						<p
							key={ext}
							className={`rounded-lg text-sm font-normal p-1 whitespace-nowrap ${
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
					className={`w-2/5 text-[var(--black)] text-sm font-normal ${
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

export const SearchInput = ({ width, height = 'auto' }) => {
	return (
		<div
			className='w-[383px] inline-flex group rounded-lg p-[6px] bg-[var(--white)] text-[var(--black)] shadow-[var(--shadow)] gap-3 outline-0 focus:ring-1 focus:ring-[var(--hero-epta)] transition'
			style={{ width: width, height: height }}
		>
			<ScanSearch className='h-full w-auto aspect-square' strokeWidth={1.5} />
			<input className='outline-0' type={'text'} placeholder={'Поиск'} />
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

export const OptionInput = ({ Options, color = 'white', placeholder = '' }) => {
	const [Selected, setSelected] = useState(0)
	const [isOpen, setIsOpen] = useState(false)
	return (
		<>
			<div className='relative select-none'>
				<div
					onClick={() => setIsOpen(prev => !prev)}
					className={` ${
						color === 'white'
							? 'bg-[var(--white)] text-[var(--black)]'
							: 'bg-[var(--black)] text-[var(--white)]'
					} flex justify-between rounded-lg shadow-[var(--shadow)] cursor-pointer px-4 py-2 font-medium w-full`}
				>
					{placeholder.length === 0 ? (
						Options[Selected]
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
				max-h-50 overflow-scroll w-full top-14 z-100'
					>
						{Options.map((item, index) => {
							return (
								<p
									key={index}
									className='px-3 py-2 transition-all hover:bg-[var(--light-middle)] cursor-pointer'
								>
									{item}
								</p>
							)
						})}
					</div>
				)}
			</div>
		</>
	)
}
