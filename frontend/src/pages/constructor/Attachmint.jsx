import {
	ChevronDown,
	Eye,
	EyeClosed,
	FileArchive,
	FileCode,
	FileImage,
	FileMusic,
	FilePlay,
	FilePlus2,
	FileQuestionMark,
	FileSpreadsheet,
	FileText,
	Filter,
	FilterIcon,
	Funnel,
	Group,
	Trash,
	Trash2,
	Upload,
	X,
} from 'lucide-react'
import { RadioButton } from '../../components/Buttons'
import { useEffect, useId, useRef, useState } from 'react'
import {
	FilterOptionInput,
	OptionInput2,
	SearchInput,
} from '../../components/Inputs'
import api, { API, FILE_API } from '../../API'
import { useParams } from 'react-router-dom'
import { use } from 'react'
import { getCookie } from '../../TOKEN'
import { maxFilesSizeInMB } from '../../components/ConstructorComponents/Constants'
import { Loading } from '../../components/Loader'
import axios from 'axios'

const ConstructorFileInput = ({
	onStatusChange,
	DelComponent,
	onChange,
	takeValues,
}) => {
	const { courseId } = useParams()
	const inputId = useId()
	const [inputStatus, setInputStatus] = useState(false)
	const [files, setFiles] = useState(
		takeValues && takeValues.length > 0 ? takeValues : [],
	)
	const [isDragActive, setIsDragActive] = useState(false)
	const maxFileSizeInMB = 50
	const maxSize = maxFileSizeInMB * 1024 * 1024
	const maxFiles = 10

	const [isFileValid, setIsFileValid] = useState(true)

	useEffect(() => {
		const data = files
		onChange?.(data)
	}, [files])

	const handleFileChange = e => {
		const newFiles = Array.from(e.target.files)
		validateFiles(newFiles)
	}

	const [progress, setProgress] = useState(null)

	const fetchFiles = async () => {
		try {
			const res = await api.get(`${API}/courses/${courseId}/attachments`, {
				withCredentials: true,
				headers: {},
			})

			const result = res.data || []

			const mapped = result.map(file => ({
				file_path: `${file.file_path}`,
				name: file.original_name,
				size: file.file_size,
				type: file.file_extension,
				id: file.id,
			}))

			setFiles(mapped)
		} catch (e) {}
	}

	useEffect(() => {
		fetchFiles()
	}, [])

	const uploadFileToAPI = async file => {
		try {
			const { data } = await api.post(`${API}/files/upload-url`, {
				filename: file.name.split('.').slice(0, -1).join('.'),
				type: file.name.split('.').pop(),
				content_type: file.type,
				destination: `courses/${courseId}/attachments`,
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

			const response = await api.post(
				`${API}/courses/${courseId}/attachments`,
				{
					file_path: data.fields.key,
					original_name: file.name,
					mime_type: file.type,
					file_size: file.size,
				},
				{
					withCredentials: true,
				},
			)

			setProgress(100)
			setTimeout(() => {
				setProgress(null)
			}, 500)
			fetchFiles()
		} catch (error) {
			console.error(error.response?.data || error)
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
			} catch (error) {}
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

	const removeFile = (id, path) => {
		try {
			const response = api.delete(`${API}/courses/${courseId}/attachments`, {
				data: {
					file_path: path,
					id: id,
				},
				withCredentials: true,
			})

			fetchFiles()
		} catch (error) {}
	}

	const formatFileSize = bytes => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const getFileIcon = file => {
		const lowerType = file
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

	const [isShow, setIsShow] = useState(false)

	return (
		<div className='flex gap-2'>
			<div className={` flex flex-col-reverse justify-center w-full gap-3`}>
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
									{getFileIcon(file?.type)}
									<div>
										<p className='text-sm font-medium truncate w-full'>
											{file?.name}
										</p>
										<p className='text-xs text-[var(--middle)]'>
											{file?.type} • {formatFileSize(file?.size)}
										</p>
									</div>
								</div>
								<div className='flex gap-3'>
									<Trash2
										size={20}
										onClick={() => removeFile(file.id, file.file_path)}
										className='text-[var(--black)] hover:bg-red-500 hover:text-[var(--white)] cursor-pointer transition-all rounded-lg h-fit w-fit p-1 flex items-center justify-center'
									/>
								</div>
							</div>
						))}
					</div>
				)}

				<p className='text-sm text-[var(--middle)]'>
					{formatFileSize(files.reduce((total, file) => total + file.size, 0))}{' '}
					из {formatFileSize(maxSize)}
				</p>

				{formatFileSize(files.reduce((total, file) => total + file.size, 0)) <
					formatFileSize(maxSize) && (
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
											Загрузить файл
											{files?.length > 0 &&
											files.reduce((total, file) => total + file.size, 0) <
												maxSize
												? ' ещё'
												: ''}
										</button>
									</div>
								)}
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
			</div>
		</div>
	)
}

