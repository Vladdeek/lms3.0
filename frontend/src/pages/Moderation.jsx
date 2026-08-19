import axios from 'axios'
import {
	ArrowLeft,
	CircleQuestionMark,
	FileInput,
	ImageOff,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import api, { API, FILE_API } from '../API'
import { setGlobalError } from '../components/Errors'
import CoursePage from './CoursePage'
import { motion } from 'framer-motion'
import Loader, { AltLoader } from '../components/Loader'
import { InputDefault, SearchInput, TextArea } from '../components/Inputs'
import ModerationComponent from './ModerationView'
import { getCookie, token } from '../TOKEN'
import { RadioButton } from '../components/Buttons'
import BasicPagination from '../components/Pagination'

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

	// const handleSubmit = async () => {
	// 	if (!courseId) return
	// 	const formData = new FormData()
	// 	formData.append('course_status', access ? 'approved' : 'in_development')

	// 	try {
	// 		const res = await api.put(`${API}/courses/${courseId}`, formData, {
	// 			withCredentials: true,
	// 			headers: {
	//
	// 			},
	// 		})

	// 		const data = res.data

	// 		onClose?.()
	// 		onChange?.('good')
	// 	} catch (error) {
	// 		console.error('Ошибка сервера:', error)
	// 	}
	// }
	const handleSubmit = async () => {
		console.log(courseId)
		if (!courseId) return

		try {
			console.log('2')
			const res = await api.post(
				`${API}/courses/${courseId}/revise`,
				{
					course_status: access ? 'approved' : 'in_development',
					description: description,
					notification_type: access ? 'good' : 'bad',
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)
			console.log('3')

			const data = res.data

			onClose?.()
			onChange?.('good')
		} catch (error) {}
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
						className={`px-4 py-3 font-normal text-xl rounded-lg w-fit transition-all ${access === false && description.length === 0 ? 'bg-[var(--middle)] text-[var(--light-middle)]' : 'bg-[var(--black)] text-[var(--white)] hover:bg-[var(--hero-epta)] active:scale-97 cursor-pointer'}   `}
						onClick={() => handleSubmit()}
						disabled={access === false && description.length === 0}
					>
						Подтвердить
					</button>
				</div>
			</div>
		</div>
	)
}

const Moderation = ({ role }) => {
	const options = [
		{ value: 0, title: 'На рассмотрении' },
		{ value: 1, title: 'Все' },
		// { value: 2, title: 'Рецензировано' },
	]
	const [selected, setSelected] = useState(0)
	const [page, setPage] = useState(1)

	const [courses, setCourses] = useState([])
	const [coursesIsLoading, setCoursesIsLoading] = useState(false)

	const [searchValue, setSearchValue] = useState('')
	const [searchIsLoading, setSearchIsLoading] = useState(false)

	const [status, setStatus] = useState(null)

	const fetchAllCourses = async (term = '') => {
		setCoursesIsLoading(true)
		try {
			const res = await api.get(
				`${API}/courses/${selected === 0 ? 'all/pending' : ''}?size=${25}&page=${page}${term.length > 0 ? `&term=${term}` : ''}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)

			setGlobalError(null)

			setCourses(res.data)

			setActive(null)
		} catch (error) {
			setGlobalError(error)
		} finally {
			setCoursesIsLoading(false)
		}
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			fetchAllCourses(searchValue)
		}, 500) // ← задержка, например 500 мс

		return () => clearTimeout(timer)
	}, [searchValue])

	useEffect(() => {
		setPage(1)
		fetchAllCourses()
	}, [selected])

	useEffect(() => {
		fetchAllCourses()
	}, [page])

	useEffect(() => {
		status !== null && fetchAllCourses()
		setStatus(null)
	}, [status]) //при изменении статуса курса

	const [active, setActive] = useState(null)
	const [ModalOpen, setModalOpen] = useState(false)
	return (
		<>
			<AnswerModal
				courseId={active}
				isOpen={ModalOpen}
				onClose={() => setModalOpen(false)}
				onChange={() => setStatus()}
			/>
			<div className='w-full relative h-[85vh] mt-10 xl:grid xl:grid-cols-[318px_auto] gap-3 '>
				<div
					className={`
    w-full h-full bg-[var(--white)] rounded-2xl
    flex flex-col items-center gap-3 shadow-[var(--shadow)]
    overflow-y-scroll hide-scrollbar p-4
    ${active !== null ? 'hidden xl:flex' : 'flex'}
  `}
				>
					<SearchInput
						width='100%'
						height={48}
						onChange={e => setSearchValue(e.target.value)}
						value={searchValue}
						loading={searchIsLoading}
					/>
					<div className='w-full flex gap-1'>
						{options?.map((item, index) => {
							return (
								<RadioButton
									key={item?.value}
									name='example'
									value={item?.value}
									title={item?.title}
									icon={item?.icon}
									checked={selected === item?.value}
									onChange={() => setSelected(item?.value)}
									fill={true}
									wfull={true}
									className={'whitespace-nowrap'}
								/>
							)
						})}
					</div>

					<div className=' flex flex-col gap-3 w-full items-center'>
						{coursesIsLoading ? (
							<div className='w-full h-20 flex items-center justify-center'>
								<AltLoader />
							</div>
						) : courses?.length === 0 ? (
							<p className='text-[var(--middle)]'>Нет новых курсов</p>
						) : (
							courses?.items?.map((item, index) => (
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
										fullname={item?.teacher_profile_personal_data}
										img={item?.image_url}
										user_img={item?.teacher_profile_personal_data?.photo}
										onClick={() => setActive(item?.id)}
										active={active === item?.id}
									/>
								</motion.div>
							))
						)}
					</div>
					<div className='absolute bottom-2 bg-[var(--white)] flex w-75 rounded-lg shadow-[var(--shadow)] justify-center p-1'>
						<BasicPagination
							count={courses.pages}
							page={page}
							onPageChange={setPage}
							siblingCount={0}
						/>
					</div>
				</div>
				<div
					className={`
    w-full h-full bg-[var(--white)] rounded-2xl px-4
    flex flex-col min-h-0
    items-center justify-center shadow-[var(--shadow)]
    ${active === null ? 'hidden xl:flex' : 'flex'}
  `}
				>
					{active === null ? (
						<p className='text-xl text-[var(--middle)]'>Выберите курс</p>
					) : (
						<div className='relative w-full mx-5 h-full flex flex-col gap-5 '>
							<div className='absolute top-4 w-full flex justify-between'>
								<button
									onClick={() => setActive(null)}
									className='font-medium min-xl:opacity-0 rounded-lg bg-[var(--white)] text-[var(--black)] w-fit px-5 py-2 hover:bg-[var(--light-middle)]  cursor-pointer transition-all active:scale-97'
								>
									<ArrowLeft />
								</button>

								<button
									onClick={() => setModalOpen(true)}
									disabled={selected !== 0}
									className={`${selected !== 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--hero-epta)] hover:text-white cursor-pointer active:scale-97'} font-medium rounded-lg bg-[var(--black)] text-[var(--white)] w-fit px-5 py-2  transition-all `}
								>
									Рецензировать
								</button>
							</div>

							<div className='mt-1 flex-1 mb-4'>
								<ModerationComponent moderationCourseId={active} />
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	)
}
export default Moderation
