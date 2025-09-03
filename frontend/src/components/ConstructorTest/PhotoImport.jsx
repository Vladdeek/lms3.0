import { ImagePlus, Upload, X } from 'lucide-react'
import { useId, useState } from 'react'

export const PhotoInput = ({ onStatusChange, DelComponent }) => {
	const inputId = useId()
	const [inputStatus, setInputStatus] = useState(false)
	const [fileInfo, setFileInfo] = useState(null)
	const [isDragActive, setIsDragActive] = useState(false)
	const [previews, setPreviews] = useState([]) // Изменили на массив для нескольких превью

	const validFormats = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
	const maxSize = 20 * 1024 * 1024 // 20 MB
	const maxFiles = 1 // Максимальное количество файлов

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
		<div className='flex gap-2 w-full'>
			<div className='grid grid-cols-1 w-full gap-3'>
				{/* Отображаем превью загруженных изображений */}
				{previews.map((previewData, index) => (
					<div
						key={index}
						className='relative col-span-1 flex justify-center aspect-16/9'
					>
						<img
							src={previewData.preview}
							alt={`preview-${index}`}
							className='w-auto h-full object-cover rounded-lg'
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
						} rounded-xl transition-all relative`}
					>
						<button
							className='absolute top-1 right-1 self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:bg-red-500 hover:text-white active:brightness-90 cursor-pointer transition-all'
							onClick={DelComponent}
						>
							<X />
						</button>
						<label
							htmlFor='dropzone-file'
							className={`rounded-md p-[10px] gap-[10px] transition border-3 aspect-16/9 w-full h-full border-dashed ${
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
