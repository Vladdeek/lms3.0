import {
	FileArchive,
	FileCode,
	FileImage,
	FileMusic,
	FilePlay,
	FilePlus2,
	FileQuestionMark,
	FileSpreadsheet,
	FileText,
	Trash2,
	Upload,
	X,
} from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { API, FILE_API } from '../../API'
import { maxFilesSizeInMB } from './Constants'
import { getCookie } from '../../TOKEN'
import axios from 'axios'
import { setGlobalError } from '../Errors'

export const ConstructorFileInput = ({
	onStatusChange,
	DelComponent,
	onChange,
	takeValues,
}) => {
	const inputId = useId()
	const [inputStatus, setInputStatus] = useState(false)
	const [files, setFiles] = useState(
		takeValues && takeValues.length > 0 ? takeValues : []
	)
	const [isDragActive, setIsDragActive] = useState(false)
	const maxFileSizeInMB = maxFilesSizeInMB
	const maxSize = maxFileSizeInMB * 1024 * 1024
	const maxFiles = 10

	console.log('files: ', files)

	const [isFileValid, setIsFileValid] = useState(true)

	useEffect(() => {
		const data = files
		onChange?.(data)
	}, [files])

	const handleFileChange = e => {
		const newFiles = Array.from(e.target.files)
		validateFiles(newFiles)
	}

	const uploadFileToAPI = async fileToUpload => {
		try {
			const formData = new FormData()
			formData.append('file', fileToUpload)
			console.log('formdata: ', formData)

			const response = await axios.post(`${API}/files/`, formData, {
				withCredentials: true,
				headers: {
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			const result = response.data
			console.log('response: ', result)

			setFiles(prevUrls => [
				...prevUrls,
				{
					file_path: `${FILE_API}${result?.file_path}`,
					name: fileToUpload.name,
					size: fileToUpload.size,
					type: fileToUpload.type,
				},
			])
		} catch (error) {
			console.error('Ошибка загрузки файла:', error)
			setGlobalError(error.response?.status || '500')
			throw error
		}
	}

	const validateFiles = async newFiles => {
		const currentTotalSize = files.reduce((total, file) => total + file.size, 0)

		const availableSize = maxSize - currentTotalSize

		if (availableSize <= 0) {
			setIsFileValid(false)
			setTimeout(() => {
				setIsFileValid(true)
			}, 1000)
			return
		}

		const validFiles = []
		const uploadPromises = []
		let remainingSize = availableSize

		newFiles.forEach(file => {
			if (file.size <= remainingSize) {
				validFiles.push(file)
				remainingSize -= file.size
			} else {
				setIsFileValid(false)
				setTimeout(() => {
					setIsFileValid(true)
				}, 1000)
				return
			}
		})

		if (validFiles.length > 0) {
			const newStatus = files.length + validFiles.length > 0
			setInputStatus(newStatus)
			onStatusChange?.(newStatus)

			validFiles.forEach(file => {
				uploadPromises.push(uploadFileToAPI(file))
			})

			try {
				await Promise.all(uploadPromises)
				console.log('Все файлы успешно загружены')
			} catch (error) {
				console.error('Ошибка при загрузке файлов:', error)
			}
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
			{DelComponent && (
				<button
					className='self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:brightness-95 active:brightness-90 cursor-pointer transition-all text-[var(--black)]'
					onClick={DelComponent}
				>
					<X />
				</button>
			)}

			<div
				className={`${
					files?.length > 0 && 'shadow-[var(--shadow)] p-4 rounded-xl'
				} flex flex-col justify-center w-full gap-3`}
			>
				{files?.length > 0 && (
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
								<div className='flex items-center gap-2 text-[var(--black)]'>
									{getFileIcon(file?.name)}
									<div>
										<p className='text-sm font-medium truncate w-full'>
											{file?.name}
										</p>
										<p className='text-xs text-[var(--middle)]'>
											{file?.type} • {formatFileSize(file?.size)}
										</p>
									</div>
								</div>
								{DelComponent ? (
									<X
										size={20}
										onClick={() => removeFile(index)}
										className='text-[var(--black)] hover:bg-red-500 hover:text-[var(--white)] cursor-pointer transition-all rounded-lg h-fit w-fit p-1 flex items-center justify-center'
									/>
								) : (
									<Trash2
										size={20}
										onClick={() => removeFile(index)}
										className='text-[var(--black)] hover:bg-red-500 hover:text-[var(--white)] cursor-pointer transition-all rounded-lg h-fit w-fit p-1 flex items-center justify-center'
									/>
								)}
							</div>
						))}
					</div>
				)}

				{files?.length < maxFiles && (
					<div
						className={`p-2 ${
							isDragActive
								? 'bg-[var(--hero-pale)]'
								: !isFileValid
								? 'bg-[var(--hard-lvl-bg)]'
								: 'bg-[var(--light-gray)]'
						} rounded-2xl transition-all`}
					>
						<label
							htmlFor='dropzone-file'
							className={`cursor-pointer rounded-xl p-[10px] flex gap-[10px] items-center w-full transition border-3 border-dashed ${
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
								<FilePlus2
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

								<div className='flex flex-wrap gap-[5px] w-full justify-center'>
									<p
										className={`rounded-lg text-sm font-normal py-1 whitespace-nowrap transition-all px-3 ${
											isDragActive
												? 'bg-[var(--hero-epta)] text-[var(--white)]'
												: !isFileValid
												? 'bg-[var(--red-status-bg)] text-[var(--hard-lvl-text)]'
												: 'bg-[var(--light-middle)] text-[var(--black)]'
										} `}
									>
										максимум {maxFileSizeInMB} МБ файлов в сумме
									</p>
								</div>

								<div className='h-fit'>
									<button
										className='bg-[var(--black)] text-[var(--white)] rounded-lg flex gap-3 px-4 py-3 font-bold hover:bg-[var(--hero-epta)] cursor-pointer transition-all'
										onClick={() => document.getElementById(inputId).click()}
										type='button'
									>
										<Upload strokeWidth={3} />
										Загрузить файл
										{files?.length > 0 &&
										files.reduce((total, file) => total + file.size, 0) <
											maxSize
											? ' ещё'
											: ''}
									</button>
								</div>
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

				{files?.length > 0 && (
					<p className='text-sm text-[var(--middle)]'>
						{formatFileSize(
							files.reduce((total, file) => total + file.size, 0)
						)}{' '}
						из {formatFileSize(maxSize)}
					</p>
				)}
			</div>
		</div>
	)
}
