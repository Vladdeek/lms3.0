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

const CreateBtn = ({ onClick, title }) => {
	return (
		<button
			onClick={onClick}
			className='flex flex-col w-2/3 items-center justify-center border-1 border-[var(--middle)] text-[var(--middle)] rounded-xl group hover:border-[var(--hero-epta)] hover:text-[var(--hero-epta)] transition-all cursor-pointer'
		>
			<Blocks size={112} strokeWidth={0.5} />
			<span className='text-base font-medium px-4 py-3 rounded-lg mt-4 transition-all'>
				Создать курс
			</span>
		</button>
	)
}

const CreateModal = ({ isOpen, onClose }) => {
	if (!isOpen) return null

	const [isNameValid, setIsNameValid] = useState(false)
	const [isFileValid, setIsFileValid] = useState(false)

	const isFormValid = isNameValid && isFileValid

	return (
		<div className='fixed inset-0 flex items-center justify-center backdrop-blur-xs z-1000'>
			<div className='bg-[var(--white)] relative p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.125)] z-1001'>
				<X
					onClick={onClose}
					className='absolute top-1 right-1 text-[var(--middle)]'
				/>
				<h2 className='text-2xl font-medium text-[var(--black)] mb-5 text-center'>
					Создание курса
				</h2>
				<form
					action=''
					className='w-[482px] inline-flex flex-col items-center gap-5'
				>
					<InputDefault
						type={'text'}
						placeholder={''}
						title={'Введите название курса'}
						required={true}
						InputStatus={false}
						onStatusChange={setIsNameValid}
					/>
					<TextArea
						type={'text'}
						placeholder={''}
						title={'Введите описание'}
						InputStatus={false}
					/>
					<FileInput
						title='Загрузите превью'
						required={true}
						onStatusChange={setIsFileValid}
					/>
					<input
						className={`px-[51px] py-[14.5px] font-medium text-xl rounded-lg w-fit  transition ${
							isFormValid
								? 'bg-[var(--black)] text-[var(--white)] cursor-pointer'
								: 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed'
						}`}
						type='submit'
						value='Создать курс'
						disabled={!isFormValid}
					/>
				</form>
			</div>
		</div>
	)
}

const Catalog = () => {
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

	const [createModalOpen, setCreateModalOpen] = useState(false)

	return (
		<>
			<CreateModal
				isOpen={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
			/>
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
						<SearchInput />
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

export default Catalog
