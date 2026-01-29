import { Ban, ChevronsRight, GripVertical } from 'lucide-react'
import {
	AltRadioButton,
	FilterButton,
	RadioButton,
} from '../../components/Buttons'
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
		<>
			<div
				className='max-xl:hidden bg-[var(--white)] shadow-[var(--shadow)] grid grid-cols-9 rounded-lg py-[10px] text-[var(--black)]'
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
			<div
				className='min-xl:hidden bg-[var(--white)] shadow-[var(--shadow)] flex items-center justify-between rounded-lg p-4 text-[var(--black)]'
				draggable
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
			>
				<div className='flex flex-col items-start'>
					<p className='text-center text-3xl'>{number}</p>
					<p className='text-center text-xl'>
						{course}-й курс {lvl && `(${lvl})`}
					</p>
					<p className='text-center text-lg text-[var(--middle)]'>
						Количество студентов - {studentsLength}
					</p>
				</div>

				<p className=' text-center flex justify-center gap-3'>
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
		</>
	)
}

const TeacherComponent = ({
	id,
	name,
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
			<p className='col-span-8 text-start px-4'>{name}</p>

			<p className='col-span-1 text-center flex justify-center gap-3'>
				<GripVertical
					className={dragged === name ? 'cursor-grabbing' : 'cursor-grab'}
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
	onChange,
}) => {
	const [dragged, setDragged] = useState(null)
	const [isLoading, setIsLoading] = useState()

	useEffect(() => {
		setIsLoading(loading)
	}, [loading])

	const [selected, setSelected] = useState(0)

	const options = [
		{ value: 0, title: 'Группы студентов' },
		{ value: 1, title: 'Преподаватели' },
	]
	useEffect(() => {
		onChange?.(selected)
	}, [selected])

	console.log('mass: ', mass, '\ntitle: ', title)

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
			<div className='flex w-full justify-center gap-3'>
				{options?.map(option => (
					<AltRadioButton
						key={option?.value}
						name='example'
						value={option?.value}
						title={option?.title}
						icon={option?.icon}
						checked={selected === option?.value}
						onChange={() => setSelected(option?.value)}
						width={'100%'}
					/>
				))}
			</div>

			{title ? (
				<p className='font-medium text-[var(--black)]'>
					{title === 'students'
						? 'Допущены к прохождению курса'
						: title === 'teachers' && 'Допущены к редактированию курса'}
				</p>
			) : (
				<div className='flex gap-1'>
					{options?.map(option => (
						<RadioButton
							key={option?.value}
							name='example'
							value={option?.value}
							title={option?.title}
							icon={option?.icon}
							checked={selected === option?.value}
							onChange={() => setSelected(option?.value)}
						/>
					))}
				</div>
			)}

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

			<div className='max-xl:hidden bg-[var(--white)] shadow-[var(--shadow)] grid grid-cols-9 rounded-lg py-[10px] text-[var(--black)]'>
				{title ? (
					title === 'students' ? (
						<>
							<p className='col-span-2 text-center'>Номер группы</p>
							<p className='col-span-2 text-center'>Уровень обр.</p>
							<p className='col-span-2 text-center'>Курс</p>
							<p className='col-span-2 text-center'>Кол-во студентов</p>

							<p className='col-span-1 text-center'></p>
						</>
					) : (
						<p className='col-span-2 text-center'>ФИО Преподавателя</p>
					)
				) : selected === 0 ? (
					<>
						<p className='col-span-2 text-center'>Номер группы</p>
						<p className='col-span-2 text-center'>Уровень обр.</p>
						<p className='col-span-2 text-center'>Курс</p>
						<p className='col-span-2 text-center'>Кол-во студентов</p>

						<p className='col-span-1 text-center'></p>
					</>
				) : (
					<p className='col-span-2 text-center'>ФИО Преподавателя</p>
				)}
			</div>
			{isLoading === true ? (
				<Loader />
			) : (
				<div className='flex flex-col gap-3 overflow-y-scroll hide-scrollbar p-2'>
					{mass &&
						(title ? (
							title === 'students' ? (
								<>
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
								</>
							) : (
								<>
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
											<TeacherComponent
												id={item?.id}
												name={item?.mmis_name}
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
								</>
							)
						) : selected === 0 ? (
							<>
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
							</>
						) : (
							<>
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
										<TeacherComponent
											id={item?.id}
											name={item?.mmis_name}
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
							</>
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

	const [selectedParam, setSelectedParam] = useState(null)

	useEffect(() => {
		if (!selectedParam) return

		setIsSearchLoading(searchUnlinkedGroups === '' ? null : 0)

		if (unlinkedDebounce.current) clearTimeout(unlinkedDebounce.current)

		unlinkedDebounce.current = setTimeout(() => {
			fetchUnlinkedGroups(searchUnlinkedGroups)
		}, 500)

		return () => clearTimeout(unlinkedDebounce.current)
	}, [searchUnlinkedGroups, selectedParam])

	useEffect(() => {
		if (!selectedParam) return

		setIsSearchLoading(searchLinkedGroups === '' ? null : 1)

		if (linkedDebounce.current) clearTimeout(linkedDebounce.current)

		linkedDebounce.current = setTimeout(() => {
			fetchLinkedGroups(searchLinkedGroups)
		}, 500)

		return () => clearTimeout(linkedDebounce.current)
	}, [searchLinkedGroups, selectedParam])

	const fetchUnlinkedGroups = async (term = '') => {
		if (!selectedParam) return

		const url =
			selectedParam === 'students'
				? `${API}/courses/student-group/unlinked/?course_id=${courseId}${
						term ? `&term=${term}` : ''
					}`
				: `${API}/courses/teachers/unlinked/?course_id=${courseId}${
						term ? `&term=${term}` : ''
					}`

		try {
			setIsLoading(isSearchLoading !== null ? null : 0)
			console.log('Fetching URL:', url)

			const res = await api.get(url, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			setUnlinkedGroups(res.data)
			setGlobalError(null)
		} catch (error) {
			console.log(error)
			setGlobalError('Ошибка при загрузке данных')
		} finally {
			setIsLoading(null)
			setIsSearchLoading(null)
		}
	}

	const fetchLinkedGroups = async (term = '') => {
		if (!selectedParam) return

		const url =
			selectedParam === 'students'
				? `${API}/courses/student-group/linked/?course_id=${courseId}${
						term ? `&term=${term}` : ''
					}`
				: `${API}/courses/teachers/linked/?course_id=${courseId}${
						term ? `&term=${term}` : ''
					}`

		try {
			setIsLoading(isSearchLoading !== null ? null : 1)
			console.log('Fetching URL:', url)

			const res = await api.get(url, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			setLinkedGroups(res.data)
			setGlobalError(null)
		} catch (error) {
			console.log(error)
			setGlobalError('Ошибка при загрузке данных')
		} finally {
			setIsLoading(null)
			setIsSearchLoading(null)
		}
	}

	useEffect(() => {
		onChange?.(linkedGroups)
	}, [linkedGroups])

	const handleAdd = async number => {
		const url =
			selectedParam === 'students'
				? `${API}/courses/students/${courseId}?student_group_id=${number}`
				: `${API}/courses/teachers/${courseId}?teacher_profile_id=${number}`

		try {
			await api.post(
				url,

				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				},
			)

			fetchUnlinkedGroups()
			fetchLinkedGroups()

			setGlobalError(null)
		} catch (error) {
			console.error(error)
		}
	}
	const handleRemove = async number => {
		const url =
			selectedParam === 'students'
				? `${API}/courses/students/${courseId}?student_group_id=${number}`
				: `${API}/courses/teachers/${courseId}?teacher_profile_id=${number}`
		try {
			await api.delete(
				url,

				{
					data: {},
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				},
			)

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

	const [selectedAccessBlock, setSelectedAccessBlock] = useState(0)

	return (
		<>
			<div className='max-lg:hidden grid grid-cols-2 gap-5'>
				<AccessBlock
					mass={unlinkedGroups}
					Accessed={false}
					onAdd={handleAdd}
					onDropGroup={handleDropToAvailable}
					onSearchChange={e => setSearchUnlinkedGroups(e.target.value)}
					searchValue={searchUnlinkedGroups}
					loading={isLoading === 3 ? true : isLoading === 0}
					searchLoading={isSearchLoading === 0}
					onChange={data =>
						setSelectedParam(data === 0 ? 'students' : 'teachers')
					}
				/>
				<AccessBlock
					title={selectedParam}
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
			<div className='min-lg:hidden gap-5'>
				{selectedAccessBlock === 0 ? (
					<AccessBlock
						mass={unlinkedGroups}
						Accessed={false}
						onAdd={handleAdd}
						onDropGroup={handleDropToAvailable}
						onSearchChange={e => setSearchUnlinkedGroups(e.target.value)}
						searchValue={searchUnlinkedGroups}
						loading={isLoading === 3 ? true : isLoading === 0}
						searchLoading={isSearchLoading === 0}
						onChange={data =>
							setSelectedParam(data === 0 ? 'students' : 'teachers')
						}
					/>
				) : (
					<AccessBlock
						title={selectedParam}
						mass={linkedGroups}
						Accessed={true}
						onRemove={handleRemove}
						onDropGroup={handleDropToAllowed}
						onSearchChange={e => setSearchLinkedGroups(e.target.value)}
						searchValue={searchLinkedGroups}
						loading={isLoading === 3 ? true : isLoading === 1}
						searchLoading={isSearchLoading === 1}
					/>
				)}
			</div>
		</>
	)
}

export default AccessManagement
