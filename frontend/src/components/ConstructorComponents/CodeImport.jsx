import { FileCode2, Upload, X } from 'lucide-react'
import { useId, useState } from 'react'

import CustomCodeBlock from '../CustomCodeBlock'

export const CodeFileInput = ({
	onStatusChange,
	onFileChange,
	DelComponent,
}) => {
	const inputId = useId()
	const [inputStatus, setInputStatus] = useState(false)
	const [file, setFile] = useState(null)
	const [isDragActive, setIsDragActive] = useState(false)
	const [codeInfo, setCodeInfo] = useState(null)
	const maxSize = 10 * 1024 * 1024 // 10 MB

	const getLanguageFromExtension = filename => {
		const extension = filename.split('.').pop().toLowerCase()

		const languageMap = {
			js: 'javascript',
			jsx: 'jsx',
			ts: 'typescript',
			tsx: 'tsx',
			py: 'python',
			java: 'java',
			cpp: 'cpp',
			c: 'c',
			cs: 'csharp',
			php: 'php',
			rb: 'ruby',
			go: 'go',
			rs: 'rust',
			html: 'html',
			css: 'css',
			scss: 'scss',
			sass: 'sass',
			less: 'less',
			json: 'json',
			xml: 'xml',
			sql: 'sql',
			md: 'markdown',
			yml: 'yaml',
			yaml: 'yaml',
			sh: 'shell',
			bat: 'batch',
			ps1: 'powershell',
		}

		return languageMap[extension] || extension
	}

	const handleFileChange = e => {
		const newFile = e.target.files[0]
		validateFile(newFile)
	}

	const validateFile = newFile => {
		if (!newFile) return
		const isValidSize = newFile.size <= maxSize
		if (!isValidSize) {
			alert(`Файл ${newFile.name} превышает максимальный размер 10MB`)
			return
		}

		readFile(newFile)
		setFile(newFile)

		const newStatus = true
		setInputStatus(newStatus)
		onStatusChange?.(newStatus)
		onFileChange?.(newFile)
	}

	const readFile = newFile => {
		const reader = new FileReader()
		reader.onload = e => {
			const text = e.target.result
			setCodeInfo([
				{
					code: text,
					language: getLanguageFromExtension(newFile.name),
				},
			])
		}
		reader.readAsText(newFile)
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
		setCodeInfo(null)
		const newStatus = false
		setInputStatus(newStatus)
		onStatusChange?.(newStatus)
		onFileChange?.(null)
	}

	return (
		<>
			<div className='flex gap-2'>
				<button
					className='self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
					onClick={DelComponent}
				>
					<X />
				</button>
				{codeInfo ? (
					<CustomCodeBlock
						editMode={true}
						width='w-full'
						codeInfo={codeInfo[0]}
						onClick={removeFile}
					/>
				) : (
					// Зона загрузки
					<div
						className={`p-2 ${
							isDragActive ? 'bg-[var(--hero-pale)]' : 'bg-[var(--light-gray)]'
						} rounded-lg transition-all w-full`}
					>
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
								<FileCode2
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
									до 10 МБ, только файлы кода
								</p>

								<button
									className='bg-[var(--black)] text-[var(--white)] rounded-lg flex gap-3 px-4 py-3 font-bold hover:bg-[var(--hero-epta)] cursor-pointer transition-all'
									onClick={() => document.getElementById(inputId).click()}
									type='button'
								>
									<Upload strokeWidth={3} />
									Загрузить код
								</button>
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
		</>
	)
}
