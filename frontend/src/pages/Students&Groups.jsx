import { act, useEffect, useState } from 'react'
import { OptionInput, OptionInput2 } from '../components/Inputs'

import {
	ArrowBigDownDash,
	CalendarDays,
	Filter,
	ImageOff,
	LaptopMinimalCheck,
	NotebookPen,
} from 'lucide-react'
import { Button, FilterButton, SubmitButton } from '../components/Buttons'
import MoreVariantView from '../components/TestView/MoreVariantsView'
import OneVariantView from '../components/TestView/OneVariantView'
import SortVariantView from '../components/TestView/SortVariantsView'
import OpenQuestionView from '../components/TestView/OpenQuestionView'
import { setSelection } from 'slate'
import { se } from 'date-fns/locale'
import { setGlobalError } from '../components/Errors'
import axios from 'axios'
import api, { API, FILE_API } from '../API'
import Loader from '../components/Loader'
import MoreVariantCheckView from '../components/TestCheckView/VariantsCheckView'
import VariantCheckView from '../components/TestCheckView/VariantsCheckView'
import OpenQuestionCheckView from '../components/TestCheckView/OpenQuestionCheckView'
import { getCookie, token } from '../TOKEN'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import SortVariantCheckView from '../components/TestCheckView/SortVariantsCheckView'

const StudentCard = ({ PersonalData, img_path, onClick, active }) => {
	return (
		<div
			onClick={onClick}
			className={`bg-[var(--white)]  flex gap-3 rounded-md px-3 py-[10px] cursor-pointer ${
				active
					? 'ring-1 ring-[var(--hero-epta)] shadow-[var(--hero-shadow)]'
					: 'shadow-[var(--shadow)] '
			}`}
		>
			{img_path !== null ? (
				<img
					className='aspect-square rounded-full h-10 '
					src={FILE_API + img_path}
					alt=''
				/>
			) : (
				<ImageOff className='h-10 w-10 p-1 text-[var(--black)] opacity-50 aspect-square rounded-full' />
			)}

			<div className='flex flex-col justify-between'>
				<p
					className={`text-[var(--black)] font-medium text-sm ${
						active && 'text-[var(--hero-epta)]'
					}`}
				>
					{PersonalData?.last_name ||
					PersonalData?.first_name ||
					PersonalData?.middle_name
						? `${PersonalData?.last_name} 
					${PersonalData?.first_name} 
					${PersonalData?.middle_name}`
						: 'Данные не указаны'}
				</p>
			</div>
		</div>
	)
}

const MaterialCard = ({ title }) => {
	return (
		<>
			<div className='flex gap-2 h-[50px]'>
				<div className='bg-[var(--white)] rounded-lg shadow-[var(--shadow)] w-full flex gap-3 px-3 py-[9px] items-center select-none'>
					<img className='h-8 w-8' src='./assets/icons/file1.svg' alt='' />
					<p className='text-sm text-[var(--black)]'>{title}</p>
				</div>
				<div className='bg-[var(--white)] rounded-lg shadow-[var(--shadow)] w-10 flex justify-center items-center cursor-pointer hover:scale-110 active:scale-95 active:brightness-95 transition-all'>
					<ArrowBigDownDash />
				</div>
			</div>
		</>
	)
}

