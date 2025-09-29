import { useEffect, useReducer, useState } from 'react'
import { Button, FilterButton, RadioButton } from '../components/Buttons'
import { Blocks, FunnelPlus, LayoutGrid, Radio, X } from 'lucide-react'
import { CourseCard } from '../components/Cards'
import {
	FileInput,
	InputDefault,
	SearchInput,
	TextArea,
} from '../components/Inputs'
import { API } from '../API'
import { motion } from 'framer-motion'
import { Navigate } from 'react-router-dom'

const CreateBtn = ({ onClick, title }) => {
	return (
		<button
			onClick={onClick}
			className='flex flex-col w-2/3 max-md:w-full items-center justify-center border-1 border-[var(--middle)] text-[var(--middle)] rounded-xl group hover:border-[var(--hero-epta)] hover:text-[var(--hero-epta)] transition-all cursor-pointer max-md:h-75 max-md:mb-30 h-129'
		>
			<Blocks size={112} strokeWidth={0.5} />
			<span className='text-base font-medium px-4 py-3 rounded-lg mt-4 transition-all'>
				Создать курс
			</span>
		</button>
	)
}

const CreateModal = ({ isOpen, onClose, onCreate }) => {
	if (!isOpen) return null

	const [isNameValid, setIsNameValid] = useState(false)
	const [isFileValid, setIsFileValid] = useState(false)
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [img, setImg] = useState(null)

	const isFormValid = isNameValid && isFileValid

	const handleSubmit = async e => {
		e.preventDefault()
		if (!isFormValid) return

		const formData = new FormData()
		formData.append('name', title)
		formData.append('description', description)
		formData.append(
			'teacher_profile_id',
			'27f1ca7d-70b5-43b3-b310-ffd251670d62'
		)
		formData.append('image', img)

		console.log(formData)

		const res = await fetch(`${API}/courses`, {
			method: 'POST',
			body: formData,
		})

		if (!res.ok) {
			console.error('Ошибка сервера:', res.status)
			return
		}

		const data = await res.json()
		console.log('Ответ сервера:', data)

		onCreate(data)
		onClose()
		setTitle('')
		setDescription('')
		setImg(null)
	}

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
					onSubmit={handleSubmit}
					className='w-[482px] inline-flex flex-col items-center gap-5'
				>
					<InputDefault
						type='text'
						placeholder=''
						title='Введите название курса'
						required={true}
						InputStatus={false}
						onStatusChange={setIsNameValid}
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>

					<TextArea
						type='text'
						placeholder=''
						title='Введите описание'
						value={description}
						onChange={e => setDescription(e.target.value)}
						InputStatus={false}
					/>
					<FileInput
						title='Загрузите превью'
						required={true}
						onStatusChange={setIsFileValid}
						onFileChange={file => setImg(file)}
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

const Catalog = ({ role }) => {
	const options = [
		{ value: 0, title: 'Добавленные курсы', icon: LayoutGrid },
		{ value: 1, title: 'Вебинар', icon: Radio },
	]

	const [selected, setSelected] = useState(0)
	const [createModalOpen, setCreateModalOpen] = useState(false)
	const [courses, setCourses] = useState([])
	const [image, setImage] = useState([])

	const handleCreateCourse = newCourse => {
		setCourses(prev => [...prev, newCourse])
	}

	useEffect(() => {
		const fetchCourses = async () => {
			const res = await fetch(`${API}/courses/`)
			const data = await res.json()
			console.log('Список курсов:', data)
			setCourses(data)
		}

		fetchCourses()
	}, [])

	return role !== 'student' ? (
		<Navigate to='/catalogs' replace />
	) : (
		<>
			<CreateModal
				isOpen={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
				onCreate={handleCreateCourse}
			/>
			<div className='h-full flex flex-col gap-4 py-[50px] '>
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
								to={`/constructor/${course.id}`}
							/>
						</motion.div>
					))}

					<motion.div
						key={courses.length + 1}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{
							duration: 0.3,
							delay: courses.length * 0.1,
							ease: 'easeOut',
						}}
					>
						<CreateBtn
							onClick={() => setCreateModalOpen(true)}
							title='Создать новый курс'
							icon={LayoutGrid}
						/>
					</motion.div>
				</div>
			</div>
		</>
	)
}

export default Catalog
