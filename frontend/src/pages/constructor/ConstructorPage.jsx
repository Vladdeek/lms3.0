import {
	BrickWall,
	CalendarClock,
	Gem,
	Settings,
	UsersRound,
	QrCode,
	Blocks,
	Frown,
	CircleCheck,
	Lock,
	LockOpen,
	Timer,
	Paperclip,
} from 'lucide-react'
import { AltRadioButton, Button } from '../../components/Buttons'
import { isValidElement, useEffect, useState } from 'react'
import Constructor from './Constructor'
import AccessManagement from './AccessManagement'
import {
	FileInput,
	InputDefault,
	TextArea,
	Checkbox,
	FileInputDocument,
} from '../../components/Inputs'
import QRCode from '../../components/QrCode'
import { useParams } from 'react-router-dom'
import api, { API, FILE_API } from '../../API'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { is, se } from 'date-fns/locale'
import { Forbidden403, setGlobalError } from '../../components/Errors'
import { getCookie, token } from '../../TOKEN'
import axios from 'axios'
import ActivityStudents from './ActivityStudents'
import { useUnsavedChangesGuard } from '../../context/SaveChangesHook'
import Attachment from './Attachmint'

const SettingsButton = ({
	courseId,
	titleValue,
	descriptionValue,
	imageUrl,
	onChange,
}) => {
	const [isOpen, setIsOpen] = useState(true)
	const navigate = useNavigate()

	const [Title, setTitle] = useState(titleValue || '')
	const [Description, setDescription] = useState(descriptionValue || '')
	const [image, setImage] = useState()

	useEffect(() => {
		imageUrl && setImage(imageUrl)
	}, [imageUrl])

	useEffect(() => {
		if (titleValue !== undefined) {
			setTitle(titleValue)
		}
		if (descriptionValue !== undefined) {
			setDescription(descriptionValue)
		}
	}, [titleValue, descriptionValue])

	async function deleteCourse() {
		try {
			const response = await api.delete(`${API}/courses/delete/${courseId}`, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
				validateStatus: status => status < 500, // чтобы не выбрасывало ошибки на 4xx
			})

			if (response.status === 204) {
				return { success: true, message: 'Секция успешно удалена' }
			}

			navigate(-1)
			return { success: true, data: response.data }
		} catch (error) {
			console.error('Ошибка при удалении модуля:', error)
			return {
				success: false,
				error: error.message,
				moduleId: moduleId,
			}
		}
	}

	const handleSubmit = async (title, description, img) => {
		const formData = new FormData()
		formData.append('name', title)
		formData.append('description', description)
		formData.append('image', img)

		try {
			const res = await api.put(`${API}/courses/${courseId}`, formData, {
				withCredentials: true,
				headers: {},
			})

			onChange?.('good')
		} catch (error) {}
	}

	return (
		<div className='relative'>
			<button
				onClick={() => setIsOpen(prev => !prev)}
				className='rounded-lg h-full flex gap-4 aspect-square justify-center items-center hover:scale-102 transition-all cursor-pointer text-[var(--black)] p-[12px] bg-[var(--white)] shadow-[var(--shadow)]'
			>
				<Settings size={24} />
			</button>
			{!isOpen && (
				<div className='absolute w-[466px] z-15 bg-[var(--white)] rounded-xl shadow-[var(--shadow)] flex flex-col gap-3 p-4 top-14 max-[1366px]:-right-1/2 max-[1366px]:translate-x-1/2 min-[1366px]:-right-0'>
					<p className='font-medium text-xl text-center text-[var(--black)]'>
						Настройки курса
					</p>
					<InputDefault
						placeholder={'Введите название'}
						title={'Название курса'}
						value={Title}
						onChange={e => setTitle(e.target.value)}
					/>
					<TextArea
						placeholder={'Введите описание'}
						title={'Описание курса'}
						value={Description}
						onChange={e => setDescription(e.target.value)}
					/>
					<FileInput
						title={'Загрузить превью'}
						photoUrl={`${FILE_API}${image}`}
						onFileChange={file => setImage(file)}
					/>

					<div className='flex gap-3 w-full'>
						<Button
							title={'Удалить курс'}
							style='outline'
							width={'100%'}
							onClick={deleteCourse}
						/>
						<Button
							title={'Сохранить'}
							style='black'
							width={'100%'}
							onClick={() => handleSubmit(Title, Description, image)}
						/>
					</div>
				</div>
			)}
		</div>
	)
}

