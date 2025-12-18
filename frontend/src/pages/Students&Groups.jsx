import { act, useEffect, useState } from 'react'
import { OptionInput } from '../components/Inputs'

import {
	ArrowBigDownDash,
	CalendarDays,
	Filter,
	ImageOff,
	LaptopMinimalCheck,
	NotebookPen,
} from 'lucide-react'
import { FilterButton } from '../components/Buttons'
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

const TaskCard = ({ title, type, isActive, onClick }) => {
	console.log('type: ', type)
	return (
		<div
			onClick={onClick}
			className={`bg-[var(--white)]  rounded-lg p-4 items-center flex gap-5 ${
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
			</div>
			<p className='font-medium text-[var(--middle)]'>/</p>
			<p className='text-[var(--middle)]'>{title}</p>
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

const LevelsBar = ({
	questions,
	setQuestions,
	activeIndex,
	setActiveIndex,
	studentAnswers,
}) => {
	console.log('questions: ', studentAnswers)
	return (
		<>
			<div className='flex gap-3'>
				{questions.map((q, idx) => {
					const answerStatus = studentAnswers[idx]?.correctness_status

					return (
						<div
							key={q.id}
							onClick={() => setActiveIndex(idx)}
							className={`w-10 h-10 flex flex-wrap justify-center items-center rounded-md cursor-pointer transition-all 
                ${
									answerStatus === 'correct'
										? 'border-b-[3px] border-[var(--correct-lvl)] shadow-[var(--correct-glow)]'
										: answerStatus === 'partial'
										? 'border-b-[3px] border-[var(--middle-correct-lvl)] shadow-[var(--middle-correct-glow)]'
										: answerStatus === 'not-correct'
										? 'border-b-[3px] border-[var(--not-correct-lvl)] shadow-[var(--not-correct-glow)]'
										: 'border-b-[3px] border-[var(--middle)]'
								}
                ${
									activeIndex === idx
										? answerStatus === 'correct'
											? 'bg-[var(--correct-lvl)] text-white'
											: answerStatus === 'partial'
											? 'bg-[var(--middle-correct-lvl)] text-white'
											: answerStatus === 'not-correct'
											? 'bg-[var(--not-correct-lvl)] text-white'
											: 'bg-[var(--middle)] text-[var(--white)]'
										: answerStatus === 'correct'
										? 'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--correct-lvl)] hover:text-[var(--white)]'
										: answerStatus === 'partial'
										? 'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--middle-correct-lvl)] hover:text-[var(--white)]'
										: answerStatus === 'not-correct'
										? 'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--not-correct-lvl)] hover:text-[var(--white)]'
										: 'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--middle)] hover:text-[var(--white)]'
								}
                active:scale-90`}
						>
							{idx + 1}
						</div>
					)
				})}
			</div>
		</>
	)
}

const TestView = ({ content }) => {
	const [activeIndex, setActiveIndex] = useState(0)

	console.log('content: ', content)

	return (
		<div className='w-full flex flex-col  gap-3'>
			<TaskCard
				title={content?.assignment_name}
				type={content?.assignment_type}
				isActive={false}
			/>
			<LevelsBar
				questions={content?.questions}
				activeIndex={activeIndex}
				setActiveIndex={setActiveIndex}
				studentAnswers={content?.student_answer}
			/>
			<div className='flex justify-center'>
				{(() => {
					const q = content?.questions

					console.log('q: ', q)

					if (
						q[activeIndex]?.question_type === 'multiple' ||
						q[activeIndex]?.question_type === 'single'
					) {
						return (
							<VariantCheckView
								answers={q[activeIndex]?.student_answer_options[0]?.answers}
								media={q[activeIndex]?.media}
								question={q[activeIndex]?.title}
								type={q[activeIndex]?.question_type}
							/>
						)
					} else if (q[activeIndex]?.question_type === 'sort') {
						return (
							<SortVariantView
								question={q[activeIndex]?.student_answer}
								initialPairs={q?.answers}
							/>
						)
					} else if (q[activeIndex]?.question_type === 'open') {
						return (
							<OpenQuestionCheckView
								value={q[activeIndex]?.student_answer_options[0]?.answers}
								media={q[activeIndex]?.media}
								question={q[activeIndex]?.title}
							/>
						)
					}

					return null
				})()}
			</div>
		</div>
	)
}

const StudentsAndGroups = () => {
	const [ActiveTask, setActiveTask] = useState(0)
	const [ActiveType, setActiveType] = useState(0)
	const Type = ['Оценка', 'Комментарий']
	const Score = [1, 2, 3, 4, 5]

	const [courses, setCourses] = useState([])
	const [groups, setGroups] = useState([])
	const [students, setStudents] = useState([])
	const [tasks, setTasks] = useState([])
	const [lessons, setLessons] = useState([])
	const [selectedCourse, setSelectedCourse] = useState(0)
	const [selectedGroupe, setSelectedGroupe] = useState(0)
	const [selectedStudent, setSelectedStudent] = useState(0)
	const [selectedTask, setSelectedTask] = useState(null)

	const fetchCourses = async () => {
		try {
			const res = await api.get(`${API}/courses/`, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			setCourses(res.data)
			setGlobalError(null)
		} catch (error) {
			console.log('error: ', error.response.status)
			setGlobalError(error.response.status.toString())
		}
	}

	const fetchGroups = async () => {
		const id = courses[selectedCourse]?.id
		try {
			const res = await api.get(
				`${API}/courses/student-group/linked/?course_id=${id}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				}
			)

			setGlobalError(null)
			setGroups(res.data)
		} catch (error) {
			console.log(error)
		}
	}

	const fetchStudents = async () => {
		const id = groups[selectedGroupe].id
		try {
			const res = await api.get(`${API}/student-group/${id}/students`, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': getCookie('csrftoken'),
				},
			})

			setGlobalError(null)
			setStudents(res.data)
		} catch (error) {
			console.log(error)
		}
	}

	const fetchStudentLessons = async () => {
		const studentId = students[selectedStudent]?.id
		const courseId = courses[selectedCourse]?.id
		try {
			const res = await api.get(
				`${API}/student-profile/${studentId}/assignments/?course_id=${courseId}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				}
			)

			setGlobalError(null)
			setTasks(res.data)
		} catch (error) {
			console.log(error)
		}
	}

	const fetchLesson = async () => {
		const studentId = students[selectedStudent]?.id
		const assignmentId = tasks[selectedTask]?.assignment_id

		try {
			const res = await api.get(
				`${API}/student-profile/${studentId}/assignment/result?assignment_id=${assignmentId}`,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				}
			)

			setGlobalError(null)
			setLessons(res.data)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		fetchCourses()
	}, [])

	useEffect(() => {
		courses?.length !== 0 ? fetchGroups() : setGroups([])
	}, [courses, selectedCourse])

	useEffect(() => {
		groups?.length !== 0 ? fetchStudents() : setStudents([])
	}, [groups, selectedGroupe])

	useEffect(() => {
		students?.length !== 0 ? fetchStudentLessons() : setTasks([])
	}, [students, selectedStudent])

	useEffect(() => {
		tasks?.length !== 0 ? fetchLesson() : setLessons([])
	}, [selectedTask])

	if (!courses) {
		return (
			<div className=' flex items-center justify-center h-full'>
				<Loader />
			</div>
		)
	}
	return (
		<>
			<div className='grid min-[1440px]:grid-cols-12 grid-cols-5 gap-5 mt-5 xl:mt-15 mb-40 select-none md:min-h-[calc(70vh-100px)]'>
				<div className='col-span-2 flex flex-col gap-5 h-full'>
					<div className='bg-[var(--white)] flex flex-col gap-3 rounded-lg shadow-[var(--shadow)] p-5'>
						<p className='text-[var(--middle)] text-sm'>Выберите курс</p>
						<OptionInput
							Options={courses}
							labelKey='name'
							onChange={setSelectedCourse}
						/>
					</div>
					<div className='bg-[var(--white)] flex flex-col gap-3 rounded-lg shadow-[var(--shadow)] p-5'>
						<p className='text-[var(--middle)] text-sm'>
							Выберите группу студентов
						</p>
						<OptionInput
							Options={groups}
							labelKey='name'
							onChange={setSelectedGroupe}
						/>
					</div>
					<div className='bg-[var(--white)] rounded-lg shadow-[var(--shadow)] overflow-y-auto hide-scrollbar h-[50vh]'>
						<div className='flex flex-col gap-3 p-5'>
							{students.length === 0 ? (
								<p className='text-center font-light text-[var(--middle)]'>
									Пусто
								</p>
							) : (
								students?.map((item, index) => (
									<motion.div
										key={index}
										initial={{ scale: 0.8, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										transition={{
											duration: 0.3,
											delay: index * 0.1,
											ease: 'easeOut',
										}}
									>
										<StudentCard
											key={item.id || index}
											onClick={() => setSelectedStudent(index)}
											active={selectedStudent === index}
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
						{tasks?.length === 0 ? (
							<div className='h-135 w-full flex justify-center items-center'>
								<p className='font-normal text-center text-[var(--middle)] text-xl'>
									пусто
								</p>
							</div>
						) : (
							tasks?.map((item, index) => {
								console.log('in type: ', index, item)
								return (
									<motion.div
										key={index}
										initial={{ scale: 0.8, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										transition={{
											duration: 0.3,
											delay: index * 0.1,
											ease: 'easeOut',
										}}
									>
										<TaskCard
											title={item?.assignment_name}
											type={item?.assignment_type}
											onClick={() => setSelectedTask(index)}
											isActive={selectedTask === index}
										/>
									</motion.div>
								)
							})
						)}
					</div>
				</div>
				<div className='min-[1440px]:col-span-7 max-[1440px]:hidden bg-[var(--white)] rounded-lg shadow-[var(--shadow)] flex p-4 h-full'>
					{(() => {
						switch (lessons?.assignment_type) {
							case 'practice':
								return <PracticeView content={lessons} />
							case 'test':
								return <TestView content={lessons} />
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
		</>
	)
}
export default StudentsAndGroups
