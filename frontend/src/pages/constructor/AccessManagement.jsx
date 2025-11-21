import { Ban, ChevronsRight, GripVertical } from 'lucide-react'
import { FilterButton } from '../../components/Buttons'
import { SearchInput } from '../../components/Inputs'
import { useEffect, useRef, useState } from 'react'
import { setGlobalError } from '../../components/Errors'
import axios from 'axios'
import api, { API } from '../../API'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Loader, { AltLoader } from '../../components/Loader'
import { getCookie } from '../../TOKEN'

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
	loading = false,
	searchLoading = false,
}) => {
	const [dragged, setDragged] = useState(null)
	const [isLoading, setIsLoading] = useState()

	useEffect(() => {
		setIsLoading(loading)
	}, [loading])

	console.log(searchLoading)

	return (
		<div
			className='w-full bg-[var(--white)] h-250 rounded-xl shadow-[var(--shadow)] p-5 flex flex-col gap-5'
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
					loading={searchLoading}
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
			{isLoading === true ? (
				<Loader />
			) : (
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
			)}
		</div>
	)
}

const AccessManagement = ({ onChange }) => {
	const [linkedGroups, setLinkedGroups] = useState([])
	const [unlinkedGroups, setUnlinkedGroups] = useState([])
	const { courseId } = useParams()

	const [searchLinkedGroups, setSearchLinkedGroups] = useState('')
	const [searchUnlinkedGroups, setSearchUnlinkedGroups] = useState('')

	const linkedDebounce = useRef(null)
	const unlinkedDebounce = useRef(null)

	const [isLoading, setIsLoading] = useState(3)
	const [isSearchLoading, setIsSearchLoading] = useState(null)

	useEffect(() => {
		setIsSearchLoading(searchUnlinkedGroups === '' ? null : 0)
		if (searchUnlinkedGroups === '') {
			fetchUnlinkedGroups()
			return
		}

		if (unlinkedDebounce.current) clearTimeout(unlinkedDebounce.current)
		unlinkedDebounce.current = setTimeout(() => {
			fetchUnlinkedGroups(searchUnlinkedGroups)
		}, 500)

		return () => clearTimeout(unlinkedDebounce.current)
	}, [searchUnlinkedGroups])
	useEffect(() => {
		setIsSearchLoading(searchLinkedGroups === '' ? null : 1)
		if (searchLinkedGroups === '') {
			fetchLinkedGroups()
			return
		}

		if (linkedDebounce.current) clearTimeout(linkedDebounce.current)
		linkedDebounce.current = setTimeout(() => {
			fetchLinkedGroups(searchLinkedGroups)
		}, 500)

		return () => clearTimeout(linkedDebounce.current)
	}, [searchLinkedGroups])

	const fetchUnlinkedGroups = async term => {
		try {
			setIsLoading(isSearchLoading !== null ? null : 0)
			const res = await api.get(
				`${API}/courses/student-group/unlinked/?course_id=${courseId}${
					term?.length ? `&term=${term}` : ''
				}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				}
			)

			console.log(res)

			setGlobalError(null)

			setUnlinkedGroups(res.data)
			setIsLoading(null)
			setIsSearchLoading(null)
		} catch (error) {
			console.log(error)
		}
	}
	const fetchLinkedGroups = async term => {
		try {
			setIsLoading(isSearchLoading !== null ? null : 1)
			const res = await api.get(
				`${API}/courses/student-group/linked/?course_id=${courseId}${
					term?.length ? `&term=${term}` : ''
				}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				}
			)

			console.log(res)

			setGlobalError(null)

			setLinkedGroups(res.data)
			setIsLoading(null)
			setIsSearchLoading(null)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		onChange?.(linkedGroups)
	}, [linkedGroups])

	const handleAdd = async number => {
		try {
			await api.post(`${API}/courses/students/${courseId}`, {
				student_group_id: number,

				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			fetchUnlinkedGroups()
			fetchLinkedGroups()

			setGlobalError(null)
		} catch (error) {
			console.error(error)
		}
	}
	const handleRemove = async number => {
		try {
			await api.delete(`${API}/courses/students/${courseId}`, {
				data: {
					student_group_id: number,
				},
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			fetchUnlinkedGroups()
			fetchLinkedGroups()

			setGlobalError(null)
		} catch (error) {
			console.error(error)
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
				loading={isLoading === 3 ? true : isLoading === 0}
				searchLoading={isSearchLoading === 0}
			/>
			<AccessBlock
				title={'Допущены к прохождению курса'}
				mass={linkedGroups}
				Accessed={true}
				onRemove={handleRemove}
				onDropGroup={handleDropToAllowed}
				onSearchChange={e => setSearchLinkedGroups(e.target.value)}
				searchValue={searchLinkedGroups}
				loading={isLoading === 3 ? true : isLoading === 1}
				searchLoading={isSearchLoading === 1}
			/>
		</div>
	)
}

export default AccessManagement
