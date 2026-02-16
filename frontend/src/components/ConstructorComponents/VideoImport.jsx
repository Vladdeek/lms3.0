import { Film, Upload, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { InputDefault } from '../Inputs'
import VideoPlayer from '../VideoPlayer'
import api, { API, FILE_API } from '../../API'
import { maxVideoSizeInMB } from './Constants'
import { getCookie } from '../../TOKEN'
import axios from 'axios'
import { progress } from 'framer-motion'
import { Loading } from '../Loader'
import { useParams } from 'react-router-dom'

export const ConstructorVideoInput = ({
	onStatusChange,
	DelComponent,
	onChange,
	takeValues,
}) => {
	const inputId = useId()
	const { courseId } = useParams()
	const [inputStatus, setInputStatus] = useState(false)
	const [previews, setPreviews] = useState([])
	const [videoUrl, setVideoUrl] = useState('')
	const [isDragActive, setIsDragActive] = useState(false)
	const [uploading, setUploading] = useState(false)

	const [isFileValid, setIsFileValid] = useState(true)

	useEffect(() => {
		if (!takeValues) return

		if (takeValues.length === 0) {
			setPreviews([])
			return
		}

		if (!videoUrl && takeValues[0]) {
			const fileUrl = takeValues[0]?.isUrl
				? takeValues[0]?.videoUrl
				: takeValues[0]?.fileUrl

			if (fileUrl) {
				setPreviews([{ fileUrl }])
			}
		}
	}, [takeValues, videoUrl, setPreviews])

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

	const maxFileSizeInMB = maxVideoSizeInMB // <--- максимальный размер файла в MБ
	const maxSize = maxFileSizeInMB * 1024 * 1024
	const maxFiles = 1

	const isValidUrl = url => {
		try {
			new URL(url)
			return true
		} catch (e) {
			return false
		}
	}

	const [progress, setProgress] = useState(null)

	const uploadFileToAPI = async file => {
		setUploading(true)
		setProgress(0)

		try {
			const { data } = await api.post(`${API}/files/upload-url`, {
				filename: file.name.split('.').slice(0, -1).join('.'),
				type: file.name.split('.').pop(),
				content_type: file.type,
				destination: `courses/${courseId}`,
			})

			const formData = new FormData()
			Object.entries(data.fields).forEach(([key, value]) => {
				formData.append(key, value)
			})
			formData.append('file', file)
			await axios.post(data.url, formData, {
				onUploadProgress: e => {
					const percent = Math.round((e.loaded * 100) / e.total)
					setProgress(percent)
				},
			})

			const fileUrl = `${data.url}/${data.fields.key}`

			setProgress(100)
			setTimeout(() => {
				setProgress(null)
			}, 500)

			return {
				file: file,
				fileUrl: fileUrl,
				preview: URL.createObjectURL(file),
				isUrl: false,
			}
		} catch (error) {}
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

	const validStyleFunc = () => {
		setIsFileValid(false)
		const timer = setTimeout(() => {
			setIsFileValid(true)
		}, 1000)

		return () => clearTimeout(timer)
	}

	const handleFiles = async files => {
		if (!files.length) return
		setVideoUrl('')

		const file = files[0]
		if (!validFormats.includes(file.type) || file.size > maxSize) {
			validStyleFunc()
			return
		} else
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

	const removePreview = (index, path, isFile) => {
		if (!previews[index].isUrl) {
			URL.revokeObjectURL(previews[index].preview)
		}
		setPreviews(prev => prev.filter((_, i) => i !== index))
		if (previews.length === 1) {
			setInputStatus(false)
			onStatusChange?.(false)
			onChange?.([])
			if (isFile) {
				removeFile(path)
			}
			{
			}
		}
	}

	const removeFile = path => {
		try {
			const response = api.delete(`${API}/files/`, {
				data: {
					file_path: path.replace(
						/^https:\/\/s3\.ru1\.storage\.beget\.cloud\/02eb54dfa411-vm-lms\//,
						'',
					),
				},
				withCredentials: true,
			})
		} catch (error) {}
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
				{previews.map((p, i) => {
					const isFile = !!p?.fileUrl
					const url = isFile ? p.fileUrl : p.videoUrl

					return (
						<div key={i} className='relative w-1/2 aspect-16/9 group'>
							<VideoPlayer url={url} />

							<X
								onClick={() => removePreview(i, url, isFile)}
								className='absolute top-2 right-2 bg-[var(--white)] text-[var(--black)] hover:bg-red-500 hover:text-[var(--white)] cursor-pointer transition-all rounded-lg h-fit w-fit p-1 flex items-center justify-center'
							/>
						</div>
					)
				})}

				{previews.length < maxFiles && (
					<div
						className={`p-2 w-full h-full flex  ${
							isDragActive
								? 'bg-[var(--hero-pale)]'
								: !isFileValid
									? 'bg-[var(--hard-lvl-bg)]'
									: 'bg-[var(--light-gray)]'
						} rounded-xl transition-all`}
					>
						<label
							htmlFor={inputId}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							className={`rounded-lg p-[10px] transition border-3 w-full border-dashed ${
								isDragActive
									? 'border-[var(--hero-epta)]'
									: !isFileValid
										? 'border-[var(--hard-lvl-text)]'
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
											: !isFileValid
												? 'text-[var(--hard-lvl-text)]'
												: 'text-[var(--middle)]'
									}`}
								/>
								<div className='flex flex-wrap gap-[5px] w-50 justify-center'>
									<p
										className={`${
											isDragActive
												? 'bg-[var(--hero-epta)] text-[var(--white)]'
												: !isFileValid
													? 'bg-[var(--red-status-bg)] text-[var(--hard-lvl-text)]'
													: 'bg-[var(--light-middle)] text-[var(--black)]'
										} rounded-lg text-sm font-normal py-1 whitespace-nowrap px-3`}
									>
										до {maxFileSizeInMB} мб
									</p>
									{['.mp4', '.webm', '.mov', '.avi'].map(ext => (
										<p
											key={ext}
											className={`${
												isDragActive
													? 'bg-[var(--hero-epta)] text-[var(--white)]'
													: !isFileValid
														? 'bg-[var(--red-status-bg)] text-[var(--hard-lvl-text)]'
														: 'bg-[var(--light-middle)] text-[var(--black)]'
											} rounded-lg text-sm font-normal py-1 whitespace-nowrap px-3`}
										>
											{ext}
										</p>
									))}
								</div>

								<div className='flex flex-col items-center gap-3 h-fit w-1/2'>
									{progress !== null ? (
										<div className='w-full flex flex-col  rounded-lg h-fit overflow-hidden py-[1px]'>
											<div
												className={`flex flex-col items-start justify-between p-3 file  w-full`}
											>
												<div className='flex gap-3 justify-center w-full'>
													<p className='text-[var(--black)]'>{progress}%</p>
													<Loading />
												</div>

												<div
													className='bg-[var(--hero-epta)] rounded-full transition-all ease-linear delay-0 duration-750 h-2'
													style={{ width: `${progress}%` }}
												></div>
											</div>
										</div>
									) : (
										<button
											type='button'
											onClick={() => document.getElementById(inputId).click()}
											className='bg-[var(--black)] text-[var(--white)] rounded-lg flex gap-3 px-4 py-3 font-bold hover:bg-[var(--hero-epta)] w-fit cursor-pointer transition-all'
										>
											<Upload strokeWidth={3} /> Загрузить видео
										</button>
									)}

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
