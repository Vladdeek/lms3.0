import { useState } from 'react'
import { RadioButton } from '../components/Buttons'
import { Blocks, LayoutGrid, Radio, X } from 'lucide-react'
import { CourseCard } from '../components/Cards'
import { InputDefault } from '../components/Inputs'

const CreateBtn = ({ onClick, title }) => {
	return (
		<button
			onClick={onClick}
			className='flex flex-col w-2/3 items-center justify-center border-1 border-[var(--middle)] text-[var(--middle)] rounded-xl'
		>
			<Blocks size={112} strokeWidth={0.5} />
			<span className='text-base font-medium px-4 py-3 border-1 border-[var(--middle)] rounded-lg mt-4 shadow-[0_2px_8px_rgba(0,0,0,0.125)] bg-transparent text-[var(--middle)] hover:border-[var(--hero-epta)] hover:text-[var(--hero-epta)] transition-all'>
				Создать курс
			</span>
		</button>
	)
}

const CreateModal = ({ isOpen, onClose }) => {
	if (!isOpen) return null

	return (
		<div className='fixed inset-0 flex items-center justify-center backdrop-blur-xs z-1000'>
			<div className='bg-[var(--white)] relative p-6 rounded-lg shadow-lg z-1001'>
				<X
					onClick={onClose}
					className='absolute top-1 right-1 text-[var(--middle)]'
				/>
				<h2 className='text-2xl font-medium text-[var(--black)] mb-4'>
					Создание курса
				</h2>
				<form action=''>
					<InputDefault
						type={'text'}
						placeholder={''}
						title={'Введите название курса'}
						required={true}
						InputStatus={false}
					/>
					<InputDefault
						type={'text'}
						placeholder={''}
						title={'Введите описание'}
						InputStatus={false}
					/>
				</form>
				<button className='mt-4 px-4 py-2 bg-[var(--hero-epta)] text-white rounded-lg'>
					Создать курс
				</button>
			</div>
		</div>
	)
}

const MainPage = () => {
	const options = [
		{ value: 0, title: 'Добавленные курсы', icon: LayoutGrid },
		{ value: 1, title: 'Вебинар', icon: Radio },
	]

	const courses = [
		{
			title: 'Очень большой курс 1',
			education: 'Бакалавриат',
			course: 'Курс 1',
			status: 'Опубликован',
			img: 'https://picsum.photos/200/300',
			deadline: '2023-12-31',
		},
		{
			title: 'Очень большой курс 2',
			education: 'Магистратура',
			course: 'Курс 2',
			status: 'В разработке',
			img: 'https://picsum.photos/200/300',
		},
	]

	const [selected, setSelected] = useState(0)

	const [createModalOpen, setCreateModalOpen] = useState(false)

	return (
		<>
			<CreateModal
				isOpen={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
			/>
			<div className='h-screen flex flex-col gap-4 py-[50px]'>
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
					<CreateBtn
						onClick={() => setCreateModalOpen(true)}
						title='Создать новый курс'
						icon={LayoutGrid}
					/>
				</div>
			</div>
		</>
	)
}

export default MainPage
