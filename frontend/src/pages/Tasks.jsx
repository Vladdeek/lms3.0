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
import TiltedCard from '../components/ReactBits/TiledCard'
import { Forbidden403, useError } from '../components/Errors'
import axios from 'axios'
import { getCookie, token } from '../TOKEN'

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
		{ value: 1, to: 'webinars', title: 'Вебинар', icon: Radio },
	]
	const filter = [
		{ value: 'all', title: 'Все', icon: LayoutGrid },
		{ value: 'pending', title: 'Предстоящие', icon: CalendarDays },
	]

	const location = useLocation()
	const navigate = useNavigate()

	const { setError } = useError()

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
		try {
			const res = await axios.get(`${API}/courses/`, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': getCookie('csrftoken'),
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
		try {
			const res = await axios.get(
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
		location.pathname === '/catalogs/courses'
			? fetchCourses()
			: location.pathname === '/catalogs/webinars' && fetchWebinars()
	}, [location.pathname])

	useEffect(() => {
		role === 'teacher' && navigate('/catalogt/courses')
	}, [role])

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

				{location.pathname === '/catalogs/courses' ? (
					<div className={` flex flex-col gap-4 py-[50px]`}>
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
						<div className={` flex flex-col gap-4 py-[50px]`}>
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
		</>
	)
}

export default CatalogS
