import { use, useEffect, useMemo, useReducer, useState } from 'react'
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
	Filter,
	HistoryIcon,
} from 'lucide-react'
import { CourseCard, WebinarCard } from '../components/Cards'
import {
	FileInput,
	InputDefault,
	OptionInput,
	OptionInput2,
	OptionSearch,
	SearchInput,
	TextArea,
} from '../components/Inputs'
import api, { API, FILE_API } from '../API'
import { motion } from 'framer-motion'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import axios from 'axios'
import { getCookie, token } from '../TOKEN'
import { setGlobalError } from '../components/Errors'
import { se } from 'date-fns/locale'
import { LinkBTN } from '../components/Links'

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

	const [selected, setSelected] = useState(0)

	const [selectedFilters, setSelectedFilters] = useState('all')
	const options = [
		{ value: 0, title: 'Свободное' },
		{ value: 1, title: 'По нагрузке' },
	]

	const isForm1Valid = isNameValid

	const [year, setYear] = useState([])
	const [selectedYear, setSelectedYear] = useState(null)
	const [semester, setSemester] = useState(['1', '2'])
	const semesters = [
		{ value: '1', title: '1-й Семестр' },
		{ value: '2', title: '2-й Семестр' },
	]
	const [selectedSemester, setSelectedSemester] = useState(null)
	const [disciplines, setDisciplines] = useState([])
	const [selectedDisciplines, setSelectedDisciplines] = useState(null)

	const study_level = [
		{ value: 0, title: 'Бакалавриат' },
		{ value: 1, title: 'Магистратура' },
	]
	const [selectedStudyLevel, setSelectedStudyLevel] = useState(null)

	const courses = [
		{
			value: 0,
			title: '1-й курс',
		},
		{
			value: 1,
			title: '2-й курс',
		},
		{
			value: 2,
			title: '3-й курс',
		},
		{
			value: 3,
			title: '4-й курс',
		},
	]
	const [selectedCourses, setSelectedCourses] = useState(null)

	const isForm2Valid = selectedDisciplines !== null

	const handleSubmit1 = async e => {
		e.preventDefault()

		if (!isForm1Valid) return

		try {
			const formData = new FormData()
			formData.append('name', title)
			formData.append('description', description)
			formData.append('semester', selectedSemester)
			formData.append('course', selectedCourses + 1)
			formData.append('study_level', study_level[selectedStudyLevel]?.title)
			formData.append('teacher_profile_id', teacher_profile_id)
			if (img !== null) formData.append('image', img)

			const res = await api.post(`${API}/courses`, formData, {
				withCredentials: true,
				headers: {
					'X-CSRF-TOKEN': getCookie('csrftoken'),
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

	const fetchYear = async () => {
		try {
			const res = await api.get(`${API}/courses/study-year/all`, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			setGlobalError(null)
			setYear(res.data)
		} catch (error) {
			console.log(error)
		}
	}

	const fetchDisciplines = async (year, semester) => {
		console.log(year, semester, 'in fetchDisciplines')
		try {
			const res = await api.get(
				`${API}/courses/disciplines/by-load?year=${year}&semester=${semester}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				}
			)

			setGlobalError(null)
			setDisciplines(res.data)
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		if (selected === 1) {
			fetchYear()
		}
		if (selected === 0) {
			setDisciplines([])
			setSelectedDisciplines(null)
		}
	}, [selected])

	useEffect(() => {
		selectedYear !== null &&
			selectedSemester !== null &&
			fetchDisciplines(year[selectedYear], selectedSemester)
	}, [selectedYear, selectedSemester])

	useEffect(() => {
		selectedStudyLevel === 1 && selectedCourses > 1 && setSelectedCourses(null)
	}, [selectedStudyLevel])

	const handleSubmit2 = async e => {
		e.preventDefault()

		if (!isForm2Valid) return

		try {
			const formData = new FormData()
			formData.append('name', disciplines[selectedDisciplines]?.discipline)
			formData.append(
				'description',
				disciplines[selectedDisciplines]?.study_plan
			)
			formData.append('semester', disciplines[selectedDisciplines]?.semester)
			formData.append('course', disciplines[selectedDisciplines]?.course)
			formData.append(
				'id_plan_strings',
				disciplines[selectedDisciplines]?.id_plan_strings
			)
			formData.append(
				'study_plan',
				disciplines[selectedDisciplines]?.study_plan
			)
			formData.append(
				'study_year',
				disciplines[selectedDisciplines]?.study_year
			)

			if (img !== null) formData.append('image', img)

			const res = await api.post(
				`${API}/courses?is_from_load=${true}`,
				formData,
				{
					withCredentials: true,
					headers: {
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				}
			)

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
			<div className='bg-[var(--white)] relative p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.125)] max-md:h-[90vh] max-md:overflow-y-scroll  z-1001'>
				<X
					onClick={onClose}
					className='absolute top-1.5 right-1.5 text-[var(--middle)] cursor-pointer hover:text-white  hover:bg-red-500 hover:rounded-full hover:p-0.5  transition-all'
				/>
				<h2 className='text-2xl font-medium text-[var(--black)] mb-5 text-center'>
					Создание курса
				</h2>
				<div className='flex gap-3 w-full justify-center mb-3'>
					{options?.map(option => (
						<RadioButton
							key={option?.value}
							name='example'
							value={option?.value}
							title={option?.title}
							icon={option?.icon}
							checked={selected === option?.value}
							onChange={() => setSelected(option?.value)}
						/>
					))}
				</div>

				{selected === 0 ? (
					<form
						onSubmit={handleSubmit1}
						className='w-[482px] max-md:w-[80vw] inline-flex flex-col items-center gap-5'
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
						<div className='flex gap-3 w-full justify-center mb-3'>
							{semesters?.map(item => (
								<RadioButton
									key={item?.value}
									name='example'
									value={item?.value}
									title={item?.title}
									icon={item?.icon}
									checked={selectedSemester === item?.value}
									onChange={() => setSelectedSemester(item?.value)}
									fill={true}
									wfull={true}
								/>
							))}
						</div>

						<div className='flex gap-3 w-full justify-center mb-3'>
							{study_level?.map(item => (
								<RadioButton
									key={item?.value}
									name='example'
									value={item?.value}
									title={item?.title}
									icon={item?.icon}
									checked={selectedStudyLevel === item?.value}
									onChange={() => setSelectedStudyLevel(item?.value)}
									fill={true}
									wfull={true}
								/>
							))}
						</div>

						<div className='flex gap-3 w-full justify-center mb-3'>
							{courses?.map((item, index) => {
								return (
									<RadioButton
										key={item?.value}
										name='example'
										value={item?.value}
										title={item?.title}
										icon={item?.icon}
										checked={selectedCourses === item?.value}
										onChange={() => setSelectedCourses(item?.value)}
										fill={true}
										wfull={true}
										disabled={selectedStudyLevel === 1 && index > 1}
									/>
								)
							})}
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
								isForm1Valid
									? 'bg-[var(--black)] text-[var(--white)] cursor-pointer'
									: 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed'
							}`}
							type='submit'
							value='Создать курс'
							disabled={!isForm1Valid}
						/>
					</form>
				) : selected === 1 ? (
					<form
						onSubmit={handleSubmit2}
						className='w-[482px] max-md:w-[80vw] inline-flex flex-col items-center gap-5'
					>
						<div className='w-full flex flex-col gap-3'>
							<OptionInput2
								Options={year}
								color='white'
								placeholder={'Учебный год'}
								onChange={data => setSelectedYear(data)}
							/>
							<div className='flex gap-3 w-full justify-center mb-3'>
								{semesters?.map(item => (
									<RadioButton
										key={item?.value}
										name='example'
										value={item?.value}
										title={item?.title}
										icon={item?.icon}
										checked={selectedSemester === item?.value}
										onChange={() => setSelectedSemester(item?.value)}
										fill={true}
										wfull={true}
									/>
								))}
							</div>
						</div>

						<div className=' bg-[var(--light-middle)] rounded-lg shadow-inner p-2 pr-2.75 overflow-y-scroll flex flex-col gap-2 w-full h-[39.5vh]'>
							{disciplines?.map((item, i) => (
								<motion.div
									key={i}
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{
										duration: 0.3,
										delay: i * 0.1,
										ease: 'easeOut',
									}}
								>
									<div
										key={i}
										onClick={() => setSelectedDisciplines(i)}
										className={`bg-[var(--white)] rounded-md shadow-[var(--shadow)] px-4 py-2  cursor-pointer hover:scale-101 transition-all flex flex-col ${
											selectedDisciplines === i &&
											'ring-2 ring-[var(--hero-epta)] shadow-[var(--hero-shadow)]'
										}`}
									>
										<p className={`font-medium text-[var(--black)] `}>
											{item?.discipline}
										</p>
										<p className={`font-light text-[var(--middle)] `}>
											{item?.study_plan?.replace(/\.plx$/, '')}
										</p>
										<p
											className={`font-light w-fit px-4 py-1 pt-1.5 rounded-md transition-all ${
												selectedDisciplines !== i
													? 'text-[var(--hero-epta)] bg-[var(--hero-pale)]'
													: 'bg-[var(--hero-epta)] text-white'
											} `}
										>
											{item?.course} Курс
										</p>
									</div>
								</motion.div>
							))}
						</div>

						<input
							className={`px-[51px] py-[14.5px] font-medium text-xl rounded-lg w-fit  transition ${
								isForm2Valid
									? 'bg-[var(--black)] text-[var(--white)] cursor-pointer'
									: 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed'
							}`}
							type='submit'
							value='Создать курс'
							disabled={!isForm2Valid}
						/>
					</form>
				) : (
					<></>
				)}
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

		try {
			const res = await api.post(`${API}/webinar`, formData, {
				withCredentials: true,
				headers: {
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			const data = res.data

			onCreate(data)
			onClose()
			setTitle('')
			setUrl('')
			setDate('')
			setSTime('')
			setETime('')
			setImg(null)
		} catch (error) {
			console.error('Ошибка сервера:', error)
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
	const semester = [
		{ value: 1, title: '1-й Семестр' },
		{ value: 2, title: '2-й Семестр' },
	]
	const [selectedSortFilter, setSelectedSortFilter] = useState(null)
	const sorting_filters = [
		'Все',
		'По дате создания (новые)',
		'По дате создания (старые)',
		'По названию курса (А-Я)',
		'По названию курса (Я-А)',
	]
	const [selectedSemester, setSelectedSemester] = useState(null)
	const study_level = ['Все', 'Бакалавриат', 'Магистратура']
	const [selectedStatus, setSelectedStatus] = useState(null)
	const status_options = [
		'Все',
		'Опубликован',
		'Не опубликован',
		'На рассмотрении',
	]
	const [selectedElvl, setSelectedElvl] = useState(null)
	const courses_option = [
		{ value: 1, title: '1-й курс' },
		{ value: 2, title: '2-й курс' },
		{ value: 3, title: '3-й курс' },
		{ value: 4, title: '4-й курс' },
	]
	const [selectedCoursesOpt, setSelectedCourseOpt] = useState(null)

	const [activeFilterModal, setActiveFilterModal] = useState(false)

	const location = useLocation()
	const navigate = useNavigate()

	const NavigateTo = (to, value) => {
		setSelected(value)
		navigate(to)
	}

	useEffect(() => {
		status_options[selectedStatus] === 'Все' && setSelectedStatus(null)
		study_level[selectedElvl] === 'Все' && setSelectedElvl(null)
		sorting_filters[selectedSortFilter] === 'Все' && setSelectedSortFilter(null)
	}, [selectedStatus, selectedElvl, selectedSortFilter])

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

	const handleCreateCourse = () => {
		fetchCourses()
	}
	const handleCreateWebinar = () => {
		fetchWebinars()
	}

	const fetchCourses = async () => {
		let sortParam = null
		let sortValue = null

		const sort = sorting_filters[selectedSortFilter]

		if (sort === 'по дате создания (новые)') {
			sortParam = 'sort_date'
			sortValue = 'desc'
		} else if (sort === 'по дате создания (старые)') {
			sortParam = 'sort_date'
			sortValue = 'asc'
		} else if (sort === 'по названию курса (А-Я)') {
			sortParam = 'sort_name'
			sortValue = 'asc'
		} else if (sort === 'по названию курса (Я-А)') {
			sortParam = 'sort_name'
			sortValue = 'desc'
		}
		try {
			const res = await api.get(`${API}/courses/`, {
				params: {
					semester: selectedSemester,
					...(sortParam && { [sortParam]: sortValue }),
					...(selectedStatus !== null &&
						selectedStatus !== undefined && {
							course_status:
								status_options[selectedStatus] === 'Опубликован'
									? 'approved'
									: status_options[selectedStatus] === 'Не опубликован'
									? 'in_development'
									: 'pending',
						}),

					study_level: study_level[selectedElvl],
					course: selectedCoursesOpt,
				},
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			setGlobalError(null)
			setCourses(res.data)
		} catch (error) {
			console.log(error)
		}
	}

	const fetchAllCourses = async () => {
		try {
			const res = await api.get(`${API}/courses/all`, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			setGlobalError(null)

			setCourses(res.data)
		} catch (error) {
			console.log(error)
		}
	}

	const fetchWebinars = async () => {
		try {
			const res = await api.get(
				`${API}/webinar${
					selectedFilters !== 'all' ? `/?webinar_status=${selectedFilters}` : ''
				}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				}
			)

			setGlobalError(null)
			setWebinars(res.data)
		} catch (error) {
			console.log(error)
		}
	}

	const filterFunc = async () => {
		setActiveFilterModal(false)
		fetchCourses()
	}
	const deleteAllFilters = async () => {
		setActiveFilterModal(false)
		setSelectedSortFilter(null)
		setSelectedSemester(null)
		setSelectedStatus(null)
		setSelectedElvl(null)
		setSelectedCourseOpt(null)
		fetchCourses()
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

	const filters = {
		selectedSortFilter,
		selectedSemester,
		selectedStatus,
		selectedElvl,
		selectedCoursesOpt,
	}

	const activeFiltersCount = useMemo(
		() =>
			Object.values(filters).filter(v => v !== null && v !== undefined).length,
		[filters]
	)

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
				className={`min-h-[calc(100vh-100px)] flex flex-col gap-4 pb-55 pt-[50px] md:py-12`}
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

					<div className='relative flex gap-4 max-lg:gap-2 h-12'>
						<button
							type='button'
							onClick={() => setActiveFilterModal(prev => !prev)}
							className='flex gap-2 items-center text-xl font-normal px-4 rounded-lg  text-[var(--black)] bg-[var(--white)] shadow-[var(--shadow)] cursor-pointer hover:bg-[var(--hero-epta)] hover:text-white transition-all'
						>
							<Filter />
							Фильтры
						</button>
						{activeFiltersCount > 0 && (
							<div className='absolute -top-2 -right-2 w-5 h-5 pt-[1px] rounded-full bg-[var(--hero-epta)] flex items-center justify-center text-white text-xs font-medium'>
								{activeFiltersCount}
							</div>
						)}
						{activeFilterModal && (
							<div className='absolute grid grid-cols-2 p-4 gap-3 right-0  max-[874px]:left-0 top-15 max-md:w-[93vw] max-xl:w-[50vw] w-[25vw] z-10 h-fit rounded-xl bg-[var(--white)] shadow-[var(--shadow)] text-white text-xs'>
								<OptionInput2
									Options={study_level}
									color='white'
									placeholder={'Уровень обучения'}
									onChange={data => setSelectedElvl(data)}
									value={selectedElvl}
								/>
								<OptionInput2
									Options={status_options}
									color='white'
									placeholder={'Статус'}
									onChange={data => setSelectedStatus(data)}
									value={selectedStatus}
								/>
								<div className='flex flex-col col-span-2'>
									<div className='flex gap-3 w-full justify-center mb-3'>
										{semester?.map(item => (
											<RadioButton
												key={item?.value}
												name='example'
												value={item?.value}
												title={item?.title}
												icon={item?.icon}
												checked={selectedSemester === item?.value}
												onChange={() => setSelectedSemester(item?.value)}
												fill={true}
												wfull={true}
											/>
										))}
									</div>

									<div className='flex gap-3 w-full justify-center'>
										{courses_option?.map((item, index) => {
											return (
												<RadioButton
													key={item?.value}
													name='example'
													value={item?.value}
													title={item?.title}
													icon={item?.icon}
													checked={selectedCoursesOpt === item?.value}
													onChange={() => setSelectedCourseOpt(item?.value)}
													fill={true}
													wfull={true}
													disabled={selectedElvl === 1 && index > 1}
												/>
											)
										})}
									</div>
								</div>

								<div className='col-span-2'>
									<OptionInput2
										Options={sorting_filters}
										color='white'
										placeholder={'Сортировка'}
										onChange={data => setSelectedSortFilter(data)}
										value={selectedSortFilter}
									/>
								</div>

								<button
									type='button'
									onClick={() => filterFunc()}
									className='col-span-2 py-2 flex gap-2 items-center justify-center text-xl font-medium px-4 rounded-lg bg-[var(--black)] text-[var(--white)] shadow-[var(--shadow)] cursor-pointer hover:bg-[var(--hero-epta)] hover:text-white transition-all'
								>
									Применить фильтры
								</button>
								<div className='w-full flex justify-center col-span-2'>
									<LinkBTN
										onClick={() => {
											deleteAllFilters()
										}}
										title={'Сбросить фильтры'}
										textsize='text-md'
									/>
								</div>
							</div>
						)}
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
						className={`min-h-[calc(100vh-100px)] flex flex-col gap-4 pb-55 pt-[50px] md:py-12`}
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
										status={course.course_status}
										course={course.course}
										semester={course.semester}
										education={course.study_level}
										to={
											location.pathname === '/catalog/all'
												? `/course/${course.id}`
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
							className={`min-h-[calc(100vh-100px)] flex flex-col gap-4 pb-55 pt-[50px] md:py-12`}
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
