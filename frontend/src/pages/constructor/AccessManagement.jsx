import { Ban, ChevronsRight, GripVertical } from 'lucide-react'
import { FilterButton } from '../../components/Buttons'
import { SearchInput } from '../../components/Inputs'
import { useEffect, useRef, useState } from 'react'
import { useError } from '../../components/Errors'
import axios from 'axios'
import { API } from '../../API'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

const GroupComponent = ({
	id,
	number,
	lvl,
	course,
	studentsLength,
	onRemove,
	onAdd,
	dragged,
	Accessed,
	onDragStart,
	onDragEnd,
}) => {
	return (
		<div
			className=' bg-[var(--white)] shadow-[var(--shadow)] grid grid-cols-9 rounded-lg py-[10px] text-[var(--black)]'
			draggable
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
		>
			<p className='col-span-2 text-center'>{number}</p>
			<p className='col-span-2 text-center'>{lvl}</p>
			<p className='col-span-2 text-center'>{course}</p>
			<p className='col-span-2 text-center'>{studentsLength}</p>

			<p className='col-span-1 text-center flex justify-center gap-3'>
				<GripVertical
					className={dragged === number ? 'cursor-grabbing' : 'cursor-grab'}
				/>
				{Accessed ? (
					<Ban
						className='cursor-pointer'
						onClick={() => onRemove && onRemove(id)}
					/>
				) : (
					<ChevronsRight
						className='cursor-pointer'
						onClick={() => onAdd && onAdd(id)}
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
	onSearchChange,
	searchValue,
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
			<p className='font-medium text-[var(--black)]'>{title}</p>
			<div className='flex gap-3 w-full pr-4'>
				<SearchInput
					width={'100%'}
					height={48}
					onChange={onSearchChange}
					value={searchValue}
				/>
				<FilterButton option={[]} />
			</div>

			<div className=' bg-[var(--white)] shadow-[var(--shadow)] grid grid-cols-9 rounded-lg py-[10px] text-[var(--black)]'>
				<p className='col-span-2 text-center'>Номер группы</p>
				<p className='col-span-2 text-center'>Уровень обр.</p>
				<p className='col-span-2 text-center'>Курс</p>
				<p className='col-span-2 text-center'>Кол-во студентов</p>

				<p className='col-span-1 text-center'></p>
			</div>
			<div className='flex flex-col gap-3 overflow-y-scroll hide-scrollbar p-2'>
				{mass.map((item, index) => (
					<motion.div
						key={index}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{
							duration: 0.3,
							delay: index * 0.1,
							ease: 'easeOut',
						}}
					>
						<GroupComponent
							id={item?.id}
							number={item?.name}
							lvl={item?.educational_level}
							course={item?.course_level}
							studentsLength={item?.count_students}
							onAdd={onAdd}
							onRemove={onRemove}
							dragged={dragged}
							Accessed={Accessed}
							onDragStart={e => {
								e.dataTransfer.setData('groupNumber', item?.id)
								setDragged(item?.id)
							}}
							onDragEnd={() => setDragged(null)}
						/>
					</motion.div>
				))}
			</div>
		</div>
	)
}

const AccessManagement = ({ onChange }) => {
	const [linkedGroups, setLinkedGroups] = useState([])
	const [unlinkedGroups, setUnlinkedGroups] = useState([])
	const { courseId } = useParams()
	const debounceTimeout = useRef(null)

	const [searchLinkedGroups, setSearchLinkedGroups] = useState()
	const [searchUnlinkedGroups, setSearchUnlinkedGroups] = useState()

	const { setError } = useError()

	useEffect(() => {
		// если оба поля пустые — ничего не делать
		if (searchLinkedGroups === '' && searchUnlinkedGroups === '') return

		// сбрасываем предыдущий таймер
		if (debounceTimeout.current) clearTimeout(debounceTimeout.current)

		// ставим новый таймер
		debounceTimeout.current = setTimeout(() => {
			if (searchLinkedGroups !== '') fetchLinkedGroups(searchLinkedGroups)
			if (searchUnlinkedGroups !== '') fetchUnlinkedGroups(searchUnlinkedGroups)
		}, 2000) // задержка 2 секунды

		// очистка при размонтировании или при новом вводе
		return () => clearTimeout(debounceTimeout.current)
	}, [searchLinkedGroups, searchUnlinkedGroups])

	const fetchUnlinkedGroups = async term => {
		try {
			const res = await axios.get(
				`${API}/courses/student-group/unlinked/?course_id=${courseId}${
					term?.length ? `&term=${term}` : ''
				}`
			)

			console.log(res)

			setError(null)

			setUnlinkedGroups(res.data)
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
	const fetchLinkedGroups = async term => {
		try {
			const res = await axios.get(
				`${API}/courses/student-group/linked/?course_id=${courseId}${
					term?.length ? `&term=${term}` : ''
				}`
			)

			console.log(res)

			setError(null)

			setLinkedGroups(res.data)
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
		fetchUnlinkedGroups()
		fetchLinkedGroups()
	}, [])

	useEffect(() => {
		onChange?.(linkedGroups)
	}, [linkedGroups])

	const handleAdd = async number => {
		try {
			await axios.post(`${API}/courses/students/${courseId}`, {
				student_group_id: number,

				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('access_token')}`,
				},
			})

			fetchUnlinkedGroups()
			fetchLinkedGroups()

			setError(null)
		} catch (err) {
			console.error(err)
			if (err.response) {
				setError(err.response.status.toString())
			} else {
				setError('500')
			}
		}
	}
	const handleRemove = async number => {
		try {
			await axios.delete(`${API}/courses/students/${courseId}`, {
				data: {
					student_group_id: number,
				},
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.getItem('access_token')}`,
				},
			})

			fetchUnlinkedGroups()
			fetchLinkedGroups()

			setError(null)
		} catch (err) {
			console.error(err)
			if (err.response) {
				setError(err.response.status.toString())
			} else {
				setError('500')
			}
		}
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
				mass={unlinkedGroups}
				Accessed={false}
				onAdd={handleAdd}
				onDropGroup={handleDropToAvailable}
				onSearchChange={e => setSearchUnlinkedGroups(e.target.value)}
				searchValue={searchUnlinkedGroups}
			/>
			<AccessBlock
				title={'Допущены к прохождению курса'}
				mass={linkedGroups}
				Accessed={true}
				onRemove={handleRemove}
				onDropGroup={handleDropToAllowed}
				onSearchChange={e => setSearchLinkedGroups(e.target.value)}
				searchValue={searchLinkedGroups}
			/>
		</div>
	)
}

export default AccessManagement
