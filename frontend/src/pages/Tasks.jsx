import { useEffect, useState } from 'react'
import { Button, RadioButton } from '../components/Buttons'
import { Blocks, FunnelPlus, LayoutGrid, Radio, X } from 'lucide-react'
import { CourseCard } from '../components/Cards'
import {
	FileInput,
	InputDefault,
	SearchInput,
	TextArea,
} from '../components/Inputs'

const CatalogS = () => {
	const options = [
		{ value: 0, title: 'Добавленные курсы', icon: LayoutGrid },
		{ value: 1, title: 'Вебинар', icon: Radio },
	]

	const [courses, setCourses] = useState([
		{
			title: 'Объектно ориентированное программирование c++',
			education: 'Бакалавриат',
			course: 'Курс 1',
			status: 'Опубликован',
			img: 'https://i.pinimg.com/736x/7e/d7/a5/7ed7a5d7de6a06d31106b37399da23a5.jpg',
			deadline: '2025-12-31',
		},
		{
			title: 'Математический анализ',
			education: 'Бакалавриат',
			course: 'Курс 2',
			status: 'В разработке',
			img: 'https://i.pinimg.com/736x/5f/83/77/5f83771d9306429e18cec682d4445414.jpg',
		},
	])

	const [selected, setSelected] = useState(0)
	const [createModalOpen, setCreateModalOpen] = useState(false)

	const handleCreateCourse = newCourse => {
		setCourses(prev => [...prev, newCourse])
	}

	return (
		<>
			<div className='h-screen flex flex-col gap-4 py-[50px]'>
				<div className='flex justify-between'>
					<div className='flex gap-4 h-12'>
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
					<div className='flex gap-4 h-12'>
						<SearchInput width={383} />
						<Button icon={FunnelPlus} />
					</div>
				</div>

				<div className='grid grid-cols-4 gap-4'>
					{courses.map((course, index) => (
						<CourseCard
							key={index}
							title={course.title}
							img_path={course.img}
							education={course.education}
							course={course.course}
							status={course.status}
							deadline={course.deadline}
							to={`/course`}
						/>
					))}
				</div>
			</div>
		</>
	)
}

export default CatalogS
