import { ChevronDown, Filter, FilterIcon, Funnel, Group } from 'lucide-react'
import { RadioButton } from '../../components/Buttons'
import { useEffect, useRef, useState } from 'react'
import {
	FilterOptionInput,
	OptionInput2,
	SearchInput,
} from '../../components/Inputs'
import api, { API } from '../../API'
import { useParams } from 'react-router-dom'
import { use } from 'react'
import { getCookie } from '../../TOKEN'

const TableEl = ({ name, group, lecture, activity, last_activity }) => {
	const formatDuration = (seconds = 0) => {
		if (seconds < 60) return `${seconds} сек`

		const mins = Math.floor(seconds / 60)
		if (mins < 60) return `${mins} мин`

		const hours = Math.floor(mins / 60)
		if (hours < 24) return `${hours} ч ${mins % 60} мин`

		const days = Math.floor(hours / 24)
		return `${days} д ${hours % 24} ч`
	}

	const formatDateTime = isoString => {
		if (!isoString) return '—'

		const date = new Date(isoString)

		return date
			.toLocaleString('ru-RU', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
				// hour: '2-digit',
				// minute: '2-digit',
			})
			.replace(',', '')
	}
	return (
		<>
			<div className='max-lg:hidden w-full text-[var(--black)] flex bg-[var(--white)] rounded-lg items-center justify-center shadow-[var(--shadow)] h-10 px-4'>
				<p className='w-1/4 h-full flex items-center justify-center'>{name}</p>
				<p className='w-1/4 h-full flex items-center justify-center bg-[var(--light-light-gray)]'>
					{group}
				</p>
				<p className='w-1/4 h-full flex items-center justify-center'>
					{lecture}
				</p>
				<p className='w-1/4 h-full flex items-center justify-center bg-[var(--light-light-gray)]'>
					{formatDuration(activity)}
				</p>

				<p className='w-1/4 h-full flex items-center justify-center'>
					{formatDateTime(last_activity)}
				</p>
			</div>
			<div className='min-lg:hidden w-full rounded-lg shadow-[var(--shadow)] p-4 flex justify-between items-start transition-transform transform hover:scale-105 hover:shadow-2xl'>
				{/* Левый блок */}
				<div className='flex flex-col gap-1'>
					<p className='font-semibold text-lg text-[var(--black)]'>
						{name}{' '}
						<span className='font-normal text-[var(--middle)]'>({group})</span>
					</p>
					<p className='text-[var(--middle)] font-medium text-sm'>
						Занятие: {lecture}
					</p>
				</div>

				{/* Правый блок */}
				<div className='flex flex-col items-end gap-1'>
					<p className='font-medium text-[var(--black)] flex items-center'>
						Активность:
						<span className='ml-1 font-semibold bg-[var(--green-status-bg)] text-[var(--green-status-text)] px-2 rounded-md whitespace-nowrap'>
							{formatDuration(activity)}
						</span>
					</p>
					<p className='text-[var(--middle)] text-sm '>
						{formatDateTime(last_activity)}
					</p>
				</div>
			</div>
		</>
	)
}
const ActivityStudents = () => {
	const { courseId } = useParams()

	const [groups, setGroups] = useState([])
	const [lessons, setLessons] = useState({})
	const filter = {
		'Имя (А–Я)': { student_name_order: 'asc' },
		'Имя (Я–А)': { student_name_order: 'desc' },

		'Дата (сначала новые)': { module_section_date_order: 'desc' },
		'Дата (сначала старые)': { module_section_date_order: 'asc' },

		'Активность (по убыванию)': { session_time_order: 'desc' },
		'Активность (по возрастанию)': { session_time_order: 'asc' },

		'Занятие (по убыванию)': { module_section_title_order: 'desc' },
		'Занятие (по возрастанию)': { module_section_title_order: 'asc' },
	}

	const [selectedGroup, setSelectedGroup] = useState(null)
	const [selectedLesson, setSelectedLesson] = useState(null)
	const [selectedFilter, setSelectedFilter] = useState(null)

	const [searchStudents, setSearchStudents] = useState('')
	const [isSearchLoading, setIsSearchLoading] = useState(null)
	const [students, setStudents] = useState([])

	const studentsDebounce = useRef(null)

	useEffect(() => {
		if (!courseId) return

		if (studentsDebounce.current) {
			clearTimeout(studentsDebounce.current)
		}

		studentsDebounce.current = setTimeout(() => {
			fetchStudents(searchStudents)
		}, 500)

		return () => clearTimeout(studentsDebounce.current)
	}, [searchStudents, courseId])

	const fetchStudents = async (term = '') => {
		if (!courseId) return

		const lessonKeys = Object.keys(lessons)

		const lessonKey =
			selectedLesson !== null && selectedLesson !== undefined
				? lessonKeys[selectedLesson]
				: null

		console.log(lessonKey) // "123123"
		console.log(lessons[lessonKey]) // нужный id

		const params = {
			...(term && { term }),

			...(selectedGroup && {
				group_name: groups[selectedGroup],
			}),

			...(lessonKey && {
				module_section_id: lessons[lessonKey],
			}),
			...(selectedFilter && filter[selectedFilter]),
		}

		try {
			const res = await api.get(`${API}/courses/${courseId}/time`, {
				params,
				withCredentials: true,
				headers: {
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			setStudents(res.data)
		} catch (e) {
			console.error('fetchStudents error', e)
		} finally {
			setIsSearchLoading(false)
		}
	}
	useEffect(() => {
		const fetchLinkedGroups = async () => {
			try {
				const res = await api.get(
					`${API}/courses/student-group/linked/?course_id=${courseId}`,
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
							'X-CSRF-TOKEN': getCookie('csrftoken'),
						},
					},
				)

				setGroups(res.data.items.map(item => item.name))
			} catch (error) {}
		}
		fetchLinkedGroups()
	}, [])
	useEffect(() => {
		const fetchLessons = async () => {
			try {
				const res = await api.get(`${API}/courses/${courseId}/lessons`, {
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				})

				setLessons(res.data)
			} catch (error) {}
		}
		fetchLessons()
	}, [])

	useEffect(() => {
		fetchStudents()
	}, [selectedGroup, selectedFilter, selectedLesson])

	const [isOpen, setIsOpen] = useState(false)

	return (
		<div>
			<div className='lg:flex hidden justify-between gap-2 w-full mb-2'>
				<div className='flex gap-2 h-full items-center min-[1800px]:w-2/5 w-full'>
					<FilterOptionInput
						Options={groups}
						color='white'
						placeholder={'Группа'}
						onChange={data => setSelectedGroup(data)}
						value={selectedGroup}
						width='w-[175px]'
					/>
					<FilterOptionInput
						Options={Object.keys(lessons)}
						color='white'
						placeholder={'Занятие'}
						onChange={setSelectedLesson}
						value={selectedLesson}
						width='w-[225px]'
						showReset={true}
					/>
					<SearchInput
						width={'100%'}
						height={40}
						onChange={e => setSearchStudents(e.target.value)}
						value={searchStudents}
						loading={isSearchLoading === 0}
						showReset={true}
					/>
				</div>

				<FilterOptionInput
					Options={Object.keys(filter)}
					placeholder='Фильтр'
					value={selectedFilter}
					onChange={setSelectedFilter}
					width='w-[275px]'
					showReset={true}
				/>
			</div>
			<div className='flex justify-between gap-2 w-full mb-2 lg:hidden'>
				<div className='flex gap-2 h-full items-center min-[1800px]:w-2/5 w-full'>
					<SearchInput
						width={'100%'}
						height={40}
						onChange={e => setSearchStudents(e.target.value)}
						value={searchStudents}
						loading={isSearchLoading === 0}
						showReset={true}
					/>
				</div>
				<div className='relative select-none'>
					<div
						onClick={() => setIsOpen(prev => !prev)}
						className={`bg-[var(--white)] text-[var(--black)] flex justify-between gap-2 items-center rounded-lg shadow-[var(--shadow)] cursor-pointer px-4 py-2 font-medium`}
					>
						<p>Фильтры</p>
						<FilterIcon className={`transition-all`} />
					</div>

					{isOpen && (
						<div
							className='absolute bg-[var(--white)] flex flex-col gap-3 p-2 rounded-xl shadow-[var(--shadow)]
		h-40  hide-scrollbar w-75 right-0  top-11 z-5 text-[var(--black)]'
						>
							<FilterOptionInput
								Options={groups}
								color='white'
								placeholder={'Группа'}
								onChange={data => setSelectedGroup(data)}
								value={selectedGroup}
								width='w-full'
							/>
							<FilterOptionInput
								Options={Object.keys(lessons)}
								color='white'
								placeholder={'Занятие'}
								onChange={setSelectedLesson}
								value={selectedLesson}
								width='w-full'
								showReset={true}
							/>
							<FilterOptionInput
								Options={Object.keys(filter)}
								placeholder='Сортировка'
								value={selectedFilter}
								onChange={setSelectedFilter}
								width='w-full'
								showReset={true}
							/>
						</div>
					)}
				</div>
			</div>
			<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-xl w-full md:min-h-[calc(77.5vh-100px)] overflow-hidden flex flex-col p-2'>
				<div className='max-lg:hidden w-full flex bg-[var(--white)] rounded-lg items-center justify-center shadow-[var(--shadow)] text-[var(--black)] h-12 px-4'>
					<p className='w-1/4 h-full flex items-center justify-center overflow-hidden'>
						<span className='truncate'>ФИО</span>
					</p>

					<p className='w-1/4 h-full flex items-center justify-center overflow-hidden'>
						<span className='truncate'>Группа</span>
					</p>

					<p className='w-1/4 h-full flex items-center justify-center overflow-hidden'>
						<span className='truncate'>Занятие</span>
					</p>

					<p className='w-1/4 h-full flex items-center justify-center overflow-hidden'>
						<span className='truncate'>Время нахождения</span>
					</p>

					<p className='w-1/4 h-full flex items-center justify-center overflow-hidden'>
						<span className='truncate'>Последняя активность</span>
					</p>
				</div>
				<div className='flex flex-col p-2 gap-2'>
					{students?.length === 0 ? (
						<p className='text-center text-2xl text-[var(--middle)]'>Пусто</p>
					) : (
						students?.map(item => (
							<TableEl
								name={`${item?.last_name} ${item?.first_name[0]}.  ${item?.middle_name[0]}.`}
								group={item?.group_name}
								lecture={item?.module_section_title}
								activity={item?.session_time}
								last_activity={item?.end_date}
							/>
						))
					)}
				</div>
			</div>
		</div>
	)
}
export default ActivityStudents
