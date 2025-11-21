import axios from 'axios'
import { CircleQuestionMark, FileInput, ImageOff, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { API, FILE_API } from '../API'
import { useError } from '../components/Errors'
import CoursePage from './CoursePage'
import { motion } from 'framer-motion'
import Loader from '../components/Loader'
import { InputDefault, TextArea } from '../components/Inputs'
import ModerationComponent from './ModerationView'
import { getCookie, token } from '../TOKEN'
import axios from 'axios'

const ModerationCourseCard = ({
	img,
	user_img,
	title,
	fullname,
	onClick,
	active,
}) => {
	return (
		<>
			<div
				onClick={onClick}
				className={`w-full h-fit rounded-xl items-center gap-3 p-4 text-[var(--black)] border-1 cursor-pointer transition-all active:scale-99 select-none flex ${
					active
						? 'border-[var(--hero-epta)] shadow-[var(--shadow-hero)]'
						: 'border-transparent shadow-[var(--shadow)]'
				}`}
			>
				<div
					className={`h-15 w-15 rounded-md overflow-hidden ${
						!img && 'border-1 border-[var(--middle)] opacity-50 p-3 '
					}`}
				>
					{img ? (
						<img
							src={`${FILE_API}${img}`}
							alt=''
							className='object-cover aspect-square w-full h-full'
						/>
					) : (
						<ImageOff strokeWidth={1.125} className='w-full h-full' />
					)}
				</div>

				<div className='flex flex-col gap-1 w-3/5'>
					<p className='font-medium text-xl'>{title || 'Название курса'}</p>
					<div className='flex gap-3 items-center w-full'>
						<div
							className={`h-6 w-6 rounded-full overflow-hidden ${
								!user_img && 'border-1 border-[var(--middle)] opacity-50 p-1'
							}`}
						>
							{user_img ? (
								<img
									src={`${FILE_API}${user_img}`}
									alt=''
									className='object-cover aspect-square w-full h-full'
								/>
							) : (
								<ImageOff strokeWidth={1.125} className='w-full h-full' />
							)}
						</div>
						<p
							className={`font-light text-sm w-full overflow-hidden text-ellipsis whitespace-nowrap ${
								!fullname &&
								'text-[var(--red-status-text)] bg-[var(--red-status-bg)] rounded-md px-2 py-1'
							}`}
						>
							{fullname
								? `${fullname?.last_name || ''} ${fullname?.first_name || ''} ${
										fullname?.middle_name || ''
								  }`
								: 'ФИО автора не определено'}
						</p>
					</div>
				</div>
			</div>
		</>
	)
}

const AnswerModal = ({ isOpen, onClose, courseId, onChange }) => {
	if (!isOpen) return null

	const [description, setDescription] = useState('')

	const [access, setAccess] = useState(true)

	const handleSubmit = async () => {
		if (!courseId) return
		const formData = new FormData()
		formData.append('course_status', access ? 'approved' : 'pending')

		try {
			const res = await axios.put(`${API}/courses/${courseId}`, formData, {
				withCredentials: true,
				headers: {
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			const data = res.data

			onClose?.()
			onChange?.('good')
		} catch (error) {
			console.error('Ошибка сервера:', error)
			setError(error.response ? String(error.response.status) : '500')
		}
	}

	return (
		<div className='fixed inset-0 flex items-center justify-center backdrop-blur-xs z-1000'>
			<div className='bg-[var(--white)] relative p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.125)] z-1001'>
				<X
					onClick={onClose}
					className='absolute top-1 right-1 text-[var(--middle)] hover:text-red-500 transition-all cursor-pointer'
				/>
				<h2 className='text-2xl font-medium text-[var(--black)] mb-5 text-center'>
					Создание курса
				</h2>
				<div className='w-[482px] inline-flex flex-col items-center gap-5'>
					<div className='flex gap-3 w-full'>
						<button
							onClick={() => setAccess(true)}
							className={`rounded-lg text-center ${
								access
									? 'bg-[var(--correct-lvl)] text-white'
									: 'bg-[var(--black)] text-[var(--white)]'
							} w-full  py-4 hover:bg-[var(--correct-lvl)] hover:text-white cursor-pointer transition-all active:scale-97 duration-250 font-medium`}
						>
							Допустить к публикации
						</button>
						<button
							onClick={() => setAccess(false)}
							className={`rounded-lg text-center ${
								!access
									? 'bg-[var(--not-correct-lvl)] text-white'
									: 'bg-[var(--black)] text-[var(--white)]'
							}  w-full py-4 hover:bg-[var(--not-correct-lvl)] hover:text-white cursor-pointer transition-all duration-250 active:scale-97 font-medium`}
						>
							Отклонить курс
						</button>
					</div>

					<TextArea
						type='text'
						placeholder='Введите комментарий почему вы отклонили этот курс...'
						title='Комментарий автору'
						value={description}
						onChange={e => setDescription(e.target.value)}
						InputStatus={false}
						readOnly={access}
					/>

					<button
						className={`px-4 py-3 font-normal text-xl rounded-lg w-fit transition-all bg-[var(--black)] text-[var(--white)] cursor-pointer hover:bg-[var(--hero-epta)] active:scale-97`}
						onClick={() => handleSubmit()}
					>
						Подтвердить
					</button>
				</div>
			</div>
		</div>
	)
}

const Moderation = ({ role }) => {
	const [courses, setCourses] = useState([])

	const [status, setStatus] = useState(null)

	const { setError } = useError()

	const fetchAllCourses = async () => {
		try {
			const res = await axios.get(`${API}/courses/all/pending`, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			setError(null)

			console.log('courses: ', res)

			setCourses(res.data)

			setActive(null)
		} catch (err) {
			console.log(err)
			if (err.response) {
				console.log('error: ', err.response.status)
				setError(err.response.status.toString())
			} else {
				setError('500')
			}
		}
	}

	useEffect(() => {
		fetchAllCourses()
	}, []) //при загрузке страницы

	useEffect(() => {
		status !== null && fetchAllCourses()
		setStatus(null)
	}, [status]) //при изменении статуса курса

	const [active, setActive] = useState(null)
	const [ModalOpen, setModalOpen] = useState(false)

	return (
		<>
			<AnswerModal
				courseId={courses[active]?.id}
				isOpen={ModalOpen}
				onClose={() => setModalOpen(false)}
				onChange={() => setStatus()}
			/>
			<div className='w-full h-[80vh] grid grid-cols-[1fr_4fr]  gap-5 mt-10'>
				<div className='w-full bg-[var(--white)] rounded-2xl flex flex-col items-center gap-3 overflow-y-scroll hide-scrollbar p-4'>
					<p className='font-medium text-xl text-[var(--black)]'>Новые курсы</p>
					<div className='flex flex-col-reverse gap-3 w-full items-center'>
						{courses?.map((item, index) => (
							<motion.div
								key={index}
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{
									duration: 0.3,
									delay: index * 0.1,
									ease: 'easeOut',
								}}
								className='w-full'
							>
								<ModerationCourseCard
									title={item?.name}
									fullname={item?.teacher_profile_personal_data?.personal_data}
									img={item?.image_url}
									user_img={item?.teacher_profile_personal_data?.photo}
									onClick={() => setActive(index)}
									active={active === index}
								/>
							</motion.div>
						))}
					</div>
				</div>
				<div className='w-full h-full flex items-center justify-center bg-[var(--white)] rounded-2xl'>
					{active === null ? (
						<p className='text-xl text-[var(--middle)]'>Выберите курс</p>
					) : (
						<div className='relative w-full h-full mx-5 flex flex-col gap-5 '>
							<button
								onClick={() => setModalOpen(true)}
								className='absolute font-medium rounded-lg bg-[var(--black)] text-[var(--white)] w-fit px-5 py-2 hover:bg-[var(--hero-epta)] hover:text-white cursor-pointer transition-all active:scale-97 top-4 right-0'
							>
								Рецензировать
							</button>
							<div className='mt-1'>
								<ModerationComponent moderationCourseId={courses[active]?.id} />
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	)
}
export default Moderation
