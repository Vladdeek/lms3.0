import {
	format,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	isToday,
	addWeeks,
	subWeeks,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import { useState } from 'react'
import { CalendarRange, ChevronLeft, ChevronRight } from 'lucide-react'
import { ArrowL, ArrowR } from '../../public/assets/icons/ArrowsSvg'
import { Button } from './Buttons'

const Event = ({ time, title, today = false, now = false }) => {
	return (
		<>
			<div
				className={`flex flex-col gap-3 px-3 py-6 border-r-1 border-l-1  ${
					!today
						? 'border-[var(--light-ghost-black)] text-[var(--light-ghost-black)]'
						: 'border-[var(--text)] text-[var(--text)]'
				}`}
			>
				<p
					className={`font-medium text-base ${now && 'text-[var(--primary)]'}`}
				>
					{time}
				</p>
				<p className='font-bold text-xl '>{title}</p>
			</div>
		</>
	)
}

const Calendar = () => {
	const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
	const [currentDate, setCurrentDate] = useState(new Date())

	const Events = new Map()
	Events['2025-08-04'] = [
		{ timeStart: '10:00', timeEnd: '11:00', title: 'Node.js основы' },
	]
	Events['2025-08-06'] = [
		{ timeStart: '10:00', timeEnd: '11:00', title: 'Node.js основы' },
		{ timeStart: '11:00', timeEnd: '12:00', title: 'Node.js основы' },
		{ timeStart: '12:00', timeEnd: '13:00', title: 'Node.js основы' },
	]
	Events['2025-08-07'] = [
		{ timeStart: '10:00', timeEnd: '11:00', title: 'Node.js основы' },
	]
	Events['2025-08-09'] = [
		{ timeStart: '10:00', timeEnd: '11:00', title: 'Node.js основы' },
		{ timeStart: '11:00', timeEnd: '12:00', title: 'Node.js основы' },
	]

	const events = {
		'2025-08-05': [
			{ timeStart: '10:00', timeEnd: '11:00', title: 'Node.js основы' },
		],
		'2025-08-06': [
			{ timeStart: '10:00', timeEnd: '11:00', title: 'Node.js основы' },
			{ timeStart: '11:00', timeEnd: '12:00', title: 'Node.js основы' },
			{ timeStart: '12:00', timeEnd: '13:00', title: 'Node.js основы' },
		],
		'2025-08-07': [
			{ timeStart: '10:00', timeEnd: '11:00', title: 'Node.js основы' },
			{ timeStart: '11:00', timeEnd: '12:00', title: 'Node.js основы' },
			{ timeStart: '12:00', timeEnd: '13:00', title: 'Node.js основы' },
			{ timeStart: '13:00', timeEnd: '14:00', title: 'Node.js основы' },
			{ timeStart: '14:00', timeEnd: '15:00', title: 'Node.js основы' },
			{ timeStart: '15:00', timeEnd: '16:00', title: 'Node.js основы' },
		],

		'2025-08-08': [
			{ timeStart: '10:00', timeEnd: '11:00', title: 'Node.js основы' },
			{ timeStart: '11:00', timeEnd: '12:00', title: 'Node.js основы' },
		],
		'2025-08-09': [
			{ timeStart: '10:00', timeEnd: '11:00', title: 'Node.js основы' },
		],
	}

	const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
	const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
	const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

	const prevWeek = () => {
		setCurrentDate(prev => subWeeks(prev, 1))
	}

	const nextWeek = () => {
		setCurrentDate(prev => addWeeks(prev, 1))
	}

	return (
		<div className='p-4'>
			<div className='flex justify-between items-center mb-10'>
				<div className='flex items-center gap-4 w-fit '>
					<ArrowL onClick={prevWeek} />

					<p className='text-[20px] font-medium text-[var(--text)]'>
						{format(weekStart, 'd', { locale: ru })} -
						{format(weekEnd, 'd MMMM', { locale: ru })}
					</p>
					<ArrowR onClick={nextWeek} />
				</div>
				<Button>
					<p>Добавить событие </p>
					<CalendarRange size={36} strokeWidth={2} />
				</Button>
			</div>

			<div className='grid grid-cols-7 gap-4 text-[var(--color1)] mb-4 font-semibold'>
				{weekDays.map((date, index) => {
					const today = isToday(date)
					const day = weekdays[index]

					return (
						<div className='col-span-1' key={format(date, 'yyyy-MM-dd')}>
							<div className='glass px-6 py-5 mb-6'>
								<div
									className={`flex flex-col gap-4 ${
										today ? 'text-[var(--primary)]' : 'text-[var(--text)]'
									}`}
								>
									<p className='text-[20px] unbounded font-medium uppercase'>
										{day}
									</p>
									<div className='flex justify-center text-[64px] unbounded font-medium leading-none'>
										<p>{format(date, 'd')}</p>
									</div>
								</div>
							</div>
							<div className='flex flex-col gap-[6px]'>
								{(events[format(date, 'yyyy-MM-dd')] || []).map(event => {
									const now = new Date()
									const currentMinutes = now.getHours() * 60 + now.getMinutes()

									const [startH, startM] = event.timeStart
										.split(':')
										.map(Number)
									const [endH, endM] = event.timeEnd.split(':').map(Number)

									const startMinutes = startH * 60 + startM
									const endMinutes = endH * 60 + endM

									const isNow =
										currentMinutes >= startMinutes &&
										currentMinutes < endMinutes

									return (
										<Event
											key={`${event.timeStart}-${event.title}`}
											time={event.timeStart}
											title={event.title}
											today={today}
											now={today && isNow}
										/>
									)
								})}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Calendar
