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
import BasicPagination from '../../components/Pagination'

const ENTITY = {
	STUDENTS: 'students',
	TEACHERS: 'teachers',
}

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
	const ActionIcon = Accessed ? Ban : ChevronsRight
	const actionHandler = Accessed ? onRemove : onAdd

	return (
		<>
			{/* desktop */}
			<div
				className='max-xl:hidden bg-[var(--white)] shadow-[var(--shadow)] grid grid-cols-9 rounded-lg py-[10px] text-[var(--black)]'
				draggable
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
			>
				<p className='col-span-8 px-4'>{name}</p>

				<p className='col-span-1 flex justify-center gap-3'>
					<GripVertical
						className={dragged === name ? 'cursor-grabbing' : 'cursor-grab'}
					/>
					<ActionIcon
						className='cursor-pointer'
						onClick={() => actionHandler && actionHandler(id)}
					/>
				</p>
			</div>

			{/* mobile */}
			<div
				className='min-xl:hidden bg-[var(--white)] shadow-[var(--shadow)] flex items-center justify-between rounded-lg p-4 text-[var(--black)]'
				draggable
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
			>
				<p className='text-2xl'>{name}</p>

				<ActionIcon
					className='cursor-pointer'
					onClick={() => actionHandler && actionHandler(id)}
				/>
			</div>
		</>
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
	onChangeChapter,
	onChangePage,
	pagecounts,
}) => {
	const [dragged, setDragged] = useState(null)
	const [selected, setSelected] = useState(0)
	const [selectedChapter, setSelectedChapter] = useState(0)
	const [page, setPage] = useState(1)

	const entityType =
		title ?? (selected === 0 ? ENTITY.STUDENTS : ENTITY.TEACHERS)
	const isStudents = entityType === ENTITY.STUDENTS

	useEffect(() => {
		onChange?.(selected)
		onChangeChapter?.(selectedChapter)
		onChangePage?.(page)
	}, [selected, selectedChapter, page])

	const headers = {
		students: ['Номер группы', 'Уровень обр.', 'Курс', 'Кол-во студентов', ''],
		teachers: ['ФИО преподавателя'],
	}

	const renderItem = (item, index) => (
		<motion.div
			key={item.id}
			initial={{ scale: 0.8, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ duration: 0.3, delay: index * 0.05 }}
		>
			{isStudents ? (
				<GroupComponent
					id={item.id}
					number={item.name}
					lvl={item.educational_level}
					course={item.course_level}
					studentsLength={item.count_students}
					onAdd={onAdd}
					onRemove={onRemove}
					dragged={dragged}
					Accessed={Accessed}
					onDragStart={e => {
						e.dataTransfer.setData('groupNumber', item.id)
						setDragged(item.id)
					}}
					onDragEnd={() => setDragged(null)}
				/>
			) : (
				<TeacherComponent
					id={item.id}
					name={item.mmis_teacher_name}
					onAdd={onAdd}
					onRemove={onRemove}
					dragged={dragged}
					Accessed={Accessed}
					onDragStart={e => {
						e.dataTransfer.setData('groupNumber', item.id)
						setDragged(item.id)
					}}
					onDragEnd={() => setDragged(null)}
				/>
			)}
		</motion.div>
	)

	return (
		<div
			className='w-full bg-[var(--white)] h-[72.5vh] rounded-xl shadow-[var(--shadow)] p-5 flex flex-col gap-5'
			onDrop={e => {
				e.preventDefault()
				const id = e.dataTransfer.getData('groupNumber')
				if (id) onDropGroup?.(id)
				setDragged(null)
			}}
			onDragOver={e => e.preventDefault()}
		>
			{/* mobile tabs */}
			<div className='flex gap-3 min-lg:hidden'>
				{['Недопущенные', 'Допущенные'].map((t, i) => (
					<AltRadioButton
						key={i}
						value={i}
						title={t}
						checked={selectedChapter === i}
						onChange={() => setSelectedChapter(i)}
						width='100%'
					/>
				))}
			</div>

			<div className='flex gap-3 min-lg:hidden'>
				{['Группы студентов', 'Преподаватели'].map((t, i) => (
					<RadioButton
						key={i}
						value={i}
						title={t}
						checked={selected === i}
						onChange={() => setSelected(i)}
					/>
				))}
			</div>

			{/* desktop tabs */}
			{!title && (
				<div className='flex gap-2 max-lg:hidden'>
					{['Группы студентов', 'Преподаватели'].map((t, i) => (
						<RadioButton
							key={i}
							value={i}
							title={t}
							checked={selected === i}
							onChange={() => setSelected(i)}
						/>
					))}
				</div>
			)}

			{/* search */}
			<div className='flex gap-3'>
				<SearchInput
					width='100%'
					height={48}
					onChange={onSearchChange}
					value={searchValue}
					loading={searchLoading}
				/>
				<FilterButton option={[]} />
			</div>

			{/* headers */}
			<div className='max-xl:hidden bg-[var(--white)] shadow-[var(--shadow)] grid grid-cols-9 rounded-lg py-[10px]'>
				{headers[entityType].map((h, i) => (
					<p key={i} className='col-span-2 text-center'>
						{h}
					</p>
				))}
			</div>

			{/* list */}
			{loading ? (
				<Loader />
			) : (
				<div className='flex flex-col gap-3 overflow-y-scroll h-full hide-scrollbar p-2'>
					{mass?.map(renderItem)}
				</div>
			)}
			<BasicPagination count={pagecounts} onPageChange={setPage} />
		</div>
	)
}

