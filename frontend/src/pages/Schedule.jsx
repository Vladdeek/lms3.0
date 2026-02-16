import {
	format,
	startOfWeek,
	addDays,
	isToday,
	isWeekend,
	isWithinInterval,
	startOfToday,
	isSameDay,
	set,
	addWeeks,
} from 'date-fns'
import { da, ru } from 'date-fns/locale'
import DirectionOfTraining from '../components/DirectionOfTraining'
import { use, useEffect, useMemo, useRef, useState } from 'react'
import api, { API } from '../API'
import { getCookie } from '../TOKEN'
import Loader from '../components/Loader'
import axios from 'axios'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { OptionSearch } from '../components/Inputs'
import { setGlobalError } from '../components/Errors'

const ScheduleCard1 = ({
	lessonIndex,
	isCurrent,
	start_time,
	end_time,
	title,
	description,
	auditory_name,
	subgroup,
}) => {
	return (
		<div
			key={lessonIndex}
			className={`relative bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 w-full flex flex-col gap-2 ${
				isCurrent ? 'ring-4 ring-[var(--hero-epta)]' : ''
			}`}
		>
			<p className=' xl:text-sm text-xs text-[var(--black)]'>
				<span className='px-2 pb-0.75 pt-1.25 rounded-md bg-[var(--hero-epta)] text-white w-fit'>
					{start_time}
				</span>
				—
				<span className='px-2 pb-0.75 pt-1.25 rounded-md bg-[var(--hero-epta)] text-white w-fit'>
					{end_time}
				</span>
			</p>

			<p className='text-[var(--black)] font-bold xl:text-lg text-md'>
				{title}
			</p>
			<p className='text-[var(--middle)] font-light xl:text-sm text-xs'>
				{description}
			</p>
			<p className='text-[var(--middle)] font-light xl:text-sm text-xs mb-3'>
				{subgroup}
			</p>
			<p className='absolute bottom-2 w-fit flex gap-1 items-center right-2  text-[var(--middle)] font-light'>
				ауд.
				<span className=' text-white w-fit rounded-lg bg-[var(--hero-epta)] px-2 py-[1px] font-medium xl:text-sm text-xs'>
					{auditory_name}
				</span>
			</p>
		</div>
	)
}

const DayCard1 = ({ isCurrentDay, day, month, weekDay }) => {
	return (
		<div
			className={` rounded-xl shadow-[var(--shadow)] flex items-center justify-center gap-3 text-[var(--black)] font-medium w-full p-4 ${
				isCurrentDay ? 'bg-[var(--hero-epta)] text-white' : 'bg-[var(--white)]'
			} `}
		>
			<div className='flex flex-col items-center justify-center'>
				<p className='2xl:text-8xl xl:text-7xl text-5xl'>{day}</p>
				<p className='2xl:text-2xl xl:text-xl text-md'>{month}</p>
			</div>
			<p className='2xl:text-7xl xl:text-6xl text-5xl'>{weekDay}</p>
		</div>
	)
}

const ScheduleCard2 = ({
	lessonIndex,
	isCurrent,
	start_time,
	end_time,
	title,
	description,
	auditory_name,
	subgroup,
}) => {
	return (
		<div
			key={lessonIndex}
			className={`relative bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 w-full flex flex-col gap-2 ${
				isCurrent ? 'ring-4 ring-[var(--hero-epta)]' : ''
			}`}
		>
			<p className=' xl:text-sm text-xs text-[var(--black)]'>
				<span className='px-2 pb-0.75 pt-1.25 rounded-md bg-[var(--hero-epta)] text-white w-fit'>
					{start_time}
				</span>
				—
				<span className='px-2 pb-0.75 pt-1.25 rounded-md bg-[var(--hero-epta)] text-white w-fit'>
					{end_time}
				</span>
			</p>
			<p className='text-[var(--black)] font-bold text-lg'>{title}</p>
			<p className='text-[var(--middle)] font-light text-sm'>{description}</p>
			<p className='text-[var(--middle)] font-light text-sm mb-3'>{subgroup}</p>
			<p className='absolute bottom-1 w-fit flex gap-1 items-center right-1  text-[var(--middle)] font-light'>
				ауд.
				<span className=' text-white w-fit rounded-lg bg-[var(--hero-epta)] px-2 py-[1px] font-medium text-sm'>
					{auditory_name}
				</span>
			</p>
		</div>
	)
}

