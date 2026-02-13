import { FileAudio, Trash2, Upload, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import CustomAudioPlayer from '../AudioPlayer'
import api, { API, FILE_API } from '../../API'
import { getCookie } from '../../TOKEN'
import axios from 'axios'
import { useParams } from 'react-router-dom'

export const AudioInput = ({
	onStatusChange,
	onFileChange,
	DelComponent,
	onChange,
	info,
}) => {
	const inputId = useId()
	const [inputStatus, setInputStatus] = useState(false)
	const [file, setFile] = useState(null)
	const [isDragActive, setIsDragActive] = useState(false)
	const [audioUrl, setAudioUrl] = useState(info ? JSON.parse(info) : null)
	const maxSize = 50 * 1024 * 1024 // 10 MB

	useEffect(() => {
		const data = { info: JSON.stringify(audioUrl), type: 'audio' }
		onChange?.(data)
	}, [audioUrl])

	const handleFileChange = e => {
		const newFile = e.target.files[0]
		uploadFileToAPI(newFile)
	}

	const [progress, setProgress] = useState(null)
	const { courseId } = useParams()

	const uploadFileToAPI = async file => {
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

			setAudioUrl({
				audioUrl: fileUrl,
				fileName: file?.name,
				fileSize: file?.size,
			})
		} catch (error) {}
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
		uploadFileToAPI(newFile)
	}

	const removeFile = () => {
		setFile(null)
		setAudioUrl(null)
		const newStatus = false
		setInputStatus(newStatus)
		onStatusChange?.(newStatus)
		onFileChange?.(null)
		delFile(audioUrl?.audioUrl)
	}
	const delFile = path => {
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

	return (
		<>
			<div className='flex gap-2 w-full'>
				{audioUrl ? (
					<div className='w-full bg-[var(--light-gray)] rounded-lg p-4'>
						<div className='flex items-center justify-between mb-3'>
							<div className='flex items-center gap-2'>
								<FileAudio className='text-[var(--hero-epta)]' size={24} />
								<span className='font-medium text-[var(--black)]'>
									{audioUrl?.fileName}
								</span>
							</div>
						</div>

						<div className='flex items-center w-full gap-3'>
							<div className='w-full'>
								<CustomAudioPlayer audioUrl={audioUrl?.audioUrl} />
							</div>

							<button
								onClick={removeFile}
								className='text-[var(--middle)] cursor-pointer hover:bg-red-500 hover:text-[var(--white)] h-9 w-9 flex justify-center items-center rounded-md transition-colors'
							>
								<Trash2 size={24} />
							</button>
						</div>

						<div className='mt-3 text-sm text-[var(--middle)]'>
							Размер: {(audioUrl?.fileSize / (1024 * 1024)).toFixed(2)} MB
						</div>
					</div>
				) : (
					// Зона загрузки
					<div
						className={`p-2 ${
							isDragActive ? 'bg-[var(--hero-pale)]' : 'bg-[var(--light-gray)]'
						} rounded-lg transition-all w-full relative`}
					>
						<button
							className='absolute top-1 right-1 self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:bg-red-500 hover:text-white active:brightness-90 cursor-pointer transition-all'
							onClick={DelComponent}
						>
							<X />
						</button>
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
								<FileAudio
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
									до 50 МБ, только аудиофайлы
								</p>

								<button
									className='bg-[var(--black)] text-[var(--white)] rounded-lg flex gap-3 px-4 py-3 font-bold hover:bg-[var(--hero-epta)] cursor-pointer transition-all'
									onClick={() => document.getElementById(inputId).click()}
									type='button'
								>
									<Upload strokeWidth={3} />
									Загрузить аудио
								</button>
							</div>

							<input
								id={inputId}
								type='file'
								accept='audio/*'
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
