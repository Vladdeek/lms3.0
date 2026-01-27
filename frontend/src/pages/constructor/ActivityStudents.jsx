import { Group } from 'lucide-react'
import { RadioButton } from '../../components/Buttons'
import { useEffect, useRef, useState } from 'react'
import { OptionInput2, SearchInput } from '../../components/Inputs'
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
				hour: '2-digit',
				minute: '2-digit',
			})
			.replace(',', '')
	}
	return (
		<div className='w-full text-[var(--black)] flex bg-[var(--white)] rounded-lg items-center justify-center shadow-[var(--shadow)] h-10 px-4'>
			<p className='w-1/4 h-full flex items-center justify-center'>{name}</p>
			<p className='w-1/4 h-full flex items-center justify-center bg-[var(--light-light-gray)]'>
				{group}
			</p>
			<p className='w-1/4 h-full flex items-center justify-center'>{lecture}</p>
			<p className='w-1/4 h-full flex items-center justify-center bg-[var(--light-light-gray)]'>
				{formatDuration(activity)}
			</p>

			<p className='w-1/4 h-full flex items-center justify-center'>
				{formatDateTime(last_activity)}
			</p>
		</div>
	)
}
const ActivityStudents = () => {
	const { courseId } = useParams()

	const groups = ['2211-0101.1', '2211-0101.2', '2211-0101.3', '2211-0101.4']
	const filter = [
		'По имени',
		'По дате',
		'По группе',
		'По активности',
		'По занятиям',
	]

	const [selectedGroup, setSelectedGroup] = useState(null)
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

		console.log('FETCH STUDENTS', { courseId, term })

		const url = `${API}/courses/${courseId}/time`

		try {
			const res = await api.get(url, {
				params: term ? { search: term } : {},
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			setStudents(res.data)
		} catch (error) {
			console.error('fetchStudents error', error)
		} finally {
			setIsSearchLoading(null)
		}
	}

	return (
		<div>
			<div className='flex justify-between w-full mb-2'>
				<div className='flex gap-2 h-full items-center w-2/5'>
					<OptionInput2
						Options={groups}
						color='white'
						placeholder={'Группа'}
						onChange={data => setSelectedGroup(data)}
						value={selectedGroup}
						width='w-[141px]'
					/>
					<SearchInput
						width={'100%'}
						height={40}
						onChange={e => setSearchStudents(e.target.value)}
						value={searchStudents}
						loading={isSearchLoading === 0}
					/>
				</div>

				<OptionInput2
					Options={filter}
					color='white'
					placeholder={'Фильтр'}
					onChange={data => setSelectedFilter(data)}
					value={selectedFilter}
					width='w-[178px]'
				/>
			</div>
			<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-xl w-full md:min-h-[calc(80vh-100px)] overflow-hidden flex flex-col p-2'>
				<div className='w-full flex bg-[var(--white)] rounded-lg items-center justify-center shadow-[var(--shadow)] text-[var(--black)] h-12 px-4'>
					<p className='w-1/4 h-full flex items-center justify-center'>ФИО</p>
					<p className='w-1/4 h-full flex items-center justify-center'>
						Группа
					</p>
					<p className='w-1/4 h-full flex items-center justify-center'>
						Занятие
					</p>
					<p className='w-1/4 h-full flex items-center justify-center'>
						Время нахождения
					</p>
					<p className='w-1/4 h-full flex items-center justify-center'>
						Последняя активность
					</p>
				</div>
				<div className='flex flex-col p-2 gap-2'>
					{students?.map(item => (
						<TableEl
							name={`${item?.last_name} ${item?.first_name[0]}.  ${item?.middle_name[0]}.`}
							group={item?.group_name}
							lecture={item?.module_section_title}
							activity={item?.session_time}
							last_activity={item?.end_date}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
export default ActivityStudents