const StudentTable = () => {
	const type = [
		'ПР1',
		'T1',
		'ПР2',
		'T2',
		'ПР3',
		'T3',
		'ПР4',
		'T4',
		'ПР5',
		'T5',
		'ПР6',
		'T6',
		'ПР7',
		'T7',
	]
	const StudentScore = [
		{
			name: 'Рязанов Владислав Денисович',
			score: [3, 4, '', 5, 4, 3, '', 5, 5, 4, 4, 3, '', ''],
		},
		{
			name: 'Иванов Иван Иванович',
			score: [3, 2, '', '', 4, 3, 5, 5, '', 4, 4, 3, '', ''],
		},
		{
			name: 'Ковалев Евген Алексеевич',
			score: [3, 4, '', '', 4, 2, '', 5, 3, 4, 4, 3, '', ''],
		},
		{
			name: 'Козак Дмитрий Денисович',
			score: [3, 4, '', 2, 4, 3, '', '', 2, 4, 4, '', '', ''],
		},
	]
	return (
		<>
			<div className='flex items-center text-[var(--black)]  rounded-lg'>
				<div className='w-1/4 flex items-center'>
					<div className='w-1/5 flex items-center justify-center'>
						<p className='bg-[var(--light-gray)] h-full w-full text-center py-2 rounded-lg'>
							№
						</p>
					</div>
					<div className='w-4/5 flex items-center justify-center'>
						<p>ФИО</p>
					</div>
				</div>
				<div className='w-3/4 flex items-center justify-between'>
					{type.map((item, index) => {
						return (
							<div
								className={`flex items-center justify-center w-15 h-full py-2 rounded-lg ${
									index % 2 === 0
										? 'bg-[var(--light-gray)]'
										: 'bg-[var(--white)] '
								}`}
							>
								<p className='text-center' key={index}>
									{item}
								</p>
							</div>
						)
					})}
					<p className='w-15 text-center bg-[var(--light-gray)] h-full py-2 rounded-lg'>
						ср/б
					</p>
				</div>
			</div>
			<div className='flex flex-col gap-2 mt-3'>
				{StudentScore.map((item, index) => {
					return (
						<StudentCard4Table
							num={index + 1}
							FullName={item.name}
							scores={item.score}
							average={4}
						/>
					)
				})}
			</div>
		</>
	)
}

const StudentCard4Table = ({ num, FullName, scores }) => {
	const calculateAverage = scores => {
		const validScores = scores.filter(score => score !== '' && !isNaN(score))
		if (validScores.length === 0) return 0
		const sum = validScores.reduce((total, score) => total + Number(score), 0)
		return (sum / validScores.length).toFixed(0)
	}
	const average = calculateAverage(scores)
	return (
		<>
			<div className='flex items-center text-[var(--black)] shadow-[var(--shadow)] rounded-lg overflow-hidden'>
				<div className='w-1/4 flex items-center'>
					<div className='w-1/5 flex items-center justify-center'>
						<p className='bg-[var(--light-gray)] h-full w-full text-center py-2'>
							{num}
						</p>
					</div>
					<div className='w-4/5 flex items-center justify-center'>
						<p className='bg-[var(--white)] h-full w-full text-center py-2'>{`${
							FullName.split(' ')[0]
						} ${FullName.split(' ')[1]} ${FullName.split(' ')[2][0]}.`}</p>
					</div>
				</div>
				<div className='w-3/4 flex items-center justify-between'>
					{scores.map((item, index) => {
						return (
							<div
								key={index}
								className={`flex items-center justify-center w-15 h-full ${
									item.length !== 0 ? 'py-2' : 'py-5'
								} ${
									index % 2 === 0
										? 'bg-[var(--light-gray)]'
										: 'bg-[var(--white)] '
								}`}
							>
								<p className='text-center'>{item}</p>
							</div>
						)
					})}
					<p className='w-15 text-center bg-[var(--light-gray)] py-2' h-full>
						{average}
					</p>
				</div>
			</div>
		</>
	)
}

const TaskCard = ({ title, type, isActive, onClick, grade }) => {
	return (
		<div
			onClick={onClick}
			className={`bg-[var(--white)] rounded-xl p-2 items-center flex justify-between ${
				isActive
					? 'ring-1 ring-[var(--hero-epta)] shadow-[var(--hero-shadow)]'
					: 'shadow-[var(--shadow)]'
			} transition-all cursor-pointer`}
		>
			<div className='flex gap-3 text-[var(--black)]'>
				{type === 'practice' ? (
					<>
						<NotebookPen size={24} />
						<p className='font-medium '>Практика</p>
					</>
				) : (
					<>
						<LaptopMinimalCheck size={24} />
						<p className='font-medium '>Тест</p>
					</>
				)}
				<p className='font-medium text-[var(--middle)]'>/</p>
				<p className='text-[var(--middle)]'>{title}</p>
			</div>
			{grade.grade_status === 'assessed' ? (
				<div
					className={`text-white ${
						grade.score > 3
							? 'bg-[var(--correct-lvl)]'
							: grade.score > 2
								? 'bg-[var(--middle-correct-lvl)]'
								: grade.score > 0
									? 'bg-[var(--not-correct-lvl)]'
									: ''
					}  aspect-square flex justify-center items-center h-8 w-auto rounded-md`}
				>
					<p className='pt-1'>{grade.score}</p>
				</div>
			) : (
				<div className=' bg-[var(--white)] aspect-square flex justify-center items-center h-8 w-auto rounded-md'>
					<p className='pt-1'></p>
				</div>
			)}
		</div>
	)
}

