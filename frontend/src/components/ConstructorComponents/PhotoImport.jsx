import { ImagePlus, Upload, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { API, FILE_API } from '../../API'
import { motion } from 'framer-motion'
import { maxPhotoSizeInMB } from './Constants'
import { getCookie } from '../../TOKEN'
import axios from 'axios'
import { useError } from '../Errors'

const { setError } = useError()

export const ConstructorPhotoInput = ({
	onStatusChange,
	DelComponent,
	onChange,
	takeValues,
}) => {
	const inputId = useId()
	const [inputStatus, setInputStatus] = useState(false)

	const [isDragActive, setIsDragActive] = useState(false)
	const [previews, setPreviews] = useState([])
	const [imgUrl, setImgUrl] = useState(takeValues || [])

	const [isFileValid, setIsFileValid] = useState(true)

	useEffect(() => {
		const data = imgUrl
		onChange?.(data)
	}, [imgUrl])

	const validFormats = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

	const maxFileSizeInMB = maxPhotoSizeInMB // <--- максимальный размер файла в MБ
	const maxSize = maxFileSizeInMB * 1024 * 1024

	const maxFiles = 4

	const validateFile = async file => {
		// Валидация формата
		if (!validFormats.includes(file.type)) {
			return {
				isValid: false,
				error: `Недопустимый формат файла. Допустимые форматы: ${validFormats.join(
					', '
				)}`,
			}
		}

		// Валидация размера
		if (file.size > maxSize) {
			return {
				isValid: false,
				error: `Файл слишком большой. Максимальный размер: ${
					maxSize / 1024 / 1024
				}MB`,
			}
		}

		// Валидация разрешения для изображений
		if (file.type.startsWith('image/')) {
			try {
				const dimensions = await getImageDimensions(file)
				console.log(dimensions)

				if (dimensions.width > 4000 || dimensions.height > 4000) {
					return {
						isValid: false,
						error: `Изображение слишком большое. Максимальное разрешение: 4000x4000px. Текущее: ${dimensions.width}x${dimensions.height}px`,
					}
				}
			} catch (error) {
				console.error('Ошибка при проверке разрешения:', error)
				return {
					isValid: false,
					error: 'Не удалось проверить разрешение изображения',
				}
			}
		}

		return {
			isValid: true,
			error: null,
		}
	}

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

	const uploadFileToAPI = async fileToUpload => {
		const validation = await validateFile(fileToUpload)

		if (!validation.isValid) {
			setIsFileValid(false)
			setTimeout(() => {
				setIsFileValid(true)
			}, 1000)

			throw new Error(validation.error)
		}

		try {
			const formData = new FormData()
			formData.append('file', fileToUpload)

			const response = await axios.post(`${API}/files/`, formData, {
				withCredentials: true,
				headers: {
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			const result = response.data

			setImgUrl(prevUrls => [
				...prevUrls,
				{
					photoUrl: `${FILE_API}${result?.file_path}`,
				},
			])

			return result
		} catch (error) {
			console.error('Ошибка загрузки файла:', error)
			setError(error.response ? String(error.response.status) : '500')
			throw error
		}
	}

	const handleFileChange = e => {
		const files = Array.from(e.target.files)

		uploadFileToAPI(files[0])
	}

	const removePreview = index => {
		setImgUrl(prev => prev.filter((_, i) => i !== index))
		if (setImgUrl.length === 1) {
			setInputStatus(false)
			onStatusChange?.(false)
		}
		//deletePhoto(index)
	}

	const deletePhoto = async id => {
		try {
			const response = await axios.delete(
				`${API}/files/`,
				{
					data: {
						file_path: imgUrl[id]?.photoUrl
							.split(`${FILE_API}`)[1]
							.replace(/\\/g, '\\'),
					},
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				}
			)

			const result = response.data
			console.log(result)
		} catch (err) {
			console.error('Ошибка при удалении фото:', err)
			setError(err.response ? String(err.response.status) : '500')
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
		uploadFileToAPI(files[0])
	}

	return (
		<div className='flex gap-2'>
			<button
				className='self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:brightness-95 active:brightness-90 cursor-pointer transition-all text-[var(--black)]'
				onClick={DelComponent}
			>
				<X />
			</button>
			<div className='grid grid-cols-2 w-full gap-3'>
				{/* Отображаем превью загруженных изображений */}
				{imgUrl.map((previewData, index) => (
					<motion.div
						key={index}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{
							duration: 0.3,
							delay: index * 0.1,
							ease: 'easeOut',
						}}
					>
						<div key={index} className='relative col-span-1 aspect-16/9'>
							<img
								src={previewData.photoUrl}
								alt={`preview-${index}`}
								className='w-full h-full object-cover rounded-lg'
							/>

							<X
								size={20}
								onClick={() => removePreview(index)}
								className='absolute top-2 right-2 bg-[var(--white)] text-[var(--black)] hover:bg-red-500 hover:text-[var(--white)] cursor-pointer transition-all rounded-lg h-fit w-fit p-1 flex items-center justify-center'
							/>
						</div>
					</motion.div>
				))}

				{/* Показываем поле загрузки, если не достигнут лимит */}
				{imgUrl.length < maxFiles && (
					<motion.div
						key={imgUrl.length}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{
							duration: 0.3,
							delay: imgUrl.length * 0.1,
							ease: 'easeOut',
						}}
					>
						<div
							className={`p-2 flex ${
								imgUrl.length === 0 ? 'col-span-2' : 'col-span-1 aspect-16/9'
							}   ${
								isDragActive
									? 'border-[var(--hero-epta)]'
									: !isFileValid
									? 'border-[var(--hard-lvl-text)]'
									: 'border-[var(--middle)]'
							} ${
								isDragActive
									? 'bg-[var(--hero-pale)]'
									: !isFileValid
									? 'bg-[var(--hard-lvl-bg)]'
									: 'bg-[var(--light-gray)]'
							} rounded-xl transition-all`}
						>
							<label
								htmlFor='dropzone-file'
								className={`rounded-lg p-[10px] gap-[10px] transition border-3 w-full h-full border-dashed ${
									isDragActive
										? 'bg-[var(--hero-pale)] border-[var(--hero-epta)]'
										: !isFileValid
										? 'bg-[var(--hard-lvl-bg)] border-[var(--hard-lvl-text)]'
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
												: !isFileValid
												? 'text-[var(--hard-lvl-text)]'
												: 'text-[var(--middle)]'
										}`}
									/>
									<div className='flex flex-wrap gap-[5px] w-50 justify-center'>
										<p
											className={`rounded-lg text-sm font-normal py-1 whitespace-nowrap transition-all px-3 ${
												isDragActive
													? 'bg-[var(--hero-epta)] text-[var(--white)]'
													: !isFileValid
													? 'bg-[var(--red-status-bg)] text-[var(--hard-lvl-text)]'
													: 'bg-[var(--light-middle)] text-[var(--black)]'
											} `}
										>
											до {maxFileSizeInMB} мб
										</p>
										{['.png', '.jpg', '.webp', '.gif'].map(ext => (
											<p
												key={ext}
												className={`rounded-lg text-sm font-normal py-1 whitespace-nowrap transition-all px-3 ${
													isDragActive
														? 'bg-[var(--hero-epta)] text-[var(--white)]'
														: !isFileValid
														? 'bg-[var(--red-status-bg)] text-[var(--hard-lvl-text)]'
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
									accept='.png,.jpg,.jpeg,.webp,.gif'
									className='hidden'
									onChange={handleFileChange}
								/>
							</label>
						</div>
					</motion.div>
				)}
			</div>
		</div>
	)
}
