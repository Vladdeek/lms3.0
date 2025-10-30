import { useEffect, useReducer, useState } from 'react'
import { Button, FilterButton, RadioButton } from '../components/Buttons'
import {
	Blocks,
	CalendarDays,
	CircleCheck,
	CircleQuestionMark,
	FunnelPlus,
	LayoutGrid,
	Radio,
	X,
	History,
} from 'lucide-react'
import { CourseCard, WebinarCard } from '../components/Cards'
import {
	FileInput,
	InputDefault,
	SearchInput,
	TextArea,
} from '../components/Inputs'
import { API, FILE_API } from '../API'
import { motion } from 'framer-motion'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Forbidden403, useError } from '../components/Errors'
import axios from 'axios'

const CreateBtn = ({ onClick, title, width = 'w-2/3', height = 'h-129' }) => {
	return (
		<button
			onClick={onClick}
			className={`flex flex-col ${width} max-md:w-full items-center justify-center border-1 border-[var(--middle)] text-[var(--middle)] rounded-xl group hover:border-[var(--hero-epta)] hover:text-[var(--hero-epta)] transition-all cursor-pointer max-md:h-75 max-md:mb-30 ${height}`}
		>
			<Blocks size={112} strokeWidth={0.5} />
			<span className='text-base font-medium px-4 py-3 rounded-lg mt-4 transition-all'>
				{title}
			</span>
		</button>
	)
}

