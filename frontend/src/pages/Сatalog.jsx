import { useEffect, useReducer, useState } from 'react'
import { Button, FilterButton, RadioButton } from '../components/Buttons'
import { Blocks, FunnelPlus, LayoutGrid, Radio, X } from 'lucide-react'
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

const CreateBtn = ({ onClick, title, width = 'w-2/3' }) => {
	return (
		<button
			onClick={onClick}
			className={`flex flex-col ${width} max-md:w-full items-center justify-center border-1 border-[var(--middle)] text-[var(--middle)] rounded-xl group hover:border-[var(--hero-epta)] hover:text-[var(--hero-epta)] transition-all cursor-pointer max-md:h-75 max-md:mb-30 h-129`}
		>
			<Blocks size={112} strokeWidth={0.5} />
			<span className='text-base font-medium px-4 py-3 rounded-lg mt-4 transition-all'>
				{title}
			</span>
		</button>
	)
}

const CreateModal = ({ isOpen, onClose, onCreate }) => {
	if (!isOpen) return null

	const [isNameValid, setIsNameValid] = useState(false)
	const [isFileValid, setIsFileValid] = useState(false)
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [img, setImg] = useState(null)

	const isFormValid = isNameValid && isFileValid

	const handleSubmit = async e => {
		e.preventDefault()
		if (!isFormValid) return

		const formData = new FormData()
		formData.append('name', title)
		formData.append('description', description)
		formData.append(
			'teacher_profile_id',
			'27f1ca7d-70b5-43b3-b310-ffd251670d62'
		)
		formData.append('image', img)

		console.log(formData)

		const res = await fetch(`${API}/courses`, {
			method: 'POST',
			body: formData,
		})

		if (!res.ok) {
			console.error('Ошибка сервера:', res.status)
			return
		}

		const data = await res.json()
		console.log('Ответ сервера:', data)

		onCreate(data)
		onClose()
		setTitle('')
		setDescription('')
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
					<FileInput
						title='Загрузите превью'
						required={true}
						onStatusChange={setIsFileValid}
						onFileChange={file => setImg(file)}
					/>
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
	const [isTimeValid, setIsTimeValid] = useState(false)
	const [isUrlValid, setIsUrlValid] = useState(false)
	const [title, setTitle] = useState('')
	const [url, setUrl] = useState('')
	const [date, setDate] = useState()
	const [time, setTime] = useState()
	const [img, setImg] = useState(null)

	console.log(date, time)

	const isFormValid = isNameValid && isDateValid && isUrlValid && isTimeValid

	const handleSubmit = async e => {
		e.preventDefault()
		if (!isFormValid) return

		const formData = new FormData()
		formData.append('name', title)
		formData.append('link_url', url)
		formData.append(
			'due_date',
			new Date(`${date}T${time}:00Z`).toISOString().slice(0, 19) + 'Z'
		)

		formData.append(
			'teacher_profile_id',
			'27f1ca7d-70b5-43b3-b310-ffd251670d62'
		)
		formData.append('image', img)

		console.log(formData)

		const res = await fetch(`${API}/webinar`, {
			method: 'POST',
			body: formData,
		})

		if (!res.ok) {
			console.error('Ошибка сервера:', res.status)
			return
		}

		const data = await res.json()
		console.log('Ответ сервера:', data)

		onCreate(data)
		onClose()
		setTitle('')
		setUrl('')
		setDate('')
		setTime('')
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
					<div className='flex gap-3 items-center w-full'>
						<InputDefault
							type='date'
							placeholder=''
							title='Выберите дату'
							required={true}
							InputStatus={false}
							onStatusChange={setIsDateValid}
							value={date}
							onChange={e => setDate(e.target.value)}
						/>
						<InputDefault
							type='time'
							placeholder=''
							title='Выберите время'
							required={true}
							InputStatus={false}
							onStatusChange={setIsTimeValid}
							value={time}
							onChange={e => setTime(e.target.value)}
						/>
					</div>

					<FileInput
						title='Загрузите превью (не обязательно)'
						onFileChange={file => setImg(file)}
					/>

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

const Catalog = ({ role }) => {
	const [selected, setSelected] = useState(0)
	const options = [
		{ value: 0, to: 'courses', title: 'Добавленные курсы', icon: LayoutGrid },
		{ value: 1, to: 'webinars', title: 'Вебинар', icon: Radio },
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

	const handleCreateCourse = newCourse => {
		setCourses(prev => [...prev, newCourse])
	}
	const handleCreateWebinar = newCourse => {
		setCourses(prev => [...prev, newCourse])
	}

	useEffect(() => {
		const fetchCourses = async () => {
			const res = await fetch(`${API}/courses/`)
			const data = await res.json()
			console.log('Список курсов:', data)
			setCourses(data || [])
		}
		const fetchWebinars = async () => {
			const res = await fetch(`${API}/webinar/`)
			const data = await res.json()
			console.log('Список вебинаров:', data)
			setWebinars(data.detail === 'Not Found' ? [] : data)
		}
		location.pathname === '/catalogt/courses'
			? fetchCourses()
			: location.pathname === '/catalogt/webinars' && fetchWebinars()
	}, [location.pathname])

	return role !== 'student' ? (
		<Navigate to='/catalogs' replace />
	) : (
		<>
			<CreateModal
				isOpen={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
				onCreate={handleCreateCourse}
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
						{options.map(option => (
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
						<FilterButton
							option={[
								'по статусу',
								'по алфавиту',
								'по дате создания',
								'по хуйне ',
							]}
						/>
					</div>
				</div>
				{location.pathname === '/catalogt/courses' ? (
					<div className='grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 gap-4'>
						{courses.map((course, index) => (
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
									img_path={`${API}/courses/image/${course.id}`}
									status={course.status}
									deadline={course.deadline}
									to={`/constructor/${course.id}`}
								/>
							</motion.div>
						))}

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
					</div>
				) : (
					location.pathname === '/catalogt/webinars' && (
						<div className='grid 2xl:grid-cols-6 xl:grid-cols-5 md:grid-cols-4 gap-4'>
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
										deadline={web.due_date}
										to={web.link_url}
									/>
								</motion.div>
							))}

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
								/>
							</motion.div>
						</div>
					)
				)}
			</div>
		</>
	)
}

export default Catalog
