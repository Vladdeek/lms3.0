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
} from 'date-fns'
import { ru } from 'date-fns/locale'
import DirectionOfTraining from '../components/DirectionOfTraining'
import { useEffect, useMemo, useState } from 'react'
import { API } from '../API'
import { getCookie } from '../TOKEN'
import Loader from '../components/Loader'
import axios from 'axios'

const ScheduleCard1 = ({
	lessonIndex,
	isCurrent,
	time_start,
	time_end,
	title,
	description,
}) => {
	return (
		<div
			key={lessonIndex}
			className={`bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 w-full flex flex-col gap-2 ${
				isCurrent ? 'ring-4 ring-[var(--hero-epta)]' : ''
			}`}
		>
			<p className=' xl:text-sm text-xs text-[var(--black)]'>
				<span className='px-2 pb-0.75 pt-1.25 rounded-md bg-[var(--hero-epta)] text-white w-fit'>
					{time_start}
				</span>
				—
				<span className='px-2 pb-0.75 pt-1.25 rounded-md bg-[var(--hero-epta)] text-white w-fit'>
					{time_end}
				</span>
			</p>

			<p className='text-[var(--black)] font-bold xl:text-lg text-md'>
				{title}
			</p>
			<p className='text-[var(--middle)] font-light xl:text-sm text-xs'>
				{description}
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
				<p className='xl:text-8xl text-6xl'>{day}</p>
				<p className='xl:text-2xl text-lg'>{month}</p>
			</div>
			<p className='xl:text-7xl text-5xl'>{weekDay}</p>
		</div>
	)
}

const ScheduleCard2 = ({
	lessonIndex,
	isCurrent,
	time_start,
	time_end,
	title,
	description,
}) => {
	return (
		<div
			key={lessonIndex}
			className={`bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 w-full flex flex-col gap-2 ${
				isCurrent ? 'ring-4 ring-[var(--hero-epta)]' : ''
			}`}
		>
			<p className=' xl:text-sm text-xs text-[var(--black)]'>
				<span className='px-2 pb-0.75 pt-1.25 rounded-md bg-[var(--hero-epta)] text-white w-fit'>
					{time_start}
				</span>
				—
				<span className='px-2 pb-0.75 pt-1.25 rounded-md bg-[var(--hero-epta)] text-white w-fit'>
					{time_end}
				</span>
			</p>
			<p className='text-[var(--black)] font-bold text-lg'>{title}</p>
			<p className='text-[var(--middle)] font-light text-sm'>{description}</p>
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

const Schedule1 = scheduleData => {
	const today = new Date()
	const weekStart = startOfWeek(today, { weekStartsOn: 1 })
	const weekDays = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i))

	const [scheduleData1, setScheduleData1] = useState()

	const daySchedule = []

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

	return (
		<div className=' grid grid-cols-6 gap-2'>
			{weekDays.map((day, index) => {
				const dateString = format(day, 'yyyy-MM-dd')
				const daySchedule = scheduleData?.scheduleData[dateString] || []
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
									const isCurrent = isCurrentLesson(day, lesson.time_start)

									return (
										<ScheduleCard1
											lessonIndex={lessonIndex}
											isCurrent={isCurrent}
											time_start={lesson.time_start}
											time_end={lesson.time_end}
											title={lesson.title}
											description={lesson.description}
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
	)
}

const Schedule2 = scheduleData => {
	const daysCount = 6
	// today
	const today = startOfToday()

	console.log('scheduleData2: ', scheduleData)

	// генерируем weekDays: массив из daysCount дат, начиная с today
	const weekDays = useMemo(
		() => Array.from({ length: daysCount }, (_, i) => addDays(today, i)),
		[daysCount, today]
	)

	// selectedDay по умолчанию — сегодня если он есть в weekDays, иначе первый элемент
	const [selectedDay, setSelectedDay] = useState(
		weekDays.find(d => isSameDay(d, today)) || weekDays[0]
	)

	const isCurrentLesson = (lessonDate, lessonTime) => {
		try {
			const [hours, minutes] = lessonTime.split(':').map(Number)
			const lessonStart = new Date(lessonDate)
			lessonStart.setHours(hours, minutes, 0, 0)

			const lessonEnd = new Date(lessonStart.getTime() + 90 * 60000) // 90 минут

			return isWithinInterval(new Date(), {
				start: lessonStart,
				end: lessonEnd,
			})
		} catch (error) {
			return false
		}
	}

	// расписание для выбранного дня
	const selectedDateString = format(selectedDay, 'yyyy-MM-dd')
	const selectedDaySchedule =
		scheduleData?.scheduleData[selectedDateString] || []

	return (
		<div className='grid grid-cols-6 gap-2'>
			{/* Дни */}
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
					selectedDaySchedule?.map((lesson, lessonIndex) => {
						const isCurrent = isCurrentLesson(selectedDay, lesson?.time_start)

						return (
							<ScheduleCard2
								key={lessonIndex}
								lessonIndex={lessonIndex}
								isCurrent={isCurrent}
								time_start={lesson.time_start}
								time_end={lesson.time_end}
								title={lesson.title}
								description={lesson.description}
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
	)
}

const SchedulePage = () => {
	const [scheduleData, setScheduleData] = useState({})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		console.log('Начинаем загрузку расписания для группы')
		const loadSchedule = async () => {
			setLoading(true)
			console.log('1) начало')
			try {
				const res = await axios.get(`${API}/schedule-lessons`, {
					withCredentials: true,
					headers: {
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				})

				const data = res.data

				console.log('2) данные: ', data)

				const normalized = {}

				Object.entries(data).forEach(([date, lessons]) => {
					const shortDate = date.split('T')[0] // 2025-11-17

					normalized[shortDate] = lessons.map(lesson => ({
						time_start: lesson.time_start.slice(0, 5), // 08:00
						time_end: lesson.time_end.slice(0, 5), // 09:20
						title: `${lesson.subject} (${lesson.lesson_type})`,
						description: `${lesson.teacher_name}, ауд. ${lesson.auditory_name}`,
						raw: lesson,
					}))
				})

				console.log('3) нормализованные данные: ', normalized)

				setScheduleData(normalized)
				setLoading(false)

				console.log('4) конец загрузки')
			} catch (e) {
				console.error(e)
				setError(e.response ? String(e.response.status) : '500')
				setLoading(false)
			}
		}

		loadSchedule()
	}, [])

	return (
		<div className='flex flex-col gap-2 p-4 h-screen'>
			<div className='hidden'>
				<DirectionOfTraining group={'2211-0101.1'} course={3} DofT={'ИБ'} />
			</div>
			{loading ? (
				<Loader />
			) : (
				<>
					<div className='lg:hidden'>
						<Schedule2 scheduleData={scheduleData} />
					</div>
					<div className='max-lg:hidden'>
						<Schedule1 scheduleData={scheduleData} />
					</div>
				</>
			)}
		</div>
	)
}

export default SchedulePage