const PracticeView = ({ content }) => {
	return (
		<div className='flex flex-col w-full gap-3'>
			<TaskCard title={content?.title} type={content?.type} isActive={false} />
			<p className='font-medium'>Предоставлены материалы для оценки</p>
			{content?.material.map(item => {
				return <MaterialCard title={item} />
			})}
			<div className='flex flex-col gap-3 w-1/4'>
				<p className='text-[var(--middle)]'>Введите балл</p>
				<OptionInput Options={[1, 2, 3, 4, 5]} />
			</div>
		</div>
	)
}

const LevelsBar = ({ questions, activeIndex, setActiveIndex }) => {
	const styles = {
		correct: {
			border:
				'border-b-[3px] border-[var(--correct-lvl)] shadow-[var(--correct-glow)]',
			active: 'bg-[var(--correct-lvl)] text-white',
			inactive:
				'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--correct-lvl)] hover:text-white',
		},
		partially_correct: {
			border:
				'border-b-[3px] border-[var(--middle-correct-lvl)] shadow-[var(--middle-correct-glow)]',
			active: 'bg-[var(--middle-correct-lvl)] text-white',
			inactive:
				'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--middle-correct-lvl)] hover:text-white shadow-[var(--shadow)]',
		},
		incorrect: {
			border:
				'border-b-[3px] border-[var(--not-correct-lvl)] shadow-[var(--not-correct-glow)]',
			active: 'bg-[var(--not-correct-lvl)] text-white',
			inactive:
				'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--not-correct-lvl)] hover:text-white',
		},
		default: {
			border: 'border-b-[3px] border-[var(--middle)] shadow-[var(--shadow)]',
			active: 'bg-[var(--middle)] text-white',
			inactive:
				'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--middle)] hover:text-white',
		},
	}

	return (
		<div className='flex gap-3 flex-wrap'>
			{questions?.map((q, idx) => {
				const status = q?.correctness_status
				const style = styles[status] || styles.default
				const stateClass = activeIndex === idx ? style.active : style.inactive

				return (
					<div
						key={q.id}
						onClick={() => setActiveIndex(idx)}
						className={`w-10 h-10 pt-1 flex justify-center items-center rounded-md cursor-pointer transition-all
						${style.border}
						${stateClass}
						active:scale-90`}
					>
						{idx + 1}
					</div>
				)
			})}
		</div>
	)
}