const CreateModal = ({ isOpen, onClose, onCreate, teacher_profile_id }) => {
	if (!isOpen) return null

	const [isNameValid, setIsNameValid] = useState(false)
	const [isFileValid, setIsFileValid] = useState(false)
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [img, setImg] = useState(null)

	const [hintOpen, setHintOpen] = useState(null)

	const isFormValid = isNameValid

	const handleSubmit = async e => {
		const token = localStorage.getItem('access_token')
		e.preventDefault()

		if (!isFormValid) return

		try {
			const formData = new FormData()
			formData.append('name', title)
			formData.append('description', description)
			formData.append('teacher_profile_id', teacher_profile_id)
			if (img !== null) formData.append('image', img)

			const res = await axios.post(`${API}/courses`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			onCreate(res.data)
			onClose()
			setTitle('')
			setDescription('')
			setImg(null)
		} catch (error) {
			if (error.response) {
				console.error(
					'Ошибка сервера:',
					error.response.status,
					error.response.data
				)
			} else {
				console.error('Ошибка сети:', error.message)
			}
		}
	}

	return (
		<div className='fixed inset-0 flex items-center justify-center backdrop-blur-xs z-1000'>
			<div className='bg-[var(--white)] relative p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.125)] z-1001'>
				<X
					onClick={onClose}
					className='absolute top-1 right-1 text-[var(--middle)]'
				/>
				<h2 className='text-2xl font-medium text-[var(--black)] mb-5 text-center'>
					Создание курса
				</h2>
				<form
					onSubmit={handleSubmit}
					className='w-[482px] inline-flex flex-col items-center gap-5'
				>
					<InputDefault
						type='text'
						placeholder=''
						title='Введите название курса'
						required={true}
						InputStatus={false}
						onStatusChange={setIsNameValid}
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>

					<TextArea
						type='text'
						placeholder=''
						title='Введите описание'
						value={description}
						onChange={e => setDescription(e.target.value)}
						InputStatus={false}
					/>
					<div className='flex flex-col gap-3'>
						<div className='inline-flex items-center gap-[10px]'>
							<p className={`text-[18px] text-[var(--middle)]`}>
								Загрузите превью
							</p>
							<div className='relative'>
								<CircleQuestionMark
									onClick={() =>
										setHintOpen(prev => (prev === null ? 1 : null))
									}
									className='text-blue-500  cursor-pointer'
									size={16}
								/>
								<div
									className={`${
										hintOpen === 1
											? 'opacity-100 scale-100'
											: 'opacity-0 scale-0 -translate-x-1/2'
									} transition-all select-none cursor-default bg-[var(--white)] shadow-[var(--shadow)] absolute -top-12.5 left-7 h-auto w-75 px-3 py-2 rounded-lg`}
								>
									<p>
										При отсутствии загруженного изображения система
										автоматически сгенерирует превью.
									</p>
								</div>
							</div>
						</div>
						<FileInput onFileChange={file => setImg(file)} />
					</div>

					<input
						className={`px-[51px] py-[14.5px] font-medium text-xl rounded-lg w-fit  transition ${
							isFormValid
								? 'bg-[var(--black)] text-[var(--white)] cursor-pointer'
								: 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed'
						}`}
						type='submit'
						value='Создать курс'
						disabled={!isFormValid}
					/>
				</form>
			</div>
		</div>
	)
}

const CreateWebinar = ({ isOpen, onClose, onCreate }) => {
	if (!isOpen) return null

	const [isNameValid, setIsNameValid] = useState(false)
	const [isDateValid, setIsDateValid] = useState(false)
	const [isSTimeValid, setIsSTimeValid] = useState(false)
	const [isETimeValid, setIsETimeValid] = useState(false)
	const [isUrlValid, setIsUrlValid] = useState(false)
	const [title, setTitle] = useState('')
	const [url, setUrl] = useState('')
	const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

	const [stime, setSTime] = useState()
	const [etime, setETime] = useState()
	const [img, setImg] = useState(null)
	const [hintOpen, setHintOpen] = useState(null)

	const isStartDTValid = isDateValid && isSTimeValid

	const isFormValid = isNameValid && isUrlValid && isStartDTValid

	const handleSubmit = async e => {
		e.preventDefault()
		if (!isFormValid) return

		const formData = new FormData()
		formData.append('name', title)
		formData.append('link_url', url)
		formData.append(
			'start_date',
			new Date(`${date}T${stime}:00Z`).toISOString().slice(0, 19) + 'Z'
		)

		const enddate = new Date(`${date}T${etime ? etime : stime}:00Z`)
		if (!etime) enddate.setHours(enddate.getHours() + 1)
		formData.append('end_date', enddate.toISOString().slice(0, 19) + 'Z')

		formData.append(
			'teacher_profile_id',
			'27f1ca7d-70b5-43b3-b310-ffd251670d62'
		)
		img !== null && formData.append('image', img)

		const res = await fetch(`${API}/webinar`, {
			method: 'POST',
			body: formData,
		})

		if (!res.ok) {
			console.error('Ошибка сервера:', res.status)
			return
		}

		const data = await res.json()

		onCreate(data)
		onClose()
		setTitle('')
		setUrl('')
		setDate('')
		setSTime('')
		setETime('')
		setImg(null)
	}

	return (
		<div className='fixed inset-0 flex items-center justify-center backdrop-blur-xs z-1000'>
			<div className='bg-[var(--white)] relative p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.125)] z-1001'>
				<X
					onClick={onClose}
					className='absolute top-1 right-1 text-[var(--middle)]'
				/>
				<h2 className='text-2xl font-medium text-[var(--black)] mb-5 text-center'>
					Создание вебинара
				</h2>
				<form
					onSubmit={handleSubmit}
					className='w-[482px] inline-flex flex-col items-center gap-5'
				>
					<InputDefault
						type='text'
						placeholder='Название вебинара'
						title='Введите название вебинара'
						required={true}
						InputStatus={false}
						onStatusChange={setIsNameValid}
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
					<InputDefault
						type='text'
						placeholder='https://example.ru/...'
						title='Введите ссылку на вебинара'
						required={true}
						InputStatus={false}
						onStatusChange={setIsUrlValid}
						value={url}
						onChange={e => setUrl(e.target.value)}
					/>
					<InputDefault
						type='date'
						placeholder=''
						title={'Введите дату проведения вэбинара'}
						required={true}
						InputStatus={false}
						onStatusChange={setIsDateValid}
						value={date}
						onChange={e => setDate(e.target.value)}
					/>
					<div className='flex flex-col w-full'>
						<div className='flex gap-3 items-center w-full'>
							<InputDefault
								type='time'
								placeholder=''
								title={'Время начала'}
								required={true}
								InputStatus={false}
								onStatusChange={setIsSTimeValid}
								value={stime}
								onChange={e => setSTime(e.target.value)}
							/>
							<div className='flex w-full flex-col'>
								<div className='inline-flex items-center gap-2'>
									<p className={`text-[18px] text-[var(--middle)]`}>
										Время окончания
									</p>
									<div className='relative'>
										<CircleQuestionMark
											onClick={() =>
												setHintOpen(prev => (prev === null ? 0 : null))
											}
											className='text-blue-500 ml-1 cursor-pointer'
											size={16}
										/>
										<div
											className={`${
												hintOpen === 0
													? 'opacity-100 scale-100'
													: 'opacity-0 scale-0 -translate-x-1/2'
											} transition-all select-none cursor-default bg-[var(--white)] shadow-[var(--shadow)] absolute -top-12.5 left-7 h-auto w-75 px-3 py-2 rounded-lg`}
										>
											<p>
												При отсутствии указанной даты окончания система
												автоматически устанавливает её на час позже времени
												начала.
											</p>
										</div>
									</div>
								</div>

								<InputDefault
									type='time'
									placeholder=''
									InputStatus={false}
									value={etime}
									onChange={e => setETime(e.target.value)}
								/>
							</div>
						</div>
					</div>

					<div className='flex flex-col gap-3'>
						<div className='inline-flex items-center gap-[10px]'>
							<p className={`text-[18px] text-[var(--middle)]`}>
								Загрузите превью
							</p>
							<div className='relative'>
								<CircleQuestionMark
									onClick={() =>
										setHintOpen(prev => (prev === null ? 1 : null))
									}
									className='text-blue-500 ml-1 cursor-pointer'
									size={16}
								/>
								<div
									className={`${
										hintOpen === 1
											? 'opacity-100 scale-100'
											: 'opacity-0 scale-0 -translate-x-1/2'
									} transition-all select-none cursor-default bg-[var(--white)] shadow-[var(--shadow)] absolute -top-12.5 left-7 h-auto w-75 px-3 py-2 rounded-lg`}
								>
									<p>
										При отсутствии загруженного изображения система
										автоматически сгенерирует превью.
									</p>
								</div>
							</div>
						</div>
						<FileInput onFileChange={file => setImg(file)} />
					</div>

					<input
						className={`px-[51px] py-[14.5px] font-medium text-xl rounded-lg w-fit  transition ${
							isFormValid
								? 'bg-[var(--black)] text-[var(--white)] cursor-pointer'
								: 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed'
						}`}
						type='submit'
						value='Создать вебинар'
						disabled={!isFormValid}
					/>
				</form>
			</div>
		</div>
	)
}

const Catalog = ({ role, teacher_profile_id }) => {
	const [selected, setSelected] = useState(0)
	const [selectedFilters, setSelectedFilters] = useState('all')
	const options = [
		{ value: 0, to: 'courses', title: 'Добавленные курсы', icon: LayoutGrid },
		{ value: 1, to: 'webinars', title: 'Вебинар', icon: Radio },
	]
	const filter = [
		{ value: 'all', title: 'Все', icon: LayoutGrid },
		{ value: 'pending', title: 'Предстоящие', icon: CalendarDays },
		{ value: 'closed', title: 'Прошедшие', icon: History },
	]

	const location = useLocation()
	const navigate = useNavigate()

	const NavigateTo = (to, value) => {
		setSelected(value)
		navigate(to)
	}

	useEffect(() => {
		if (location.pathname === '/catalogt') {
			NavigateTo(options[0].to, options[0].value)
		}

		if (location.pathname === '/catalogt/courses') {
			setSelected(options[0].value)
		} else if (location.pathname === '/catalogt/webinars') {
			setSelected(options[1].value)
		}
	}, [location.pathname])

	const [createModalOpen, setCreateModalOpen] = useState(false)
	const [createWebinarOpen, setCreateWebinarOpen] = useState(false)
	const [courses, setCourses] = useState([])
	const [webinars, setWebinars] = useState([])

	const [image, setImage] = useState([])

	const { setError } = useError()

	const handleCreateCourse = () => {
		fetchCourses()
	}
	const handleCreateWebinar = () => {
		fetchWebinars()
	}

	const fetchCourses = async () => {
		const token = localStorage.getItem('access_token')
		try {
			const res = await axios.get(`${API}/courses/`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})

			setError(null)
			setCourses(res.data)
		} catch (err) {
			console.log(err)
			if (err.response) {
				console.log('error: ', err.response.status)
				setError(err.response.status.toString())
			} else {
				setError('500')
			}
		}
	}

	const fetchAllCourses = async () => {
		const token = localStorage.getItem('access_token')
		try {
			const res = await axios.get(`${API}/courses/all`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})

			setError(null)

			setCourses(res.data)
		} catch (err) {
			console.log(err)
			if (err.response) {
				console.log('error: ', err.response.status)
				setError(err.response.status.toString())
			} else {
				setError('500')
			}
		}
	}

	const fetchWebinars = async () => {
		const token = localStorage.getItem('access_token')
		try {
			const res = await axios.get(
				`${API}/webinar${
					selectedFilters !== 'all' ? `/?webinar_status=${selectedFilters}` : ''
				}`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				}
			)

			setError(null)
			setWebinars(res.data)
		} catch (err) {
			console.log(err)
			if (err.response) {
				console.log('error: ', err.response.status)
				setError(err.response.status.toString())
			} else {
				setError('500')
			}
		}
	}

	useEffect(() => {
		fetchWebinars()
	}, [selectedFilters])

	useEffect(() => {
		location.pathname === '/catalogt/courses'
			? fetchCourses()
			: location.pathname === '/catalogt/webinars'
			? fetchWebinars()
			: location.pathname === '/catalog/all' && fetchAllCourses()
	}, [location.pathname])

	useEffect(() => {
		role === 'student' && navigate('/catalogs/courses')
	}, [role])

	return (
		<>
			<CreateModal
				isOpen={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
				onCreate={handleCreateCourse}
				teacher_profile_id={teacher_profile_id}
			/>
			<CreateWebinar
				isOpen={createWebinarOpen}
				onClose={() => setCreateWebinarOpen(false)}
				onCreate={handleCreateWebinar}
			/>
			<div
				className={`${
					courses?.length === 0 || courses?.length < 4 ? 'h-screen' : 'h-full'
				} flex flex-col gap-4 py-[50px]`}
			>
				<div className='flex max-[874px]:gap-3 max-[874px]:flex-col-reverse justify-between'>
					<div className='flex gap-4 max-lg:gap-2 h-12'>
						{location.pathname !== '/catalog/all' &&
							options?.map(option => (
								<RadioButton
									key={option.value}
									name='example'
									value={option.value}
									title={option.title}
									icon={option.icon}
									checked={selected === option.value}
									onChange={() => NavigateTo(option.to, option.value)}
								/>
							))}
					</div>

					<div className='flex gap-4 max-lg:gap-2 h-12'>
						<SearchInput />
						{/* <FilterButton
							option={[
								'по статусу',
								'по алфавиту',
								'по дате создания',
								'по хуйне ',
							]}
						/> */}
					</div>
				</div>
				{location.pathname === '/catalogt/webinars' && (
					<div className='flex gap-4 max-lg:gap-2 h-12'>
						{filter?.map(option => (
							<RadioButton
								key={option.value}
								name='filters'
								value={option.value}
								title={option.title}
								icon={option.icon}
								checked={selectedFilters === option.value}
								onChange={() => setSelectedFilters(option.value)}
							/>
						))}
					</div>
				)}

				{location.pathname === '/catalogt/courses' ||
				location.pathname === '/catalog/all' ? (
					<div
						className={`${
							courses?.length === 0 || courses?.length < 4
								? 'h-screen'
								: 'h-full'
						} flex flex-col gap-4 py-[50px]`}
					>
						<div className='grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 gap-4'>
							{courses?.map((course, index) => (
								<motion.div
									key={course.id}
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{
										duration: 0.3,
										delay: index * 0.1,
										ease: 'easeOut',
									}}
								>
									<CourseCard
										title={course.name}
										description={course.description}
										img_path={`${FILE_API}${course.image_url}`}
										status={course.status}
										deadline={course.deadline}
										to={
											location.pathname === '/catalog/all'
												? `/constructor/${course.id}`
												: `/constructor/${course.id}`
										}
									/>
								</motion.div>
							))}

							{location.pathname === '/catalogt/courses' && (
								<motion.div
									key={courses.length + 1}
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{
										duration: 0.3,
										delay: courses.length * 0.1,
										ease: 'easeOut',
									}}
								>
									<CreateBtn
										onClick={() => setCreateModalOpen(true)}
										title='Создать новый курс'
										icon={LayoutGrid}
									/>
								</motion.div>
							)}
						</div>
					</div>
				) : (
					location.pathname === '/catalogt/webinars' && (
						<div
							className={`${
								webinars?.length === 0 || webinars?.length < 5
									? 'h-screen'
									: 'h-full'
							} flex flex-col gap-4 py-[50px]`}
						>
							<div className='grid 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4'>
								{webinars?.map((web, index) => (
									<motion.div
										key={web.id}
										initial={{ scale: 0.8, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										transition={{
											duration: 0.3,
											delay: index * 0.1,
											ease: 'easeOut',
										}}
									>
										<WebinarCard
											title={web.name}
											description={web.description}
											img_path={`${FILE_API}${web.image_url}`}
											start={web.start_date}
											end={web.end_date}
											to={web.link_url}
										/>
									</motion.div>
								))}

								{location.pathname === '/catalogt/webinars' && (
									<motion.div
										key={webinars.length + 1}
										initial={{ scale: 0.8, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										transition={{
											duration: 0.3,
											delay: webinars.length * 0.1,
											ease: 'easeOut',
										}}
									>
										<CreateBtn
											onClick={() => setCreateWebinarOpen(true)}
											title='Добавить вебинар'
											icon={LayoutGrid}
											width='w-full'
											height='aspect-9/16'
										/>
									</motion.div>
								)}
							</div>
						</div>
					)
				)}
			</div>
		</>
	)
}

export default Catalog
