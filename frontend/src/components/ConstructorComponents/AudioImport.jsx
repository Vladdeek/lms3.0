import { FileAudio, Trash2, Upload, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import CustomAudioPlayer from '../AudioPlayer'
import api, { API, FILE_API } from '../../API'
import { maxAudioSizeInMB } from './Constants'
import Loader, { AltLoader, Loading } from '../Loader'
import { getCookie } from '../../TOKEN'
import axios from 'axios'

export const AudioInput = ({
	onStatusChange,
	onFileChange,
	DelComponent,
	takeValues,
}) => {
	const inputId = useId()
	const [inputStatus, setInputStatus] = useState(false)
	const [file, setFile] = useState(null)
	const [isDragActive, setIsDragActive] = useState(false)
	const [audioUrl, setAudioUrl] = useState(null)

	useEffect(() => {
		console.log('audio: ', takeValues?.file)
		setFile(takeValues?.file)
		setAudioUrl(takeValues?.fileUrl)
	}, [takeValues])

	const maxFileSizeInMB = maxAudioSizeInMB // <--- максимальный размер файла в MБ

	const maxSize = maxFileSizeInMB * 1024 * 1024

	const [isFileValid, setIsFileValid] = useState(true)

	const [progress, setProgress] = useState(null)

	const fakeProgressRef = useRef(null)

	const startFakeProgress = () => {
		if (fakeProgressRef.current) return

		fakeProgressRef.current = setInterval(() => {
			setProgress(prev => {
				if (prev >= 99) return prev
				return prev + 1
			})
		}, 1500)
	}

	const stopFakeProgress = () => {
		if (fakeProgressRef.current) {
			clearInterval(fakeProgressRef.current)
			fakeProgressRef.current = null
		}
	}

	const uploadFileToAPI = async fileToUpload => {
		const file = fileToUpload
		try {
			const formData = new FormData()
			formData.append('file', file)

			const responsePromise = api.post(`${API}/files/`, formData, {
				withCredentials: true,
				headers: {},
				onUploadProgress: progressEvent => {
					const percent = Math.round(
						(progressEvent.loaded * 100) / progressEvent.total,
					)

					// максимум 75%
					const cappedPercent = Math.round(percent * 0.75)
					setProgress(cappedPercent)
				},
			})
			// Ждём когда upload закончится (axios завершит отправку тела запроса)
			responsePromise.then(() => {}) // просто чтобы не было warning

			// Запускаем фейковый прогресс пока сервер думает
			startFakeProgress()

			const response = await responsePromise

			// Сервер ответил → стопаем фейковый прогресс и ставим 100
			stopFakeProgress()
			setProgress(100)

			const result = response.data
			setTimeout(() => {
				onFileChange?.({
					file: [
						{
							name: fileToUpload?.name,
							size: fileToUpload?.size,
							type: fileToUpload?.type,
						},
					],
					fileId: result?.id,
					fileUrl: `${FILE_API}${result?.file_path}`,
				})
			}, 500)
			return result
		} catch (error) {
			throw error
		} finally {
		}
	}

	const handleFileChange = e => {
		const newFile = e.target.files[0]
		validateFile(newFile)
	}

	const validateFile = newFile => {
		if (!newFile) return

		const isValidType = newFile.type.startsWith('audio/')
		if (!isValidType) {
			setIsFileValid(false)
			setTimeout(() => {
				setIsFileValid(true)
			}, 1000)
			return
		}

		const isValidSize = newFile.size <= maxSize
		if (!isValidSize) {
			setIsFileValid(false)
			setTimeout(() => {
				setIsFileValid(true)
			}, 1000)
			return
		}
		uploadFileToAPI(newFile)
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
		setAudioUrl(null)
		const newStatus = false
		setInputStatus(newStatus)
		onStatusChange?.(newStatus)
		onFileChange?.(null)
	}

	return (
		<>
			<div className='flex gap-2'>
				<button
					className='self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:brightness-95 active:brightness-90 cursor-pointer transition-all text-[var(--black)]'
					onClick={DelComponent}
				>
					<X />
				</button>
				{file ? (
					<div className='w-full bg-[var(--light-gray)] rounded-lg p-4'>
						<div className='flex items-center justify-between mb-3'>
							<div className='flex items-center gap-2'>
								<FileAudio className='text-[var(--hero-epta)]' size={24} />
								<span className='font-medium'>{file.name}</span>
							</div>
						</div>

						<div className='flex items-center w-full gap-3'>
							<div className='w-full'>
								{audioUrl === null ? (
									<AltLoader />
								) : (
									<CustomAudioPlayer audioUrl={audioUrl} />
								)}
							</div>

							<button
								onClick={removeFile}
								className='text-[var(--middle)] cursor-pointer hover:bg-red-500 hover:text-[var(--white)] h-9 w-9 flex justify-center items-center rounded-md transition-colors'
							>
								<Trash2 size={24} />
							</button>
						</div>

						<div className='mt-3 text-sm text-[var(--middle)]'>
							Размер: {(file.size / (1024 * 1024)).toFixed(2)} MB
						</div>
					</div>
				) : (
					// Зона загрузки
					<div
						className={`p-2 ${
							isDragActive
								? 'bg-[var(--hero-pale)]'
								: !isFileValid
									? 'bg-[var(--hard-lvl-bg)]'
									: 'bg-[var(--light-gray)]'
						} rounded-xl transition-all w-full`}
					>
						<label
							htmlFor={inputId}
							className={`cursor-pointer rounded-md p-[10px] flex gap-[10px] items-center w-full transition border-3 border-dashed ${
								isDragActive
									? 'border-[var(--hero-epta)]'
									: !isFileValid
										? 'border-[var(--hard-lvl-text)]'
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
											: !isFileValid
												? 'text-[var(--hard-lvl-text)]'
												: 'text-[var(--middle)]'
									}`}
								/>

								<p
									className={`rounded-lg text-sm font-normal py-1 px-3 whitespace-nowrap transition-all ${
										isDragActive
											? 'bg-[var(--hero-epta)] text-[var(--white)]'
											: !isFileValid
												? 'bg-[var(--red-status-bg)] text-[var(--hard-lvl-text)]'
												: 'bg-[var(--light-middle)] text-[var(--black)]'
									} `}
								>
									до {maxFileSizeInMB} МБ, только аудиофайлы
								</p>

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
									<div className='h-fit'>
										<button
											className='bg-[var(--black)] text-[var(--white)] rounded-lg flex gap-3 px-4 py-3 font-bold hover:bg-[var(--hero-epta)] cursor-pointer transition-all'
											onClick={() => document.getElementById(inputId).click()}
											type='button'
										>
											<Upload strokeWidth={3} />
											Загрузить аудио
										</button>
									</div>
								)}
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
