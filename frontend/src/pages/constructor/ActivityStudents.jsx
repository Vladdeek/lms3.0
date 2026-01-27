import { Group } from 'lucide-react'
import { RadioButton } from '../../components/Buttons'
import { useState } from 'react'
import { OptionInput2 } from '../../components/Inputs'

const TableEl = ({ name, group, lecture, activity, last_activity }) => {
	return (
		<div className='w-full text-[var(--black)] flex bg-[var(--white)] rounded-lg items-center justify-center shadow-[var(--shadow)] h-10 px-4'>
			<p className='w-1/4 h-full flex items-center justify-center'>{name}</p>
			<p className='w-1/4 h-full flex items-center justify-center bg-[var(--light-light-gray)]'>
				{group}
			</p>
			<p className='w-1/4 h-full flex items-center justify-center'>{lecture}</p>
			<p className='w-1/4 h-full flex items-center justify-center bg-[var(--light-light-gray)]'>
				{activity} мин.
			</p>
			<p className='w-1/4 h-full flex items-center justify-center'>
				{last_activity}
			</p>
		</div>
	)
}
const ActivityStudents = () => {
	const mass = [
		{
			id: 1,
			name: 'Пацан номер 1',
			group: '2211-0101.1',
			lecture: 'лекция 1',
			activity: 32,
			last_activity: '23.12.25',
		},
		{
			id: 2,
			name: 'Пацан номер 2',
			group: '2211-0101.1',
			lecture: 'лекция 2',
			activity: 41,
			last_activity: '29.12.25',
		},
		{
			id: 3,
			name: 'Пацан номер 3',
			group: '2211-0101.1',
			lecture: 'лекция 5',
			activity: 59,
			last_activity: '26.01.26',
		},
		{
			id: 4,
			name: 'Пацан номер 2',
			group: '2211-0101.1',
			lecture: 'лекция 2',
			activity: 26,
			last_activity: '30.12.25',
		},
		{
			id: 5,
			name: 'Пацан номер 4',
			group: '2211-0101.1',
			lecture: 'лекция 1',
			activity: 12,
			last_activity: '26.12.25',
		},
		{
			id: 1,
			name: 'Пацан номер 5',
			group: '2211-0101.1',
			lecture: 'лекция 3',
			activity: 43,
			last_activity: '15.01.26',
		},
	]

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

	return (
		<div>
			<div className='flex justify-between w-full mb-2'>
				<OptionInput2
					Options={groups}
					color='white'
					placeholder={'Группа'}
					onChange={data => setSelectedGroup(data)}
					value={selectedGroup}
					width='w-[141px]'
				/>
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
					{mass?.map(item => (
						<TableEl
							name={item?.name}
							group={item?.group}
							lecture={item?.lecture}
							activity={item?.activity}
							last_activity={item?.last_activity}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
export default ActivityStudents
