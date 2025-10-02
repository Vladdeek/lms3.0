import { useEffect, useState } from 'react'
import { Button, FilterButton, RadioButton } from '../components/Buttons'
import {
	Blocks,
	CalendarDays,
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
import { motion } from 'framer-motion'
import { API, FILE_API } from '../API'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

const CatalogS = ({ role }) => {
	const [selected, setSelected] = useState(0)
	const [selectedFilters, setSelectedFilters] = useState('open')
	const [courses, setCourses] = useState([])
	const [webinars, setWebinars] = useState([])
	const options = [
		{ value: 0, to: 'courses', title: 'Добавленные курсы', icon: LayoutGrid },
		{ value: 1, to: 'webinars', title: 'Вебинар', icon: Radio },
	]
	const filter = [
		{ value: 'open', title: 'Все', icon: LayoutGrid },
		{ value: 'pending', title: 'Предстоящие', icon: CalendarDays },
	]

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
		const res = await fetch(`${API}/courses/`)
		const data = await res.json()
		console.log('Список курсов:', data)
		setCourses(data || [])
	}
	const fetchWebinars = async () => {
		const res = await fetch(`${API}/webinar/?webinar_status=${selectedFilters}`)
		const data = await res.json()
		console.log('Список вебинаров:', data)
		setWebinars(data.detail === 'Not Found' ? [] : data)
	}
	useEffect(() => {
		fetchWebinars()
	}, [selectedFilters])

	useEffect(() => {
		location.pathname === '/catalogs/courses'
			? fetchCourses()
			: location.pathname === '/catalogs/webinars' && fetchWebinars()
	}, [location.pathname])

	return (
		<>
			{role === 'student' ? (
				<Navigate to='/catalogt' replace />
			) : (
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
							className={`${
								courses?.length === 0 || courses?.length < 5
									? 'h-screen'
									: 'h-full'
							} flex flex-col gap-4 py-[50px]`}
						>
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
											to={`/course/${course.id}`}
										/>
									</motion.div>
								))}
							</div>
						</div>
					) : (
						location.pathname === '/catalogs/webinars' && (
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
								</div>
							</div>
						)
					)}
				</div>
			)}
		</>
	)
}

export default CatalogS
