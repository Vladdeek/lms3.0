import { useEffect, useState } from 'react'
import { Button, FilterButton, RadioButton } from '../components/Buttons'
import { Blocks, FunnelPlus, LayoutGrid, Radio, X } from 'lucide-react'
import { CourseCard } from '../components/Cards'
import {
	FileInput,
	InputDefault,
	SearchInput,
	TextArea,
} from '../components/Inputs'
import { motion } from 'framer-motion'
import { API } from '../API'
import { Navigate } from 'react-router-dom'

const CatalogS = ({ role }) => {
	const options = [
		{ value: 0, title: 'Добавленные курсы', icon: LayoutGrid },
		{ value: 1, title: 'Вебинар', icon: Radio },
	]

	const [selected, setSelected] = useState(0)

	const [courses, setCourses] = useState([])

	useEffect(() => {
		const fetchCourses = async () => {
			const res = await fetch(`${API}/courses/`)
			const data = await res.json()
			console.log('Список курсов:', data)
			setCourses(data)
		}

		fetchCourses()
	}, [])

	return (
		<>
			{role === 'student' ? (
				<Navigate to='/catalogt' replace />
			) : (
				<div className='h-screen flex flex-col gap-4 py-[50px]'>
					<div className='flex max-[874px]:gap-3 max-[874px]:flex-col-reverse justify-between'>
						<div className='flex gap-4 max-lg:gap-2 h-12'>
							{options.map(option => (
								<RadioButton
									key={option.value}
									name='example'
									value={option.value}
									title={option.title}
									icon={option.icon}
									checked={selected === option.value}
									onChange={() => setSelected(option.value)}
								/>
							))}
						</div>
						<div className='flex gap-4 max-lg:gap-2 h-12'>
							<SearchInput />
							<FilterButton
								option={[
									'по статусу',
									'по алфавиту',
									'по дате создания',
									'по хуйне ',
								]}
							/>
						</div>
					</div>

					<div className='grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 gap-4'>
						{courses.map((course, index) => (
							<motion.div
								key={course.id}
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{
									duration: 0.3,
									delay: index * 0.1,
									ease: 'easeOut',
								}}
							>
								<CourseCard
									title={course.name}
									description={course.description}
									img_path={`${API}/courses/image/${course.id}`}
									status={course.status}
									deadline={course.deadline}
									to={`/course/${course.id}`}
								/>
							</motion.div>
						))}
					</div>
				</div>
			)}
		</>
	)
}

export default CatalogS
