import { useEffect, useMemo, useState } from 'react'
import { Button, FilterButton, RadioButton } from '../components/Buttons'
import {
	Blocks,
	CalendarDays,
	FunnelPlus,
	LayoutGrid,
	Radio,
	X,
	History,
	Filter,
} from 'lucide-react'
import { CourseCard, WebinarCard } from '../components/Cards'
import {
	FileInput,
	InputDefault,
	OptionInput2,
	SearchInput,
	TextArea,
} from '../components/Inputs'
import { motion } from 'framer-motion'
import api, { API, FILE_API } from '../API'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import TiltedCard from '../components/ReactBits/TiledCard'
import { setGlobalError } from '../components/Errors'
import axios from 'axios'
import { getCookie, token } from '../TOKEN'
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

const CatalogS = ({ role }) => {
	const [selected, setSelected] = useState(0)
	const [selectedFilters, setSelectedFilters] = useState('all')
	const [courses, setCourses] = useState([])
	const [webinars, setWebinars] = useState([])
	const options = [
		{ value: 0, to: 'courses', title: 'Добавленные курсы', icon: LayoutGrid },
		{ value: 1, to: 'webinars', title: 'Видео-конференции', icon: Radio },
	]
	const filter = [
		{ value: 'all', title: 'Все', icon: LayoutGrid },
		{ value: 'pending', title: 'Предстоящие', icon: CalendarDays },
		{ value: 'open', title: 'Активные', icon: Radio },
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
		if (location.pathname === '/catalogs') {
			NavigateTo(options[0].to, options[0].value)
		}

		if (location.pathname === '/catalogs/courses') {
			setSelected(options[0].value)
		} else if (location.pathname === '/catalogs/webinars') {
			setSelected(options[1].value)
		}
	}, [location.pathname])

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
				},
			})

			setGlobalError(null)
			setCourses(res.data)
		} catch (error) {
			console.log(error)
		}
	}

	const filterFunc = async () => {
		setActiveFilterModal(false)
		fetchCourses()
	}
	const deleteAllFilters = async () => {
		setSelectedSortFilter(null)
		setSelectedSemester(null)
		setSelectedStatus(null)
		setSelectedElvl(null)
		setSelectedCourseOpt(null)
	}
	const fetchWebinars = async () => {
		try {
			const res = await api.get(
				`${API}/webinar${`/?webinar_status=${selectedFilters}`}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)

			setGlobalError(null)
			setWebinars(res.data)
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		fetchWebinars()
	}, [selectedFilters])

	useEffect(() => {
		location.pathname === '/catalogs/courses'
			? fetchCourses()
			: location.pathname === '/catalogs/webinars' && fetchWebinars()
	}, [location.pathname])

	useEffect(() => {
		role === 'teacher' && navigate('/catalogt/courses')
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
		[filters],
	)

	return (
		<>
			<div className={` flex flex-col gap-4 py-[50px]`}>
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
				{location.pathname === '/catalogs/webinars' && (
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

				{location.pathname === '/catalogs/courses' ? (
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
										status={course.status}
										deadline={course.deadline}
										to={`/course/${course.id}`}
									/>
								</motion.div>
							))}
						</div>
					</div>
				) : (
					location.pathname === '/catalogs/webinars' && (
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
											webinarId={web.id}
										/>
									</motion.div>
								))}
							</div>
						</div>
					)
				)}
			</div>
		</>
	)
}

export default CatalogS