const AccessManagement = ({ onChange }) => {
	const { courseId } = useParams()

	const [selectedEntity, setSelectedEntity] = useState(null)
	const [selectedChapter, setSelectedChapter] = useState(0)
	const [linked, setLinked] = useState([])
	const [unlinked, setUnlinked] = useState([])

	const [searchLinked, setSearchLinked] = useState('')
	const [searchUnlinked, setSearchUnlinked] = useState('')

	const [loading, setLoading] = useState(null)
	const [searchLoading, setSearchLoading] = useState(null)
	const [linkedPage, setLinkedPage] = useState(1)
	const [unlinkedPage, setUnlinkedPage] = useState(1)

	const fetchData = async (type, linkedFlag, term = '') => {
		const url =
			type === ENTITY.STUDENTS
				? `${API}/courses/student-group/${linkedFlag}/?course_id=${courseId}&page=${linkedFlag === 'linked' ? linkedPage : unlinkedPage}&size=${25}${term ? `&term=${term}` : ''}`
				: `${API}/courses/teachers/${linkedFlag}/?course_id=${courseId}&page=${linkedFlag === 'linked' ? linkedPage : unlinkedPage}&size=${25}${term ? `&term=${term}` : ''}`

		try {
			setLoading(linkedFlag === 'linked' ? 1 : 0)
			const res = await api.get(url, { withCredentials: true })
			linkedFlag === 'linked' ? setLinked(res.data) : setUnlinked(res.data)
		} finally {
			setLoading(null)
			setSearchLoading(null)
		}
	}

	useEffect(() => {
		if (!selectedEntity) return

		const timer = setTimeout(() => {
			fetchData(selectedEntity, 'linked', searchLinked)
			fetchData(selectedEntity, 'unlinked', searchUnlinked)
			setLinkedPage(1)
			setUnlinkedPage(1)
		}, 500) // ← задержка, например 500 мс

		return () => clearTimeout(timer)
	}, [selectedEntity, searchLinked, searchUnlinked])

	useEffect(() => {
		fetchData(selectedEntity, 'linked')
		fetchData(selectedEntity, 'unlinked')
	}, [linkedPage, unlinkedPage])

	const handleAdd = id =>
		api
			.post(
				selectedEntity === ENTITY.STUDENTS
					? `${API}/courses/students/${courseId}?student_group_id=${id}`
					: `${API}/courses/teachers/${courseId}?teacher_profile_id=${id}`,
			)
			.then(() => {
				fetchData(selectedEntity, 'linked')
				fetchData(selectedEntity, 'unlinked')
			})

	const handleRemove = id =>
		api
			.delete(
				selectedEntity === ENTITY.STUDENTS
					? `${API}/courses/students/${courseId}?student_group_id=${id}`
					: `${API}/courses/teachers/${courseId}?teacher_profile_id=${id}`,
			)
			.then(() => {
				fetchData(selectedEntity, 'linked')
				fetchData(selectedEntity, 'unlinked')
			})

	useEffect(() => {
		onChange?.(linked)
	}, [linked])

	return (
		<>
			<div className='grid grid-cols-2 gap-5 max-lg:hidden'>
				<AccessBlock
					mass={unlinked?.items}
					onAdd={handleAdd}
					onSearchChange={e => setSearchUnlinked(e.target.value)}
					searchValue={searchUnlinked}
					loading={loading === 0}
					onChange={i =>
						setSelectedEntity(i === 0 ? ENTITY.STUDENTS : ENTITY.TEACHERS)
					}
					onChangePage={setUnlinkedPage}
					pagecounts={unlinked?.pages}
				/>

				<AccessBlock
					title={selectedEntity}
					mass={linked?.items}
					Accessed
					onRemove={handleRemove}
					onSearchChange={e => setSearchLinked(e.target.value)}
					searchValue={searchLinked}
					loading={loading === 1}
					onChangePage={setLinkedPage}
					pagecounts={linked?.pages}
				/>
			</div>
			<div className='min-lg:hidden'>
				{selectedChapter === 0 ? (
					<AccessBlock
						mass={unlinked?.items}
						onAdd={handleAdd}
						onSearchChange={e => setSearchUnlinked(e.target.value)}
						searchValue={searchUnlinked}
						loading={loading === 0}
						onChange={i =>
							setSelectedEntity(i === 0 ? ENTITY.STUDENTS : ENTITY.TEACHERS)
						}
						onChangeChapter={setSelectedChapter}
						onChangePage={setUnlinkedPage}
						pagecounts={unlinked?.pages}
					/>
				) : (
					<AccessBlock
						title={selectedEntity}
						mass={linked?.items}
						Accessed
						onRemove={handleRemove}
						onSearchChange={e => setSearchLinked(e.target.value)}
						searchValue={searchLinked}
						loading={loading === 1}
						onChangeChapter={setSelectedChapter}
						onChangePage={setLinkedPage}
						pagecounts={linked?.pages}
					/>
				)}
			</div>
		</>
	)
}

export default AccessManagement
