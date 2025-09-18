import { useState } from 'react'
import {
	format,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	isToday,
	isSameMonth,
	addMonths,
	subMonths,
	addDays,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

const MiniCalendar = () => {
	const [currentMonth, setCurrentMonth] = useState(new Date())

	const monthStart = startOfMonth(currentMonth)
	const monthEnd = endOfMonth(currentMonth)
	const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1, locale: ru })
	const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1, locale: ru })

	const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

	const handlePrev = () => setCurrentMonth(subMonths(currentMonth, 1))
	const handleNext = () => setCurrentMonth(addMonths(currentMonth, 1))

	// Исправлено: используем addDays для получения дней недели
	const weekStart = startOfWeek(new Date(), { weekStartsOn: 1, locale: ru })
	const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

	return (
		<div className='bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 w-full flex flex-col items-center'>
			<div className='flex justify-between items-center w-full mb-2 text-[var(--black)]'>
				<button
					onClick={handlePrev}
					className='px-2 py-1 rounded hover:bg-[var(--bg)]'
				>
					<ChevronLeft />
				</button>
				<span className='font-medium text-lg'>
					{format(currentMonth, 'LLLL yyyy', { locale: ru })}
				</span>
				<button
					onClick={handleNext}
					className='px-2 py-1 rounded hover:bg-[var(--bg)]'
				>
					<ChevronRight />
				</button>
			</div>
			<div className='grid grid-cols-7 gap-x-4 mb-1 w-full'>
				{weekDays.map((day, idx) => (
					<div
						key={idx}
						className='text-sm font-light text-center text-[var(--black)] justify-center px-[10px]'
					>
						{day}
					</div>
				))}
			</div>
			<div className='grid grid-cols-7 gap-x-4 gap-y-[3px] w-full text-base'>
				{days.map(day => (
					<div
						key={format(day, 'yyyy-MM-dd')}
						className={`
                            flex items-center justify-center aspect-square rounded-lg cursor-pointer
                            ${
															isToday(day)
																? 'bg-[var(--hero-epta)] text-white font-medium'
																: ''
														}
                            ${
															!isSameMonth(day, currentMonth)
																? 'opacity-40'
																: 'text-[var(--black)]'
														}
                            hover:bg-[var(--hero-epta)] p-[10px] hover:text-white transition text-[var(--black)]
                        `}
					>
						{format(day, 'd')}
					</div>
				))}
			</div>
		</div>
	)
}

export default MiniCalendar