const TestView = ({ id, studentId }) => {
	const [activeIndex, setActiveIndex] = useState(null)
	const [questions, setQuestions] = useState([])
	const [question, setQuestion] = useState([])
	const [loading, setLoading] = useState(false)
	const [grade, setGrade] = useState(null)

	const fetchQuestions = async () => {
		try {
			const res = await api.get(
				`${API}/student-profile/${studentId}/assignment/test/preview?test_id=${id}`,
			)
			setQuestions(res.data.questions)
			setGrade({ score: res.data.score, grade_status: res.data.grade_status })
		} catch (e) {}
	}

	const finishCheck = async () => {
		try {
			const res = await api.put(
				`${API}/student-profile/${studentId}/assignment/test/grade?test_id=${id}`,
			)
		} catch (e) {}
	}

	useEffect(() => {
		fetchQuestions()
	}, [id, studentId])

	useEffect(() => {
		const fetchQuestion = async () => {
			setLoading(true)
			try {
				const res = await api.get(
					`${API}/student-profile/${studentId}/assignment/test/question/answer?test_id=${id}&question_id=${questions[activeIndex]?.question_id}`,
				)
				setQuestion(res.data)
				setLoading(false)
			} catch (e) {}
		}
		activeIndex !== null && fetchQuestion()
	}, [activeIndex])

	return (
		<div className='w-full flex flex-col  gap-3'>
			<div className='w-full flex justify-between'>
				<LevelsBar
					questions={questions}
					activeIndex={activeIndex}
					setActiveIndex={setActiveIndex}
				/>
				{grade !== null &&
					(grade.grade_status === 'assessed' ? (
						<div
							className={`text-white ${
								grade.score > 3
									? 'bg-[var(--correct-lvl)]'
									: grade.score > 2
										? 'bg-[var(--middle-correct-lvl)]'
										: grade.score > 0
											? 'bg-[var(--not-correct-lvl)]'
											: ''
							}  aspect-square flex justify-center items-center h-full w-auto rounded-md`}
						>
							<p className='pt-1'>{grade.score}</p>
						</div>
					) : (
						<Button
							style='black'
							onClick={finishCheck}
							textSize={16}
							title={'Завершить оценивание'}
						/>
					))}
			</div>

			<div className='flex justify-center'>
				{loading ? (
					<Loader />
				) : (
					(() => {
						if (question?.type === 'multiple' || question?.type === 'single') {
							return (
								<VariantCheckView
									answers={question?.answers}
									media={question?.media}
									question={question?.question}
									type={question?.type}
								/>
							)
						} else if (question?.type === 'matching') {
							return (
								<SortVariantCheckView
									question={question?.question}
									media={question?.media}
									answers={question?.answers}
								/>
							)
						} else if (question?.type === 'open') {
							return (
								<OpenQuestionCheckView
									value={question?.answers}
									media={question?.media}
									question={question?.question}
									info={{
										studentId: studentId,
										questionId: questions[activeIndex]?.question_id,
										score: question?.score,
										correctness_status: question?.correctness_status,
									}}
									reloadFetch={() => fetchQuestions()}
								/>
							)
						}

						return null
					})()
				)}
			</div>
		</div>
	)
}

