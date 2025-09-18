import { Ban, ChevronsRight, GripVertical } from 'lucide-react'
import { FilterButton } from '../../components/Buttons'
import { SearchInput } from '../../components/Inputs'
import { useState } from 'react'
import { groups } from '../../data/groups'
import { students } from '../../data/students'

const GroupComponent = ({
	number,
	lvl,
	course,
	studentsLength,
	performance,
	onRemove,
	onAdd,
	dragged,
	Accessed,
	onDragStart,
	onDragEnd,
}) => {
	return (
		<div
			className=' bg-[var(--white)] shadow-[var(--shadow)] grid grid-cols-12 rounded-lg py-[10px]'
			draggable
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
		>
			<p className='col-span-2 text-center'>{number}</p>
			<p className='col-span-2 text-center'>{lvl}</p>
			<p className='col-span-2 text-center'>{course}</p>
			<p className='col-span-2 text-center'>{studentsLength}</p>
			<p className='col-span-3 text-center'>{performance}</p>
			<p className='col-span-1 text-center flex justify-center gap-3'>
				<GripVertical
					className={dragged === number ? 'cursor-grabbing' : 'cursor-grab'}
				/>
				{Accessed ? (
					<Ban
						className='cursor-pointer'
						onClick={() => onRemove && onRemove(number)}
					/>
				) : (
					<ChevronsRight
						className='cursor-pointer'
						onClick={() => onAdd && onAdd(number)}
					/>
				)}
			</p>
		</div>
	)
}

const AccessBlock = ({
	title,
	mass,
	Accessed = false,
	onAdd,
	onRemove,
	onDropGroup,
}) => {
	const [dragged, setDragged] = useState(null)

	return (
		<div
			className='w-full bg-[var(--white)] h-200 rounded-xl shadow-[var(--shadow)] p-5 flex flex-col gap-5'
			onDrop={e => {
				e.preventDefault()
				const groupNumber = e.dataTransfer.getData('groupNumber')
				if (groupNumber) {
					onDropGroup && onDropGroup(groupNumber)
				}
				setDragged(null)
			}}
			onDragOver={e => {
				e.preventDefault()
			}}
		>
			<p className='font-medium'>{title}</p>
			<div className='flex gap-3 w-full pr-4'>
				<SearchInput width={'100%'} height={48} />
				<FilterButton option={[]} />
			</div>

			<div className=' bg-[var(--white)] shadow-[var(--shadow)] grid grid-cols-12 rounded-lg py-[10px]'>
				<p className='col-span-2 text-center'>Номер группы</p>
				<p className='col-span-2 text-center'>Уровень обр.</p>
				<p className='col-span-2 text-center'>Курс</p>
				<p className='col-span-2 text-center'>Кол-во студентов</p>
				<p className='col-span-3 text-center'>Успеваемость</p>
				<p className='col-span-1 text-center'></p>
			</div>
			<div className='flex flex-col gap-3 overflow-y-scroll hide-scrollbar p-2'>
				{mass.map(item => (
					<GroupComponent
						number={item.number}
						lvl={item.lvl}
						course={item.course}
						performance={item.Performance}
						studentsLength={item.students.length}
						onAdd={onAdd}
						onRemove={onRemove}
						dragged={dragged}
						Accessed={Accessed}
						onDragStart={e => {
							e.dataTransfer.setData('groupNumber', number)
							setDragged(number)
						}}
						onDragEnd={() => setDragged(null)}
					/>
				))}
			</div>
		</div>
	)
}

const AccessManagement = () => {
	const [accessedGroups, setAccessedGroups] = useState([])

	const availableGroups = groups.filter(
		group => !accessedGroups.includes(group.number)
	)
	const allowedGroups = groups.filter(group =>
		accessedGroups.includes(group.number)
	)

	const handleAdd = number => {
		setAccessedGroups(prev =>
			prev.includes(number) ? prev : [...prev, number]
		)
	}
	const handleRemove = number => {
		setAccessedGroups(prev => prev.filter(n => n !== number))
	}

	const handleDropToAllowed = number => {
		handleAdd(number)
	}
	const handleDropToAvailable = number => {
		handleRemove(number)
	}

	return (
		<div className='grid grid-cols-2 gap-5'>
			<AccessBlock
				title={'Список групп'}
				mass={availableGroups}
				Accessed={false}
				onAdd={handleAdd}
				onDropGroup={handleDropToAvailable}
			/>
			<AccessBlock
				title={'Допущены к прохождению курса'}
				mass={allowedGroups}
				Accessed={true}
				onRemove={handleRemove}
				onDropGroup={handleDropToAllowed}
			/>
		</div>
	)
}

export default AccessManagement