const QrCodeButton = ({ url }) => {
	const [isOpen, setIsOpen] = useState(true)
	return (
		<div className='relative'>
			<button
				onClick={() => setIsOpen(prev => !prev)}
				className='rounded-lg h-full flex gap-4 aspect-square justify-center items-center hover:scale-102 transition-all cursor-pointer text-[var(--black)] p-[12px] bg-[var(--white)] shadow-[var(--shadow)]'
			>
				<QrCode size={24} />
			</button>
			{!isOpen && (
				<div className='absolute bg-[var(--white)] rounded-xl shadow-[var(--shadow)] flex flex-col gap-3 p-4 top-14 right-0'>
					<div className='w-50 h-50 flex justify-center items-center shadow-[var(--shadow)] rounded-lg overflow-hidden'>
						{url ? <QRCode size={200} url={url} /> : <QrCode size={32} />}
					</div>
					<p className='text-[var(--middle)] text-sm text-center'>Cсылка</p>
					<input
						className='bg-[var(--bg)] rounded-lg px-2 py-1 outline-none w-full text-[var(--middle)]'
						type='url'
						value={url}
					/>
					<Button title={'Скопировать'} style='black' />
				</div>
			)}
		</div>
	)
}

const DateButton = ({ sectionType, selectedContentId, access, sectionId }) => {
	const [isOpen, setIsOpen] = useState(true)
	const [checked, setChecked] = useState([false, false, false])
	const handleCheckboxChange = idx => {
		const newChecked = [...checked]
		newChecked[idx] = !newChecked[idx]
		setChecked(newChecked)
	}

	const [Locked, setLocked] = useState()

	const fetchIsLocked = async () => {
		if (sectionType === 'lecture') {
			setLocked(null)
			return
		}

		try {
			const res = await api.get(
				`${API}/sections/${selectedContentId}/is-locked`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)

			setGlobalError(null)

			setLocked(res.data?.locked)
		} catch (error) {}
	}

	useEffect(() => {
		if (selectedContentId) fetchIsLocked()
	}, [selectedContentId, sectionType])

	const putLocked = async () => {
		try {
			const res = await api.put(`${API}/sections/${sectionId}/is-locked`, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			})

			fetchIsLocked()
		} catch (error) {}
	}

	const [StartData, setStartData] = useState()
	const [StartTime, setStartTime] = useState()
	const [EndData, setEndData] = useState()
	const [EndTime, setEndTime] = useState()

	const validateStart = StartData && StartTime
	const validateEnd = EndData && EndTime
	const validateAll = validateEnd && validateStart

	return (
		<div className='relative z-10'>
			<button
				disabled={!access && Locked === null}
				onClick={() => putLocked()}
				className={`rounded-lg h-full flex ga}p-4 aspect-square justify-center items-center  transition-all  ${
					access && Locked !== null
						? Locked
							? 'text-[var(--red-status-text)] cursor-pointer hover:scale-102 bg-[var(--white)]'
							: 'text-[var(--green-status-text)] cursor-pointer hover:scale-102 bg-[var(--white)]'
						: 'bg-[var(--light-gray)] text-[var(--middle)] cursor-not-allowed'
				}  p-[12px]  shadow-[var(--shadow)]`}
			>
				{access && Locked !== null ? (
					Locked ? (
						<Lock size={24} />
					) : (
						<LockOpen size={24} />
					)
				) : (
					<Lock size={24} />
				)}
			</button>
			{!isOpen && (
				<div className='absolute bg-[var(--white)] rounded-xl shadow-[var(--shadow)] flex flex-col gap-4 p-4 top-14 right-0  min-w-[320px]'>
					<div className='flex flex-col gap-5'>
						<div className='flex flex-col'>
							<div className='flex items-center gap-3 '>
								<p className='text-[var(--middle)]'>Дата начала</p>
								<CircleCheck
									className={
										!validateStart
											? 'text-[var(--middle)]'
											: 'text-[var(--hero-epta)]'
									}
									size={16}
								/>
							</div>

							<div className='grid grid-cols-7 gap-2'>
								<div className='col-span-5'>
									<InputDefault
										type='date'
										value={StartData}
										onChange={e => setStartData(e.target.value)}
									/>
								</div>
								<div className='col-span-2 text-center'>
									<InputDefault
										type='time'
										value={StartTime}
										onChange={e => setStartTime(e.target.value)}
									/>
								</div>
							</div>
						</div>
						<div className='flex flex-col'>
							<div className='flex items-center gap-3 '>
								<p className='text-[var(--middle)]'>Дата окончания</p>
								<CircleCheck
									className={
										!validateEnd
											? 'text-[var(--middle)]'
											: 'text-[var(--hero-epta)]'
									}
									size={16}
								/>
							</div>
							<div className='grid grid-cols-7 gap-2'>
								<div className='col-span-5'>
									<InputDefault
										type='date'
										value={EndData}
										onChange={e => setEndData(e.target.value)}
									/>
								</div>
								<div className='col-span-2'>
									<InputDefault
										type='time'
										value={EndTime}
										onChange={e => setEndTime(e.target.value)}
									/>
								</div>
							</div>
						</div>

						<button
							onClick={() => setLocked(prev => !prev)}
							disabled={Locked && !validateAll}
							className={`${
								Locked
									? !validateAll
										? 'bg-[var(--light-gray)] text-[var(--middle)] cursor-not-allowed'
										: ' bg-[var(--black)] text-[var(--white)] hover:bg-[var(--green-status-text)] hover:text-[var(--easy-lvl-bg)] cursor-pointer'
									: 'bg-[var(--black)] text-[var(--white)] hover:bg-[var(--hard-lvl-text)] hover:text-[var(--hard-lvl-bg)] cursor-pointer'
							} flex gap-3 justify-center py-2 rounded-xl font-medium  transition-all`}
						>
							{Locked ? (
								<>
									<p>Открыть доступ</p> <LockOpen strokeWidth={2.5} />
								</>
							) : (
								<>
									<p>Закрыть доступ</p> <Lock strokeWidth={2.5} />
								</>
							)}
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

const ConstructorPage = ({ role }) => {
	const options = [
		{ value: 0, title: 'Конструктор', icon: BrickWall },
		{ value: 1, title: 'Управление доступом', icon: UsersRound },
		{ value: 2, title: 'Активность студентов', icon: Timer },
		{ value: 3, title: 'Приложения к курсу', icon: Paperclip },
	]
	const [sectionType, setSectionType] = useState('text')

	const [isEdit, setIsEdit] = useState(false)
	useEffect(() => {
		const media = window.matchMedia('(max-width: 1200px)')

		const handleChange = e => {
			if (e.matches) {
				setIsEdit(false)
			}
		}

		if (media.matches) {
			setIsEdit(false)
		}

		media.addEventListener('change', handleChange)

		return () => media.removeEventListener('change', handleChange)
	}, [])

	const { courseId } = useParams()
	const [courseContent, setCourseContent] = useState()

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const res = await api.get(`${API}/courses/${courseId}`, {
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				})

				setGlobalError(null)
				setCourseContent(res.data)
			} catch (error) {}
		}

		if (courseId) fetchCourses()
	}, [courseId])

	const addModule = newModule =>
		setCourseContent(prev => ({
			...prev,
			modules: [...(prev?.modules || []), newModule],
		}))

	const replaceModule = (tempId, realModule) =>
		setCourseContent(prev => ({
			...prev,
			modules: prev.modules.map(m => (m.id === tempId ? realModule : m)),
		}))

	const removeModule = tempId =>
		setCourseContent(prev => ({
			...prev,
			modules: prev.modules.filter(m => m.id !== tempId),
		}))

	// Уроки
	const addLesson = (moduleId, newLesson) =>
		setCourseContent(prev => ({
			...prev,
			modules: prev.modules.map(m =>
				m.id === moduleId
					? { ...m, module_sections: [...(m.module_sections || []), newLesson] }
					: m,
			),
		}))

	const replaceLesson = (moduleId, tempId, realLesson) =>
		setCourseContent(prev => ({
			...prev,
			modules: prev.modules.map(m =>
				m.id === moduleId
					? {
							...m,
							module_sections: m.module_sections.map(s =>
								s.id === tempId ? realLesson : s,
							),
						}
					: m,
			),
		}))

	const removeLesson = (moduleId, tempId) =>
		setCourseContent(prev => ({
			...prev,
			modules: prev.modules.map(m =>
				m.id === moduleId
					? {
							...m,
							module_sections: m.module_sections.filter(s => s.id !== tempId),
						}
					: m,
			),
		}))

	// удаление с фронта
	const onRemoveModule = moduleId => {
		setCourseContent(prev => ({
			...prev,
			modules: prev.modules.filter(m => m.id !== moduleId),
		}))
	}

	const onRemoveLesson = sectionId => {
		setCourseContent(prev => ({
			...prev,
			modules: prev.modules.map(m => ({
				...m,
				module_sections: m.module_sections.filter(s => s.id !== sectionId),
			})),
		}))
	}

	const [selected, setSelected] = useState(0)
	const [blocks, setBlocks] = useState()
	const [selectedContentId, setSelectedContentId] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [accessedGroups, setAccessedGroups] = useState([])

	const [isLocked, setIsLocked] = useState(null)

	const [showMassage, setShowMassage] = useState(null)

	const showMassageFunc = status => {
		setShowMassage(status)
		const timer = setTimeout(() => {
			setShowMassage(null)
		}, 5000)

		return () => clearTimeout(timer)
	}

	useEffect(() => {
		if (!blocks) return

		const timer = setTimeout(() => {
			try {
				const { data } = api.put(
					`${API}/sections/${selectedContentId}/content`,
					blocks,
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					},
				)
			} catch (error) {}
		}, 10000)

		return () => clearTimeout(timer)
	}, [blocks])

	const handleSubmit = async (e, content, sectionId) => {
		if (e?.preventDefault) e.preventDefault()

		try {
			const { data } = await api.put(
				`${API}/sections/${sectionId}/content`,
				content,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)

			setIsEdit(prev => !prev)
			showMassageFunc('good')
		} catch (error) {
			setIsLoading(false)
		}
	}

	const handleStatus = async () => {
		if (isEdit === true) {
			showMassageFunc('plzsave')
			return
		} else {
			try {
				const formData = new FormData()
				formData.append('course_status', 'pending')

				const { data } = await api.put(`${API}/courses/${courseId}`, formData, {
					withCredentials: true,
					headers: {},
				})

				showMassageFunc('public')
			} catch (error) {}
		}
	}

	const tryChangeContent = id => {
		if (isEdit === true) {
			showMassageFunc('plzsave')
			return
		} else {
			setSelectedContentId(id)
		}
	}

	useUnsavedChangesGuard(isEdit)

	const selectedFunc = value => {
		if (isEdit === false) {
			setSelected(value)
		} else {
			showMassageFunc('plzsave')
		}
	}

	return role === 'student' ? (
		<>
			<Forbidden403 />
		</>
	) : (
		<div className='relative'>
			<p
				className={`absolute transition-all ${showMassage === 'plzsave' ? 'bg-[var(--red-status-bg)] text-[var(--red-status-text)]' : 'bg-[var(--green-status-bg)] text-[var(--green-status-text)]'}   px-6 py-2 rounded-lg shadow-[var(--shadow)] left-1/2 -translate-x-1/2 text-2xl ${
					showMassage ? 'top-5 opacity-100' : '-top-25 opacity-50'
				} `}
			>
				{showMassage === 'public'
					? 'Отправлено на рассмотрение'
					: showMassage === 'good'
						? 'Изменения сохранены'
						: showMassage === 'plzsave' && 'Сначала сохраните изменения'}
			</p>

			<div className='flex flex-col gap-5 min-h-[calc(100vh-100px)] max-md:mb-65 mb-45'>
				<div className='flex justify-center w-full mt-10'>
					<div className='flex  max-[1366px]:order-1  max-[1366px]:w-[435px] max-[1366px]:justify-center bg-[var(--white)] rounded-xl shadow-[var(--shadow)] px-4 py-2 gap-3'>
						<Gem size={32} color='var(--hero-epta)' strokeWidth={1.5} />

						<p className='font-medium text-2xl text-[var(--black)]'>
							{courseContent?.name}
						</p>
					</div>
				</div>

				<div className='flex max-[1366px]:flex-col max-[1366px]:w-full max-[1366px]:gap-2 justify-between items-center'>
					<div className='min-md:flex max-md:grid grid-cols-2  gap-5  max-[1366px]:gap-2 max-[1366px]:order-2 items-center '>
						{options.map((option, index) => (
							<AltRadioButton
								key={option.value}
								name='example'
								value={option.value}
								title={option.title}
								icon={option.icon}
								checked={selected === option.value}
								onChange={() => selectedFunc(option.value)}
								width={'200px'}
							/>
						))}
					</div>

					<div className='flex gap-5 max-[1200px]:hidden  max-[1366px]:gap-2  max-[1366px]:order-3 items-center'>
						{selected === 1 ? (
							<QrCodeButton
								url={'https://www.npmjs.com/package/qr-code-styling'}
							/>
						) : (
							<DateButton
								access={selectedContentId && sectionType !== 'lecture'}
								locked={isLocked}
								sectionId={selectedContentId}
								sectionType={sectionType}
								selectedContentId={selectedContentId}
							/>
						)}

						<SettingsButton
							courseId={courseId}
							titleValue={courseContent?.name}
							descriptionValue={courseContent?.description}
							imageUrl={courseContent?.image_path}
							onChange={showMassageFunc}
						/>
						{selectedContentId !== null && (
							<>
								{sectionType === 'test' ? (
									<Button
										title={!isEdit ? 'Редактировать' : 'Редактирование'}
										style={!isEdit ? 'outline' : 'hero'}
										type='button'
										onClick={() => setIsEdit(prev => !prev)}
									/>
								) : (
									<>
										{isEdit ? (
											<Button
												title='Сохранить'
												style='outline'
												type='button'
												onClick={e =>
													handleSubmit(
														e,
														blocks,
														selectedContentId,
														accessedGroups,
													)
												}
											/>
										) : (
											<Button
												title='Редактировать'
												style='outline'
												type='button'
												onClick={() => setIsEdit(prev => !prev)}
											/>
										)}
									</>
								)}
							</>
						)}

						{courseContent?.course_status === 'pending' ? (
							<p className='bg-[var(--middle)] text-[var(--light-gray)] font-medium py-3 px-5  rounded-lg'>
								На рассмотрении
							</p>
						) : courseContent?.course_status === 'approved' ? (
							<p className='bg-[var(--green-status-text)] text-[var(--green-status-bg)] font-medium py-3 px-5  rounded-lg'>
								Опубликован
							</p>
						) : (
							<Button
								title={'Опубликовать курс'}
								style='black'
								className='truncate text-ellipsis'
								onClick={() => handleStatus()}
							/>
						)}
					</div>
				</div>
				{selected === 0 ? (
					<Constructor
						content={courseContent}
						onAddModule={addModule}
						onReplaceModule={replaceModule}
						onRemoveModule={removeModule}
						onAddLesson={addLesson}
						onReplaceLesson={replaceLesson}
						onRemoveLesson={removeLesson}
						courseId={courseId}
						deleteModule={onRemoveModule}
						deleteSection={onRemoveLesson}
						onBlocksChange={setBlocks}
						onSelectedContentChange={data => tryChangeContent(data)}
						isLoading={isLoading}
						onSectionTypeChange={setSectionType}
						isEdit={isEdit}
					/>
				) : selected === 1 ? (
					<AccessManagement onChange={setAccessedGroups} />
				) : selected === 2 ? (
					<ActivityStudents onChange={setAccessedGroups} />
				) : (
					selected === 3 && <Attachment onChange={setAccessedGroups} />
				)}
			</div>
		</div>
	)
}
export default ConstructorPage
