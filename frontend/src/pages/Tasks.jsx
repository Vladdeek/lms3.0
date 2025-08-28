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

const Tasks = () => {
	const options = [{ value: 0, title: 'Активные курсы', icon: LayoutGrid }]

	const courses = [
		{
			title: 'Очень большой курс 1',
			education: 'Бакалавриат',
			course: 'Курс 1',
			status: 'Опубликован',
			img: 'https://i.pinimg.com/736x/74/65/59/746559a982407b366a16d7278cc88519.jpg',
			deadline: '2023-12-31',
		},
		{
			title: 'Очень большой курс 2',
			education: 'Магистратура',
			course: 'Курс 2',
			status: 'В разработке',
			img: 'https://i.pinimg.com/736x/50/e0/91/50e0915b5b2879196b1db57a1e3acc00.jpg',
		},
	]

	const [selected, setSelected] = useState(0)

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
							to={`/course/${index}`}
						/>
					))}
				</div>
			</div>
		</>
	)
}

export default Tasks
