import {
	Download,
	FileArchive,
	FileCode,
	FileImage,
	FileMusic,
	FilePlay,
	FilePlus2,
	FileQuestionMark,
	FileSpreadsheet,
	FileText,
	Upload,
	X,
} from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import api, { API, FILE_API } from '../../API'
import { getCookie } from '../../TOKEN'
import axios from 'axios'

export const FileView = ({ onStatusChange, Files, haveType, pinedFiles }) => {
	const inputId = useId()
	const [inputStatus, setInputStatus] = useState(false)
	const [files, setFiles] = useState(null)
	const [isDragActive, setIsDragActive] = useState(false)
	const maxSize = 100 * 1024 * 1024 // 100 MB
	const maxFiles = 10

	useEffect(() => {
		setFiles(Files)
	}, [Files])

	const handleFileChange = e => {
		const newFiles = Array.from(e.target.files)
		validateFiles(newFiles)
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

	const formatFileSize = bytes => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const downloadFile = async id => {
		const { data } = await api.get(
			`${API}/files/download-url?key=${files[id]?.file_path?.replace(
				/^https?:\/\/s3\.ru1\.storage\.beget\.cloud\/[^/]+\//,
				'',
			)}`,
		)
		console.log(data)

		window.open(data, '_blank')
	}

	const downloadAPI = async id => {
		console.log({
			file_name: files[id]?.name.split('.')[0],
			file_path: files[id]?.file_path?.replace(
				/^https?:\/\/s3\.ru1\.storage\.beget\.cloud\/[^/]+\//,
				'',
			),
		})
		try {
			const response = await api.post(
				`${API}/files/download`,
				{
					file_name: files[id]?.name.split('.')[0],
					file_path: files[id]?.file_path?.replace(
						/^https?:\/\/s3\.ru1\.storage\.beget\.cloud\/[^/]+\//,
						'',
					),
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
					responseType: 'blob',
				},
			)

			// Скачиваем файл
			const blob = response.data
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement('a')

			a.style.display = 'none'
			a.href = url

			// Получаем имя файла
			const contentDisposition = response.headers['content-disposition']
			let filename = 'file'

			if (contentDisposition) {
				const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i)
				if (filenameMatch && filenameMatch.length > 1) {
					filename = filenameMatch[1]
				}
			}

			a.download = filename

			document.body.appendChild(a)
			a.click()
			window.URL.revokeObjectURL(url)
			document.body.removeChild(a)
		} catch (error) {}
	}

	const getFileIcon = file => {
		const lowerType = haveType ? file : file.split('.').pop().toLowerCase()
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
		<div className='flex gap-2 justify-center w-full'>
			<div
				className={`${pinedFiles ? 'w-full' : 'w-4/5 lg:w-2/3'}  flex flex-col border-1 border-[var(--light-middle)] rounded-lg h-fit overflow-hidden shadow-[var(--shadow)]`}
			>
				{files?.map((file, index) => (
					<div
						key={index}
						className={`flex items-center justify-between  p-3 file ${
							index % 2 === 0 ? 'bg-[var(--white)]' : 'bg-[var(--light-gray)]'
						} w-full`}
					>
						<div className='flex items-center gap-2'>
							{getFileIcon(haveType ? file.type : file.name)}
							<div>
								<p className='text-sm font-medium truncate text-[var(--black)] w-full'>
									{file.name}
								</p>
								<p className='text-xs text-[var(--middle)]'>
									{file.type} • {formatFileSize(file.size)}
								</p>
							</div>
						</div>
						<Download
							size={20}
							onClick={() => downloadFile(index)}
							className='text-[var(--black)] hover:bg-[var(--green-status-bg)] hover:text-[var(--green-status-text)] cursor-pointer transition-all rounded-lg h-fit w-fit p-1 flex items-center justify-center'
						/>
					</div>
				))}
			</div>
		</div>
	)
}