const DayCard2 = ({ isSelected, day, weekDay, onClick }) => {
	return (
		<div
			onClick={onClick}
			className={`
				cursor-pointer rounded-xl shadow-[var(--shadow)] 
				flex items-center justify-center gap-3 text-[var(--black)] 
				font-medium w-full p-4 
				${isSelected ? 'bg-[var(--hero-epta)] text-white' : 'bg-[var(--white)]'}
			`}
		>
			<div className='flex flex-col items-center justify-center'>
				<p className='text-3xl'>{day}</p>
				<p className='text-lg'>{weekDay}</p>
			</div>
		</div>
	)
}

const Schedule1 = ({
	scheduleData,
	Offset,
	prev_active,
	next_active,
	selectedOffset,
	WeekNumber,
	role,
	onClick,
	onSelected,
	academic_year,
	semester,
}) => {
	const [weekOffset, setWeekOffset] = useState(selectedOffset)
	const [selected, setSelected] = useState(false)
	const today = new Date()
	const weekStart = startOfWeek(addWeeks(today, weekOffset), {
		weekStartsOn: 1,
	})
	const weekDays = useMemo(
		() => Array.from({ length: 6 }, (_, i) => addDays(weekStart, i)),
		[weekStart],
	)
	// Функция для проверки, является ли урок текущим
	const isCurrentLesson = (lessonDate, lessonTime) => {
		try {
			// Парсим время урока
			const [hours, minutes] = lessonTime.split(':').map(Number)
			const lessonStart = new Date(lessonDate)
			lessonStart.setHours(hours, minutes, 0, 0)

			// Предполагаем, что урок длится 1.5 часа (90 минут)
			const lessonEnd = new Date(lessonStart.getTime() + 90 * 60000)

			// Проверяем, находится ли текущее время в промежутке времени урока
			return isWithinInterval(today, { start: lessonStart, end: lessonEnd })
		} catch (error) {
			return false
		}
	}

	const [isLoading, setIsLoading] = useState(3)
	const [isSearchLoading, setIsSearchLoading] = useState(null)

	const [teachers, setTeachers] = useState([])
	const [searchTeachers, setSearchTeachers] = useState('')

	const teachersDebounce = useRef(null)

	const fetchTeachers = async term => {
		try {
			setIsLoading(isSearchLoading !== null ? null : 1)

			const res = await api.get(
				`${API}/teacher-profile${term?.length ? `?term=${term}` : ''}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)

			setGlobalError(null)
			setTeachers(res.data.map(t => t.mmis_teacher_name))

			setIsLoading(null)
			setIsSearchLoading(null)
		} catch (error) {}
	}
	useEffect(() => {
		if (searchTeachers === '') {
			fetchTeachers()
			return
		}

		if (teachersDebounce.current) clearTimeout(teachersDebounce.current)

		teachersDebounce.current = setTimeout(() => {
			fetchTeachers(searchTeachers)
		}, 1500)

		return () => clearTimeout(teachersDebounce.current)
	}, [searchTeachers])

	useEffect(() => {
		Offset?.(weekOffset)
	}, [weekOffset])

	return (
		<>
			<div className='flex items-center justify-between m-3'>
				{role === 'student' && (
					<>
						<div className='w-full flex items-center gap-3 relative'>
							<button
								type={'button'}
								onClick={e => {
									e.preventDefault()
									const newValue = !selected
									setSelected(newValue)
									onSelected?.(newValue) // ← ДОБАВИТЬ ЭТО
								}}
								className={`bg-transparent px-4 py-2.5 ring-2 rounded-lg cursor-pointer transition-all font-medium text-xl ${
									selected
										? 'text-[var(--hero-epta)] ring-[var(--hero-epta)]'
										: 'text-[var(--black)]  ring-[var(--black)]'
								}`}
							>
								Найти преподавателя
							</button>
							<div
								className={`transition-all  ${
									!selected && 'absolute opacity-0 -z-1'
								}`}
							>
								<OptionSearch
									placeholder='Иванов И..'
									onSearch={term => setSearchTeachers(term)}
									Options={teachers}
									onSelect={teacher => onClick(teacher)}
								/>
							</div>
						</div>
					</>
				)}
				<div
					className={`flex flex-col w-full justify-center ${
						role !== 'student' ? 'items-center ' : 'items-end '
					} `}
				>
					<div
						className={`w-full ${
							role !== 'student' ? 'justify-center' : 'justify-end'
						}  flex items-center gap-5 text-[var(--black)]`}
					>
						<ChevronLeft
							size={48}
							onClick={() => prev_active && setWeekOffset(prev => prev - 1)}
							className={`${!prev_active && 'opacity-50 cursor-not-allowed'}`}
						/>
						<p className='font-medium text-2xl mt-0.5'>Неделя {WeekNumber}</p>
						<ChevronRight
							size={48}
							onClick={() => next_active && setWeekOffset(prev => prev + 1)}
							className={`${!next_active && 'opacity-50 cursor-not-allowed'}`}
						/>
					</div>
					<p
						className={`font-light text-[var(--middle)] text-md mt-0.5 ${
							role !== 'student' ? 'text-center' : 'text-end'
						} `}
					>
						Учебный год: {academic_year} Семестр: {semester}
					</p>
				</div>
			</div>

			<div className=' grid grid-cols-6 gap-2'>
				{weekDays.map((day, index) => {
					const dateString = format(day, 'yyyy-MM-dd')
					const daySchedule = scheduleData?.[dateString] || []
					const isCurrentDay = isToday(day)

					return (
						<div key={index} className='flex flex-col gap-4'>
							<DayCard1
								isCurrentDay={isCurrentDay}
								day={format(day, 'd')}
								month={format(day, 'MMMM', { locale: ru })}
								weekDay={format(day, 'EEEEEE', { locale: ru }).toUpperCase()}
							/>
							<div className='flex flex-col gap-3'>
								{daySchedule.length > 0 ? (
									daySchedule.map((lesson, lessonIndex) => {
										const isCurrent = isCurrentLesson(day, lesson.start_time)

										return (
											<ScheduleCard1
												lessonIndex={lessonIndex}
												isCurrent={isCurrent}
												start_time={lesson.start_time}
												end_time={lesson.end_time}
												title={lesson.title}
												description={lesson.description}
												auditory_name={lesson.auditory_name}
												subgroup={lesson.subgroup}
											/>
										)
									})
								) : (
									<div className='bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 w-full flex items-center justify-center min-h-[120px]'>
										<p className='text-[var(--middle)] text-center'>
											Нет занятий
										</p>
									</div>
								)}
							</div>
						</div>
					)
				})}
			</div>
		</>
	)
}

const Schedule2 = ({
	scheduleData,
	Offset,
	prev_active,
	next_active,
	selectedOffset,
	WeekNumber,
	role,
	onClick,
	onSelected,
	semester,
	academic_year,
}) => {
	const [weekOffset, setWeekOffset] = useState(selectedOffset)
	const today = startOfToday()
	const [selected, setSelected] = useState(false)

	// 🔥 Начало текущей недели (понедельник)
	const weekStart = startOfWeek(addWeeks(today, weekOffset), {
		weekStartsOn: 1,
	})

	// 🔥 Генерация именно текущей недели (6 дней, как у Schedule1)
	const weekDays = useMemo(
		() => Array.from({ length: 6 }, (_, i) => addDays(weekStart, i)),
		[weekStart],
	)

	// выбор дня — по умолчанию сегодня, если он в текущей неделе
	const [selectedDay, setSelectedDay] = useState(
		weekDays.find(d => isSameDay(d, today)) || weekDays[0],
	)

	const isCurrentLesson = (lessonDate, lessonTime) => {
		try {
			const [hours, minutes] = lessonTime.split(':').map(Number)
			const lessonStart = new Date(lessonDate)
			lessonStart.setHours(hours, minutes, 0, 0)

			const lessonEnd = new Date(lessonStart.getTime() + 90 * 60000)

			return isWithinInterval(new Date(), {
				start: lessonStart,
				end: lessonEnd,
			})
		} catch (error) {
			return false
		}
	}

	const selectedDateString = format(selectedDay, 'yyyy-MM-dd')
	const selectedDaySchedule = scheduleData?.[selectedDateString] || []

	const [isLoading, setIsLoading] = useState(3)
	const [isSearchLoading, setIsSearchLoading] = useState(null)

	const [teachers, setTeachers] = useState([])
	const [searchTeachers, setSearchTeachers] = useState('')

	const teachersDebounce = useRef(null)

	const fetchTeachers = async term => {
		try {
			setIsLoading(isSearchLoading !== null ? null : 1)

			const res = await api.get(
				`${API}/teacher-profile${term?.length ? `?term=${term}` : ''}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)

			setGlobalError(null)
			setTeachers(res.data.map(t => t.mmis_teacher_name))

			setIsLoading(null)
			setIsSearchLoading(null)
		} catch (error) {}
	}
	useEffect(() => {
		if (searchTeachers === '') {
			fetchTeachers()
			return
		}

		if (teachersDebounce.current) clearTimeout(teachersDebounce.current)

		teachersDebounce.current = setTimeout(() => {
			fetchTeachers(searchTeachers)
		}, 1500)

		return () => clearTimeout(teachersDebounce.current)
	}, [searchTeachers])

	useEffect(() => {
		Offset?.(weekOffset)
	}, [weekOffset])

	return (
		<>
			<div className='w-full relative flex flex-col justify-center mb-3 text-[var(--black)]'>
				{role === 'student' && (
					<>
						<div className='w-full flex items-center'>
							<button
								type={'button'}
								onClick={e => {
									e.preventDefault()
									const newValue = !selected
									setSelected(newValue)
									onSelected?.(newValue) // ← ДОБАВИТЬ ЭТО
								}}
								className={`bg-transparent w-full py-2.5 ring-2 rounded-lg cursor-pointer transition-all font-medium text-xl ${
									selected
										? 'text-[var(--hero-epta)] ring-[var(--hero-epta)]'
										: 'text-[var(--black)]  ring-[var(--black)]'
								}`}
							>
								Найти преподавателя
							</button>
						</div>
						<div
							className={`transition-all w-full my-3 ${
								!selected && 'absolute opacity-0 -z-1'
							}`}
						>
							<OptionSearch
								placeholder='Иванов И..'
								onSearch={term => setSearchTeachers(term)}
								Options={teachers}
								onSelect={teacher => onClick(teacher)}
							/>
						</div>
					</>
				)}

				<div className='w-full flex items-center justify-between text-[var(--black)]'>
					<ChevronLeft
						size={48}
						onClick={() => prev_active && setWeekOffset(prev => prev - 1)}
						className={`${!prev_active && 'opacity-50 cursor-not-allowed'}`}
					/>
					<p className='font-medium text-2xl mt-0.5'>Неделя {WeekNumber}</p>
					<ChevronRight
						size={48}
						onClick={() => next_active && setWeekOffset(prev => prev + 1)}
						className={`${!next_active && 'opacity-50 cursor-not-allowed'}`}
					/>
				</div>
				<p className='font-light text-[var(--middle)] text-md mt-0.5 text-center'>
					Учебный год: {academic_year} Семестр: {semester}
				</p>
			</div>
			<div className='grid grid-cols-6 gap-2'>
				{/* Дни недели */}
				{weekDays.map((day, index) => {
					const isCurrentDay = isToday(day)
					const isSelected = isSameDay(day, selectedDay)

					return (
						<div key={index} className='flex flex-col gap-4'>
							<DayCard2
								isCurrentDay={isCurrentDay}
								isSelected={isSelected}
								onClick={() => setSelectedDay(day)}
								day={format(day, 'd')}
								month={format(day, 'MMMM', { locale: ru })}
								weekDay={format(day, 'EEEEEE', { locale: ru }).toUpperCase()}
							/>
						</div>
					)
				})}

				{/* Расписание выбранного дня */}
				<div className='col-span-6 flex flex-col gap-3 mt-1'>
					{selectedDaySchedule?.length > 0 ? (
						selectedDaySchedule.map((lesson, lessonIndex) => {
							const isCurrent = isCurrentLesson(selectedDay, lesson?.start_time)

							return (
								<ScheduleCard2
									key={lessonIndex}
									lessonIndex={lessonIndex}
									isCurrent={isCurrent}
									start_time={lesson.start_time}
									end_time={lesson.end_time}
									title={lesson.title}
									description={lesson.description}
									auditory_name={lesson.auditory_name}
									subgroup={lesson.subgroup}
								/>
							)
						})
					) : (
						<div className='bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 w-full flex items-center justify-center min-h-[120px]'>
							<p className='text-[var(--middle)] text-center'>Нет занятий</p>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

const SchedulePage = ({ role }) => {
	const [scheduleData, setScheduleData] = useState({})
	const [allScheduleData, setAllScheduleData] = useState({})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const [current_week, setCurrentWeek] = useState(0)

	const [selected, setSelected] = useState(false)

	const [teacher, setTeacher] = useState('')

	const loadSchedule = async () => {
		setLoading(true)

		try {
			const res = await api.get(
				`${API}/schedule-lessons${
					teacher && selected ? '/teacher' : ''
				}?week_offset=${current_week}${
					teacher && selected ? `&mmis_name=${encodeURIComponent(teacher)}` : ''
				}`,
				{
					withCredentials: true,
					headers: {},
				},
			)

			const data = res.data

			setAllScheduleData(data)

			const normalized = {}

			Object.entries(data?.schedule || {}).forEach(([date, lessons]) => {
				const shortDate = date.split('T')[0]

				// Объединяем уроки по ключевым полям
				const map = {}

				lessons.forEach(lesson => {
					const key = [
						lesson.start_time,
						lesson.end_time,
						lesson.subject_name,
						lesson.lesson_type,
						lesson.teacher_full_name,
						lesson.classroom,
					].join('|')

					if (!map[key]) {
						map[key] = {
							...lesson,
							group_names: [lesson.group_name],
							subgroups: lesson.subgroup != null ? [lesson.subgroup] : [],
						}
					} else {
						// Если есть подгруппа, добавляем
						if (lesson.subgroup != null)
							map[key].subgroups.push(lesson.subgroup)
						// Группы собираем всегда
						map[key].group_names.push(lesson.group_name)
					}
				})

				// Формируем финальный массив для даты
				normalized[shortDate] = Object.values(map).map(lesson => {
					// Формируем строку подгрупп
					const subgroupsStr =
						lesson.subgroups.length > 0
							? lesson.subgroups
									.sort((a, b) => a - b)
									.map(sg => `${sg}-я подгруппа`)
									.join(', ')
							: null

					return {
						start_time: lesson.start_time.slice(0, 5),
						end_time: lesson.end_time.slice(0, 5),
						title: `${lesson.subject_name} (${lesson.lesson_type})`,
						description:
							role === 'student'
								? lesson.teacher_full_name
								: lesson.group_names.join(', '),
						auditory_name: lesson.classroom,
						subgroup: subgroupsStr,
						raw: lesson,
					}
				})
			})

			setScheduleData(normalized)

			setLoading(false)
		} catch (e) {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadSchedule()
	}, [current_week])

	useEffect(() => {
		if (!selected || (selected && teacher)) {
			loadSchedule()
		}
	}, [selected, teacher])

	return (
		<div className='flex flex-col gap-2 p-4 max-md:mb-20 md:min-h-[calc(100vh-100px)] '>
			<div className='hidden'>
				<DirectionOfTraining group={'2211-0101.1'} course={3} DofT={'ИБ'} />
			</div>
			<>
				{loading && (
					<div className='fixed inset-0 flex items-center justify-center z-[9999]'>
						<Loader />
					</div>
				)}

				<div className={`${loading ? 'pointer-events-none opacity-30' : ''}`}>
					<div className='lg:hidden'>
						<Schedule2
							scheduleData={scheduleData}
							Offset={data => setCurrentWeek(data)}
							prev_active={allScheduleData?.has_prev}
							next_active={allScheduleData?.has_next}
							selectedOffset={current_week}
							WeekNumber={allScheduleData?.current_week_number}
							role={role}
							onClick={data => {
								setTeacher(data)
							}}
							onSelected={data => setSelected(data)}
							academic_year={allScheduleData?.academic_year}
							semester={allScheduleData?.semester}
						/>
					</div>
					<div className='max-lg:hidden'>
						<Schedule1
							scheduleData={scheduleData}
							Offset={data => setCurrentWeek(data)}
							prev_active={allScheduleData?.has_prev}
							next_active={allScheduleData?.has_next}
							selectedOffset={current_week}
							WeekNumber={allScheduleData?.current_week_number}
							role={role}
							onClick={data => {
								setTeacher(data)
							}}
							onSelected={data => setSelected(data)}
							academic_year={allScheduleData?.academic_year}
							semester={allScheduleData?.semester}
						/>
					</div>
				</div>
			</>
		</div>
	)
}

export default SchedulePage