const StudentsAndGroups = () => {
	const [searchParams, setSearchParams] = useSearchParams()

	const courseId = searchParams.get('course')
	const groupId = searchParams.get('group')
	const studentId = searchParams.get('student')
	const assignmentId = searchParams.get('assignment')
	const assignmentType = searchParams.get('type')

	const [courses, setCourses] = useState([])
	const [groups, setGroups] = useState([])
	const [students, setStudents] = useState([])
	const [tasks, setTasks] = useState([])

	const selectedCourseIndex = courses.findIndex(c => c.id == courseId)
	const selectedGroupIndex = groups.findIndex(g => g.id == groupId)

	const selectedAssignment =
		assignmentId && assignmentType
			? { id: assignmentId, type: assignmentType }
			: null

	const updateQuery = params => {
		const newParams = new URLSearchParams(searchParams.toString())

		Object.entries(params).forEach(([key, value]) => {
			if (value === null || value === undefined) {
				newParams.delete(key)
			} else {
				newParams.set(key, value)
			}
		})

		setSearchParams(newParams)
	}

	const fetchCourses = async () => {
		try {
			const res = await api.get(`${API}/courses/`)
			setCourses(res.data)
		} catch (e) {
			console.error(e)
		}
	}

	const fetchGroups = async id => {
		if (!id) {
			setGroups([])
			return
		}

		try {
			const res = await api.get(
				`${API}/courses/student-group/linked/?course_id=${id}`,
			)

			setGroups(res.data.items || [])
		} catch (e) {
			console.error(e)
		}
	}

	const fetchStudents = async id => {
		if (!id) {
			setStudents([])
			return
		}

		try {
			const res = await api.get(`${API}/student-group/${id}/students`)
			setStudents(res.data)
		} catch (e) {
			console.error(e)
		}
	}

	const fetchTasks = async (student, course) => {
		if (!student || !course) {
			setTasks([])
			return
		}

		try {
			const res = await api.get(
				`${API}/student-profile/${student}/assignments/?course_id=${course}`,
			)

			setTasks(res.data)
		} catch (e) {
			console.error(e)
		}
	}

	useEffect(() => {
		fetchCourses()
	}, [])

	useEffect(() => {
		updateQuery({
			group: null,
			student: null,
			assignment: null,
			type: null,
		})
		fetchGroups(courseId)
	}, [courseId])

	useEffect(() => {
		updateQuery({
			student: null,
			assignment: null,
			type: null,
		})
		fetchStudents(groupId)
	}, [groupId])

	useEffect(() => {
		updateQuery({
			assignment: null,
			type: null,
		})
		fetchTasks(studentId, courseId)
	}, [studentId, courseId])

	if (!courses.length) {
		return (
			<div className='flex items-center justify-center h-full'>
				<Loader />
			</div>
		)
	}

	return (
		<div className='grid min-[1440px]:grid-cols-12 grid-cols-5 gap-5 mt-5 xl:mt-15 mb-40 select-none md:min-h-[calc(70vh-100px)]'>
			<div className='col-span-2 flex flex-col gap-5 h-full'>
				<div className='bg-[var(--white)] flex flex-col gap-3 rounded-lg shadow-[var(--shadow)] p-5'>
					<p className='text-[var(--middle)] text-sm ml-2'>Курс</p>

					<OptionInput
						Options={courses}
						labelKey='name'
						value={selectedCourseIndex === -1 ? null : selectedCourseIndex}
						onChange={i =>
							updateQuery({
								course: courses[i]?.id,
							})
						}
						placeholder='Выберите курс'
					/>

					<p className='text-[var(--middle)] text-sm ml-2'>Группа</p>

					<OptionInput
						Options={groups}
						labelKey='name'
						value={selectedGroupIndex === -1 ? null : selectedGroupIndex}
						onChange={i =>
							updateQuery({
								group: groups[i]?.id,
							})
						}
						placeholder='Выберите группу'
					/>
				</div>

				<div className='bg-[var(--white)] rounded-lg shadow-[var(--shadow)] overflow-y-auto hide-scrollbar h-[50vh]'>
					<div className='flex flex-col gap-3 p-5'>
						{students.length === 0 ? (
							<p className='text-center font-light text-[var(--middle)]'>
								Пусто
							</p>
						) : (
							students.map((item, index) => (
								<motion.div
									key={item.id}
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{
										duration: 0.3,
										delay: index * 0.1,
										ease: 'easeOut',
									}}
								>
									<StudentCard
										onClick={() =>
											updateQuery({
												student: item.id,
											})
										}
										active={studentId === item.id}
										PersonalData={item?.personal_data}
										img_path={item?.image_path}
									/>
								</motion.div>
							))
						)}
					</div>
				</div>
			</div>

			<div className='col-span-3 bg-[var(--white)] rounded-lg shadow-[var(--shadow)] flex flex-col justify-between p-5 h-full'>
				<div className='flex flex-col gap-4'>
					<p className='font-medium text-[var(--black)] text-xl'>
						Выберите занятие для просмотра
					</p>

					{tasks.length === 0 ? (
						<div className='h-135 w-full flex justify-center items-center'>
							<p className='font-normal text-center text-[var(--middle)] text-xl'>
								пусто
							</p>
						</div>
					) : (
						tasks.map((item, index) => (
							<motion.div
								key={item.assignment_id}
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{
									duration: 0.3,
									delay: index * 0.1,
									ease: 'easeOut',
								}}
							>
								<TaskCard
									title={item.assignment_name}
									type={item.assignment_type}
									onClick={() =>
										updateQuery({
											assignment: item.assignment_id,
											type: item.assignment_type,
										})
									}
									isActive={assignmentId === item.assignment_id}
									grade={{ grade_status: item.grade_status, score: item.score }}
								/>
							</motion.div>
						))
					)}
				</div>
			</div>

			<div className='min-[1440px]:col-span-7 max-[1440px]:hidden bg-[var(--white)] rounded-lg shadow-[var(--shadow)] flex p-4 h-full'>
				{(() => {
					switch (selectedAssignment?.type) {
						case 'practice':
							return <PracticeView id={selectedAssignment.id} />

						case 'test':
							return (
								<TestView id={selectedAssignment.id} studentId={studentId} />
							)

						default:
							return (
								<div className='w-full h-full flex justify-center items-center font-normal text-center text-[var(--middle)] text-xl'>
									<p>Выберите занятие</p>
								</div>
							)
					}
				})()}
			</div>
		</div>
	)
}

export default StudentsAndGroups
