import { useState, useEffect } from 'react'
import { courses } from '../data/courses'
import {
	ArrowDownAZ,
	ArrowDownWideNarrow,
	ArrowUpWideNarrow,
	ArrowUpZA,
	BookOpen,
	ChevronRight,
	Plus,
	X,
} from 'lucide-react'
import { Link } from '../components/Links'
import { Filter, Option, SearchDefault, Sort } from '../components/Inputs'
import { CourseCard } from '../components/Cards'
import { NavLink } from 'react-router-dom'

const Accordion = ({ children, ChapterName, to }) => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<div
				className={`flex flex-col bg-[var(--ghost-black)] ${
					isOpen
						? 'bg-[var(--light-ghost-black)]'
						: 'hover:bg-[var(--light-ghost-black)]'
				} rounded-xl overflow-hidden py-4 px-6 transition-all`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className='flex text-[var(--text)]  transition-all '>
					<div className='flex max-lg:flex-col w-full justify-between lg:items-center group'>
						<div className='flex gap-4 items-center'>
							<X
								size={36}
								strokeWidth={2}
								className={`${
									isOpen && ' rotate-180'
								} transition-transform duration-200 rotate-45 `}
							/>
							<p className={`unbounded font-normal text-base`}>{ChapterName}</p>
						</div>
						<div className='flex gap-3 ml-10'>
							<NavLink
								className='flex items-center bg-[var(--primary)] text-[var(--black)] text-base hover:brightness-110 rounded-md p-2 px-4 font-normal transition-all unbounded cursor-none z-100'
								to={to}
							>
								<p>Больше</p>
							</NavLink>
						</div>
					</div>
				</div>
			</div>
			<div
				className={`${
					isOpen ? 'h-auto opacity-100' : 'max-h-0 opacity-0'
				} transition-all duration-300 overflow-hidden`}
			>
				<div className='grid max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 grid-cols-4 gap-3 '>
					{children}
				</div>
			</div>
		</>
	)
}

const FacultyCourses = () => {
	const [selectedChapter, setSelectedChapter] = useState(null)

	const chapters = [
		{ value: '1', label: 'Глава 1' },
		{ value: '2', label: 'Глава 2' },
		{ value: '3', label: 'Глава 3' },
	]

	return (
		<>
			<div className='flex flex-col gap-5'>
				<p className='hidden text-4xl font-bold mb-4 text-[var(--text)]'>
					МелГУ СУО 1.2
				</p>
				<div className='hidden max-lg:flex-col max-lg:w-fit lg:items-center gap-6'>
					<Option
						options={chapters}
						selectedValue={selectedChapter}
						onSelect={setSelectedChapter}
					/>
					<SearchDefault />
				</div>

				{courses.map(facultyBlock => (
					<Accordion
						key={facultyBlock.id}
						ChapterName={facultyBlock.faculty}
						to={`/all/${facultyBlock.id}`}
					>
						{facultyBlock.courses.slice(0, 4).map((course, index) => (
							<CourseCard
								key={index}
								img_path={course.img_path}
								title={course.title}
								follow={course.follow}
							/>
						))}
					</Accordion>
				))}
			</div>
		</>
	)
}

import { useParams } from 'react-router-dom'

export const AllCourses = () => {
	const { id } = useParams()
	const facultyId = parseInt(id, 10)

	const facultyBlock = courses.find(faculty => faculty.id === facultyId)

	const [filterValue, setFilterValue] = useState('')
	const [sortValue, setSortValue] = useState(0)

	const filterOptions = [
		{ value: '', label: 'Все' },
		{ value: 'Лекция', label: 'Лекции' },
		{ value: 'Практика', label: 'Практики' },
		{ value: 'Лабораторная работа', label: 'Лабораторные работы' },
	]

	const SortOptions = [
		{
			value: 0,
			label: 'Сортировать по последним добавлениям',
			icon: <ArrowDownWideNarrow size={36} />,
		},
		{
			value: 1,
			label: 'Сортировать по последним добавлениям',
			icon: <ArrowUpWideNarrow size={36} />,
		},
		{
			value: 2,
			label: 'Сортировать по алфавиту',
			icon: <ArrowDownAZ size={36} />,
		},
		{
			value: 3,
			label: 'Сортировать по алфавиту',
			icon: <ArrowUpZA size={36} />,
		},
	]
	let filteredCourses = facultyBlock.courses.filter(course =>
		filterValue ? course.tag === filterValue : true
	)

	return (
		<div>
			<div className='flex gap-3'>
				<Filter
					options={filterOptions}
					selectedValue={filterValue}
					onSelect={setFilterValue}
				/>
				<SearchDefault width={'100%'} />
				<Sort
					selectedValue={sortValue}
					onSelect={setSortValue}
					options={SortOptions}
				/>
			</div>

			<div className='grid max-xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 grid-cols-4 gap-3 mt-[30px]'>
				{filteredCourses.map((course, index) => (
					<CourseCard
						key={index}
						img_path={course.img_path}
						title={course.title}
						follow={course.follow}
					/>
				))}
			</div>
		</div>
	)
}

export default FacultyCourses
