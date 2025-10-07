import { Film, Upload, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { InputDefault } from '../Inputs'
import VideoPlayer from '../VideoPlayer'
import { API, FILE_API } from '../../API'

export const ConstructorVideoInput = ({
	onStatusChange,
	DelComponent,
	onChange,
	takeValues,
}) => {
	const inputId = useId()
	const [inputStatus, setInputStatus] = useState(false)
	const [previews, setPreviews] = useState([])
	const [videoUrl, setVideoUrl] = useState('')
	const [isDragActive, setIsDragActive] = useState(false)
	const [uploading, setUploading] = useState(false)

	console.log(takeValues)

	useEffect(() => {
		if (takeValues && !videoUrl) {
			takeValues[0]?.isUrl
				? setPreviews([{ fileUrl: takeValues[0]?.videoUrl }])
				: setPreviews([{ fileUrl: takeValues[0]?.fileUrl }])
		}
	}, [])

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
	const maxSize = 100 * 1024 * 1024
	const maxFiles = 1

	const isValidUrl = url => {
		try {
			new URL(url)
			return true
		} catch (e) {
			return false
		}
	}

	const uploadFileToAPI = async fileToUpload => {
		setUploading(true)
		try {
			const formData = new FormData()
			formData.append('file', fileToUpload)

			const response = await fetch(`${API}/files/`, {
				method: 'POST',
				body: formData,
			})

			if (!response.ok) {
				const errorText = await response.text()
				throw new Error(`Ошибка загрузки: ${response.status} - ${errorText}`)
			}

			const result = await response.json()

			const uploadedUrl = `${FILE_API}${
				result?.file_path?.match(/static\\.*$/)?.[0]
			}`

			return {
				file: fileToUpload,
				fileId: result.id,
				fileUrl: uploadedUrl,
				preview: URL.createObjectURL(fileToUpload),
				info: {
					name: fileToUpload.name,
					size: (fileToUpload.size / 1024 / 1024).toFixed(2),
					type: fileToUpload.type,
					duration: 0,
				},
				isUrl: false,
			}
		} catch (error) {
			console.error('Ошибка загрузки файла:', error)
			throw error
		} finally {
			setUploading(false)
		}
	}

	const handleUrlChange = e => {
		const url = e.target.value
		setVideoUrl(url)

		if (url && isValidUrl(url)) {
			const urlPreview = {
				videoUrl: url,
				preview: null,
				info: {
					name: 'Видео по ссылке',
					size: 'N/A',
					type: 'video/url',
					duration: 0,
				},
				isUrl: true,
			}
			setPreviews([urlPreview])
			setInputStatus(true)
			onStatusChange?.(true)
			onChange?.([urlPreview])
		} else {
			setPreviews(prev => prev.filter(p => !p.isUrl))
			if (previews.length === 0) {
				setInputStatus(false)
				onStatusChange?.(false)
				onChange?.([])
			}
		}
	}

	const handleFileChange = e => {
		const files = Array.from(e.target.files)
		handleFiles(files)
	}

	const handleFiles = async files => {
		if (!files.length) return
		setVideoUrl('')

		const file = files[0]
		if (!validFormats.includes(file.type) || file.size > maxSize) return

		try {
			const uploadedFile = await uploadFileToAPI(file)

			setPreviews([uploadedFile])
			setInputStatus(true)
			onStatusChange?.(true)
			onChange?.([uploadedFile])
		} catch (error) {
			console.error('Ошибка обработки файла:', error)
		}
	}

	const removePreview = index => {
		if (!previews[index].isUrl) {
			URL.revokeObjectURL(previews[index].preview)
		}
		setPreviews(prev => prev.filter((_, i) => i !== index))
		if (previews.length === 1) {
			setInputStatus(false)
			onStatusChange?.(false)
			onChange?.([])
		}
	}

	const handleDragOver = e => {
		e.preventDefault()
		setIsDragActive(true)
	}
	const handleDragLeave = e => {
		e.preventDefault()
		setIsDragActive(false)
	}
	const handleDrop = e => {
		e.preventDefault()
		setIsDragActive(false)
		handleFiles(Array.from(e.dataTransfer.files))
	}

	useEffect(() => {
		return () => {
			previews.forEach(p => !p.isUrl && URL.revokeObjectURL(p.preview))
		}
	}, [previews])

	return (
		<div className='flex gap-2'>
			<button
				onClick={DelComponent}
				className='self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:brightness-95 active:brightness-90 cursor-pointer text-[var(--black)]'
			>
				<X />
			</button>

			<div className='flex justify-center w-full gap-3'>
				{previews.map((p, i) => (
					<div key={i} className='relative w-1/2 aspect-16/9 group'>
						<VideoPlayer url={p.videoUrl || p.fileUrl} />

						<X
							onClick={() => removePreview(i)}
							className='absolute top-2 right-2 bg-[var(--white)] text-[var(--black)] hover:bg-red-500 hover:text-[var(--white)] cursor-pointer transition-all rounded-lg h-fit w-fit p-1 flex items-center justify-center'
						/>
					</div>
				))}

				{previews.length < maxFiles && (
					<div
						className={`p-2 w-full h-full flex  ${
							isDragActive ? 'bg-[var(--hero-pale)]' : 'bg-[var(--light-gray)]'
						} rounded-lg transition-all`}
					>
						<label
							htmlFor={inputId}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							className={`rounded-lg p-[10px] transition border-3 w-full border-dashed ${
								isDragActive
									? 'border-[var(--hero-epta)]'
									: 'border-[var(--middle)]'
							}`}
						>
							<div className='flex flex-col items-center justify-center w-full h-full gap-5'>
								<Film
									size={80}
									strokeWidth={1.5}
									className={`${
										isDragActive
											? 'text-[var(--hero-epta)]'
											: 'text-[var(--middle)]'
									}`}
								/>
								<div className='flex flex-wrap gap-[5px] w-50 justify-center'>
									<p
										className={`${
											isDragActive
												? 'bg-[var(--hero-epta)] text-[var(--white)]'
												: 'bg-[var(--light-middle)] text-[var(--black)]'
										} rounded-lg text-sm font-normal py-1 whitespace-nowrap px-3`}
									>
										до 100 мб
									</p>
									{['.mp4', '.webm', '.mov', '.avi'].map(ext => (
										<p
											key={ext}
											className={`${
												isDragActive
													? 'bg-[var(--hero-epta)] text-[var(--white)]'
													: 'bg-[var(--light-middle)] text-[var(--black)]'
											} rounded-lg text-sm font-normal py-1 whitespace-nowrap px-3`}
										>
											{ext}
										</p>
									))}
								</div>

								<div className='flex flex-col items-center gap-3 h-fit w-1/2'>
									<button
										type='button'
										onClick={() => document.getElementById(inputId).click()}
										className='bg-[var(--black)] text-[var(--white)] rounded-lg flex gap-3 px-4 py-3 font-bold hover:bg-[var(--hero-epta)] w-fit cursor-pointer transition-all'
									>
										<Upload strokeWidth={3} /> Загрузить видео
									</button>
									<InputDefault
										title='Загрузить по ссылке'
										placeholder='https://example.com'
										width='100%'
										value={videoUrl}
										onChange={handleUrlChange}
									/>
								</div>
							</div>
							<input
								id={inputId}
								type='file'
								multiple
								accept='.mp4,.webm,.ogg,.mov,.avi,.wmv,.mkv,.3gp,.mpeg'
								className='hidden'
								onChange={handleFileChange}
								disabled={uploading}
							/>
						</label>
					</div>
				)}
			</div>
		</div>
	)
}
