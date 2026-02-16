import { ImagePlus, Upload, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import api, { API, FILE_API } from '../../API'
import { getCookie } from '../../TOKEN'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Loading } from '../Loader'

export const PhotoInput = ({ onStatusChange, DelComponent, onChange, url }) => {
	const inputId = useId()
	const [inputStatus, setInputStatus] = useState(false)
	const [fileInfo, setFileInfo] = useState(null)
	const [isDragActive, setIsDragActive] = useState(false)
	const [photoUrl, setPhotoUrl] = useState(url ? [{ photoUrl: `${url}` }] : [])

	const handleFileChange = e => {
		const files = e.target.files
		uploadFileToAPI(files[0])
	}

	useEffect(() => {
		const data = { info: photoUrl[0]?.photoUrl, type: 'photo' }
		onChange?.(data)
	}, [photoUrl])

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

			setPhotoUrl(prevUrls => [
				...prevUrls,
				{
					photoUrl: fileUrl,
				},
			])
		} catch (error) {}
	}

	const removePreview = index => {
		setPhotoUrl(prev => prev.filter((_, i) => i !== index))
		if (photoUrl?.length === 1) {
			setInputStatus(false)
			onStatusChange?.(false)
			removeFile(photoUrl[index]?.photoUrl)
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

		if (e.currentTarget.contains(e.relatedTarget)) return
		setIsDragActive(false)
	}

	const handleDrop = e => {
		e.preventDefault()
		setIsDragActive(false)
		const files = e.dataTransfer.files
		uploadFileToAPI(files[0])
	}

	return (
		<div className='flex gap-2 w-full'>
			<div className='grid grid-cols-1 w-full gap-3'>
				{photoUrl?.map((image, index) => (
					<div
						key={index}
						className='relative col-span-1 flex justify-center aspect-16/9'
					>
						<img
							src={image.photoUrl}
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

				{photoUrl?.length === 0 && (
					<div
						className={`p-2 flex col-span-1 aspect-16/9  ${
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
											Загрузить фото
										</button>
									</div>
								)}
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