const Attachment = () => {
	const { courseId } = useParams()

	const [groups, setGroups] = useState([])
	const [lessons, setLessons] = useState({})

	const [selectedGroup, setSelectedGroup] = useState(null)
	const [selectedLesson, setSelectedLesson] = useState(null)
	const [selectedFilter, setSelectedFilter] = useState(null)

	const [searchStudents, setSearchStudents] = useState('')
	const [isSearchLoading, setIsSearchLoading] = useState(null)
	const [students, setStudents] = useState([])

	const studentsDebounce = useRef(null)

	useEffect(() => {
		if (!courseId) return

		if (studentsDebounce.current) {
			clearTimeout(studentsDebounce.current)
		}

		studentsDebounce.current = setTimeout(() => {
			fetchStudents(searchStudents)
		}, 500)

		return () => clearTimeout(studentsDebounce.current)
	}, [searchStudents, courseId])

	const fetchStudents = async (term = '') => {
		if (!courseId) return

		const lessonKeys = Object.keys(lessons)

		const lessonKey =
			selectedLesson !== null && selectedLesson !== undefined
				? lessonKeys[selectedLesson]
				: null

		const params = {
			...(term && { term }),

			...(selectedGroup && {
				group_name: groups[selectedGroup],
			}),

			...(lessonKey && {
				module_section_id: lessons[lessonKey],
			}),
			...(selectedFilter && filter[selectedFilter]),
		}

		try {
			const res = await api.get(`${API}/courses/${courseId}/time`, {
				params,
				withCredentials: true,
				headers: {},
			})

			setStudents(res.data)
		} catch (e) {
			console.error('fetchStudents error', e)
		} finally {
			setIsSearchLoading(false)
		}
	}
	useEffect(() => {
		const fetchLinkedGroups = async () => {
			try {
				const res = await api.get(
					`${API}/courses/student-group/linked/?course_id=${courseId}`,
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					},
				)

				setGroups(res.data.items.map(item => item.name))
			} catch (error) {}
		}
		fetchLinkedGroups()
	}, [])
	useEffect(() => {
		const fetchLessons = async () => {
			try {
				const res = await api.get(`${API}/courses/${courseId}/lessons`, {
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				})

				setLessons(res.data)
			} catch (error) {}
		}
		fetchLessons()
	}, [])

	useEffect(() => {
		fetchStudents()
	}, [selectedGroup, selectedFilter, selectedLesson])

	const [isOpen, setIsOpen] = useState(false)

	return (
		<div>
			<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-xl w-full md:min-h-[calc(77.5vh-100px)] overflow-hidden flex flex-col p-2'>
				<p className='text-2xl text-[var(--black)] font-medium my-2 mx-4'>
					Прикрепленные файлы к курсу
				</p>
				<ConstructorFileInput maxFiles={1} />
			</div>
		</div>
	)
}

export default Attachment
