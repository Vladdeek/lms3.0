import {
	format,
	startOfWeek,
	addDays,
	isToday,
	isWeekend,
	isWithinInterval,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import DirectionOfTraining from '../components/DirectionOfTraining'
import { useEffect, useState } from 'react'
import { API } from '../API'

const scheduleData = {
	'2025-09-18': [
		{
			time: '9:00',
			title: 'Основы программирования',
			description: 'Лекция',
			type: 'lecture',
		},
		{
			time: '10:40',
			title: 'Алгоритмы и структуры данных',
			description: 'Практика',
			type: 'practice',
		},
	],
	// ... остальные данные
}

const ScheduleCard = ({ lessonIndex, isCurrent, time, title, description }) => {
	return (
		<div
			key={lessonIndex}
			className={`bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 w-full flex flex-col gap-2 ${
				isCurrent ? 'ring-4 ring-[var(--hero-epta)]' : ''
			}`}
		>
			<p className='px-2 rounded-md bg-[var(--hero-epta)] text-white w-fit text-sm'>
				{time}
			</p>
			<p className='text-[var(--black)] font-bold text-lg'>{title}</p>
			<p className='text-[var(--middle)] font-light text-sm'>{description}</p>
		</div>
	)
}

const DayCard = ({ isCurrentDay, isWeekendDay, day, month, weekDay }) => {
	return (
		<div
			className={` rounded-xl shadow-[var(--shadow)] flex items-center justify-center gap-3 text-[var(--black)] font-medium w-full p-4 ${
				isCurrentDay ? 'bg-[var(--hero-epta)] text-white' : 'bg-[var(--white)]'
			} ${isWeekendDay ? 'opacity-60' : ''}`}
		>
			<div className='flex flex-col items-center justify-center'>
				<p className='text-8xl'>{day}</p>
				<p className='text-2xl'>{month}</p>
			</div>
			<p className='text-7xl'>{weekDay}</p>
		</div>
	)
}

const Schedule = () => {
	const today = new Date()
	const weekStart = startOfWeek(today, { weekStartsOn: 1 })
	const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i))

	const [scheduleData1, setScheduleData1] = useState()

	const daySchedule = []

	useEffect(() => {
		const fetchSchedule = async () => {
			const res = await fetch(`https:///courses/`)
			const data = await res.json()

			setScheduleData1(data)
		}
	}, [])

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
		<div className='grid grid-cols-6 gap-2 p-4 h-screen'>
			<div className='col-span-1'>
				<DirectionOfTraining group={'2211-0101.1'} course={3} DofT={'ИБ'} />
			</div>

			<div className='col-span-5 grid grid-cols-5 gap-2'>
				{weekDays.map((day, index) => {
					const dateString = format(day, 'yyyy-MM-dd')
					const daySchedule = scheduleData[dateString] || []
					const isCurrentDay = isToday(day)
					const isWeekendDay = isWeekend(day)

					return (
						<div key={index} className='flex flex-col gap-4'>
							<DayCard
								isCurrentDay={isCurrentDay}
								isWeekendDay={isWeekendDay}
								day={format(day, 'd')}
								month={format(day, 'MMMM', { locale: ru })}
								weekDay={format(day, 'EEEEEE', { locale: ru }).toUpperCase()}
							/>
							<div className='flex flex-col gap-3'>
								{daySchedule.length > 0 ? (
									daySchedule.map((lesson, lessonIndex) => {
										const isCurrent = isCurrentLesson(day, lesson.time)

										return (
											<ScheduleCard
												lessonIndex={lessonIndex}
												isCurrent={isCurrent}
												time={lesson.time}
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
		</div>
	)
}

export default Schedule
