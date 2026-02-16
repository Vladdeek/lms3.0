import React, { useEffect, useMemo, useState } from 'react'

import {
	ArrowLeftFromLine,
	ArrowRightFromLine,
	BookMarked,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsDown,
	ChevronsUp,
	ChevronUp,
	Copy,
	Frown,
	Gem,
	Info,
	LaptopMinimalCheck,
	ListRestart,
	NotebookPen,
	Package,
	Plus,
	Trash,
} from 'lucide-react'
import {
	Button,
	EllipsisButton,
	StartButton,
	SubmitButton,
} from '../components/Buttons'
import { InputDefault, SearchInput } from '../components/Inputs'
import CustomCodeBlock from '../components/CustomCodeBlock'
import CustomAudioPlayer from '../components/AudioPlayer'
import FormulaView from '../components/Viewer/FormulaView'
import { FileView } from '../components/Viewer/FileView'
import { CalloutView } from '../components/Viewer/CalloutView'
import { ButtonView } from '../components/Viewer/ButtonView'
import { PhotoView } from '../components/Viewer/PhotoView'
import VideoPlayer from '../components/VideoPlayer'
import TableView from '../components/Viewer/TableView'
import MoreVariantView from '../components/TestView/MoreVariantsView'
import OneVariantView from '../components/TestView/OneVariantView'
import SortVariantView from '../components/TestView/SortVariantsView'
import OpenQuestionView from '../components/TestView/OpenQuestionView'
import { TextViewer } from '../components/Viewer/TextViewer'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import api, { API } from '../API'

import { ConstructorFileInput } from '../components/ConstructorComponents/FileImport'
import { motion } from 'framer-motion'
import { is } from 'date-fns/locale'
import axios from 'axios'
import { set } from 'date-fns'
import Loader from '../components/Loader'
import { getCookie, token } from '../TOKEN'
import { setGlobalError } from '../components/Errors'
import SectionTimeTracker from '../context/TimeTracker'

const ModuleTitle = ({ title, index, isExpanded, onToggle, children }) => {
	return (
		<div className='flex flex-col items-center bg-[var(--white)] rounded-xl shadow-[var(--shadow)] pb-1'>
			<div className='flex flex-col w-full text-[var(--middle)]'>
				{/* HEADER */}
				<div className='flex justify-between items-center gap-1 w-full pt-0.5 pr-1'>
					<div className='flex items-center w-full gap-2 px-3 pt-1 pb-1 text-[var(--black)]'>
						<Package size={20} />
						<p className='font-medium pt-1 text-base whitespace-nowrap'>
							Модуль {index}
						</p>
					</div>
				</div>

				{/* NAME */}
				<div className='px-3'>
					<p title={title} className='font-normal text-base truncate'>
						{title}
					</p>
				</div>
			</div>

			{/* CHILDREN */}
			{isExpanded && (
				<div className='flex flex-col gap-2 p-2 w-full'>{children}</div>
			)}

			<button
				onClick={onToggle}
				className='
          w-auto h-full p-1.5 aspect-square
          hover:bg-[var(--light-middle)]
          rounded-lg cursor-pointer
          text-[var(--black)] transition-all
        '
			>
				<ChevronUp
					className={`${!isExpanded ? 'rotate-x-180' : ''} transition-all duration-500`}
					size={18}
				/>
			</button>
		</div>
	)
}

const ModuleContent = ({ type, title, onClick, isLocked, id }) => {
	const { SectionId } = useParams()

	const isSelected = String(SectionId) === String(id)

	const wrapperClass = `
    flex justify-between items-center
    rounded-lg relative transition-all
    p-1 w-full border-[var(--hero-epta)]
    ${
			isLocked
				? 'opacity-50 cursor-not-allowed'
				: isSelected
					? 'border-l-4 shadow-[var(--shadow)] bg-[var(--white)]'
					: 'hover:bg-[var(--light-middle)] bg-[var(--white)] shadow-[var(--shadow)] cursor-pointer'
		}
  `

	return (
		<div onClick={!isLocked ? onClick : undefined} className={wrapperClass}>
			<div className='flex flex-col gap-1 w-full rounded-xl text-[var(--middle)]'>
				{/* HEADER */}
				<div className='flex justify-between pt-0.5 w-full pr-0.5'>
					<div className='flex items-center gap-2 w-full px-2 rounded-lg text-[var(--black)]'>
						{type === 'lecture' && <BookMarked size={20} />}
						{type === 'practice' && <NotebookPen size={20} />}
						{type === 'test' && <LaptopMinimalCheck size={20} />}

						<p className='font-medium pt-1 text-base whitespace-nowrap'>
							{type === 'lecture' && 'Лекция'}
							{type === 'practice' && 'Практика'}
							{type === 'test' && 'Тест'}
						</p>
					</div>
				</div>

				{/* NAME */}
				<div className='w-full'>
					<p className='font-normal w-full whitespace-normal px-2 text-sm'>
						{title}
					</p>
				</div>
			</div>
		</div>
	)
}

const ModuleBlock = ({ ModuleInfo, selectedContent }) => {
	const [expandedModules, setExpandedModules] = useState({})
	const { courseId } = useParams()

	const toggleModule = index => {
		setExpandedModules(prev => ({
			...prev,
			[index]: !prev[index],
		}))
	}

	return (
		<div className='h-fit overflow-y-scroll hide-scrollbar p-2'>
			<div className='flex flex-col gap-3 rounded-xl'>
				{ModuleInfo?.map((module, index) => {
					const isExpanded = expandedModules[index] === true

					return (
						<ModuleTitle
							key={module.id}
							title={module.name}
							index={index + 1}
							isExpanded={isExpanded}
							onToggle={() => toggleModule(index)}
						>
							{module.module_sections?.map(lesson => (
								<NavLink
									key={lesson.id}
									to={`/course/${courseId}/lesson/${lesson.id}`}
									prefetch='intent'
								>
									<ModuleContent
										title={lesson.title}
										type={lesson.type}
										isLocked={lesson.locked}
										id={lesson.id}
									/>
								</NavLink>
							))}
						</ModuleTitle>
					)
				})}
			</div>
		</div>
	)
}

const LevelsBar = ({
	questions,
	setQuestions,
	activeIndex,
	setActiveIndex,
}) => {
	return (
		<>
			<div className='flex flex-wrap gap-3'>
				{questions.map((q, idx) => (
					<div
						key={q.id}
						disabled={q.filled}
						onClick={() => setActiveIndex(idx)}
						className={`w-10 h-10 flex justify-center items-center rounded-md shadow-[var(--shadow)]  transition-all
							${
								activeIndex === idx
									? 'bg-[var(--hero-epta)] text-[var(--white)]'
									: q.filled
										? 'bg-[var(--white)] text-[var(--black)] border-b-[3px] border-[var(--hero-epta)] shadow-[var(--glow-hero-epta)]'
										: 'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--hero-epta)] hover:text-[var(--white)]'
							} active:scale-90 cursor-pointer`}
					>
						{idx + 1}
					</div>
				))}
			</div>
		</>
	)
}

const ContentView = ({
	content,
	sectionId,
	contentType,
	contentTitle,
	testId,
	clearSelection,
}) => {
	const [answers, setAnswers] = useState({})
	const [questions, setQuestions] = useState([])
	const [normalizedContent, setNormalizedContent] = useState([])

	const [score, setScore] = useState(null)
	const [gradeStatus, setGradeStatus] = useState(null)

	const [activeIndex, setActiveIndex] = useState(0)

	const [studentWork, setStudentWork] = useState()
	const [studentAnswers, setStudentAnswers] = useState([])
	const [lastQuestion, setLastQuestion] = useState(false)

	const [session, setSession] = useState(null)

	// 🔥 Нормализация контента (главная фикса)
	const normalizeContent = (type, content) => {
		if (type === 'test') {
			return null
		}

		// если контент массив — оставляем
		if (Array.isArray(content)) return content

		// если прилетело что-то кривое
		return []
	}

	// 🔥 Следим за изменением контента или типа
	useEffect(() => {
		if (!content) return

		if (contentType === 'test') {
			setQuestions(content?.content || [])
			testId && fetchSession()
		} else {
			setNormalizedContent(normalizeContent(contentType, content))
		}

		setActiveIndex(0)
		setLastQuestion(false)
	}, [contentType, content])

	// ==========================
	//         TEST LOGIC
	// ==========================

	const fetchSession = async () => {
		try {
			const res = await api.get(`${API}/tests/is-active/${testId}`, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			})

			setSession(res.data.is_active)
			setGradeStatus(res.data.grade_status)
			setScore(res.data.score)
		} catch (error) {}
	}

	const startSession = async () => {
		setActiveIndex(0)
		setLastQuestion(false)

		try {
			const res = await api.post(
				`${API}/tests/start/${testId}`,
				{},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)

			setSession(res.data.is_active)
		} catch (error) {}

		fetchSession()
	}

	const handleStudentAnswer = () => {
		if (activeIndex + 1 !== questions.length) {
			setActiveIndex(prev => prev + 1)
		} else {
			setLastQuestion(true)
		}

		const q = questions[activeIndex]
		const data = { question_id: q?.id, answers_data: answers }

		setStudentAnswers(prev => {
			const idx = prev.findIndex(item => item.question_id === q?.id)

			if (idx !== -1) {
				const updated = [...prev]
				updated[idx] = { ...updated[idx], answers_data: answers }
				return updated
			}
			return [...prev, data]
		})

		setQuestions(prev =>
			prev.map(item => (item.id === q?.id ? { ...item, filled: true } : item)),
		)
	}

	const PUT = async () => {
		try {
			await api.put(`${API}/tests/student-answers/update/${testId}`, answers, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			})
		} catch (error) {
			console.error('Ошибка:', error)
		}

		setAnswers(null)
	}

	useEffect(() => {
		if (studentAnswers?.length && testId) {
			PUT()
		}
	}, [studentAnswers, testId])

	const testEnd = async () => {
		try {
			await api.post(
				`${API}/tests/end/${testId}`,
				{},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)
		} catch (error) {
			console.error('Ошибка:', error)
		}

		fetchSession()
	}

	// ==========================
	//       PRACTICE
	// ==========================

	const sendResultOfWork = async () => {
		try {
			const payload = studentWork?.map(f => f.file_path)

			const res = await api.post(
				`${API}/sections/${sectionId}/upload/assignment`,
				payload,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)
		} catch (error) {}
	}

	// ============================================
	//                RENDER
	// ============================================

	if (!content) {
		return (
			<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-xl p-6 flex items-center justify-center h-full'>
				<p className='text-[var(--middle)] text-lg'>Выберите занятие</p>
			</div>
		)
	}

	return (
		<div className='bg-[var(--white)] shadow-[var(--shadow)] flex flex-col gap-3 rounded-xl p-5 overflow-y-scroll hide-scrollbar h-full max-h-[72.5vh] w-full'>
			<div className='flex gap-3 items-center'>
				<div className='min-[1200px]:hidden'>
					<Button
						icon={ArrowLeftFromLine}
						style='white'
						size={40}
						onClick={clearSelection}
					/>
				</div>

				<ModuleContent bg={true} type={contentType} title={contentTitle} />
			</div>

			{/* =============================
			   CONTENT (LECTURE / PRACTICE)
			   ============================= */}
			{contentType !== 'test' && (
				<>
					{normalizedContent?.length ? (
						<>
							{normalizedContent.map((item, i) => {
								let element

								switch (item?.type) {
									case 'text':
										element = (
											<TextViewer key={i} content={item?.content?.content} />
										)
										break
									case 'code':
										element = (
											<CustomCodeBlock
												view={true}
												key={i}
												codeInfo={item?.content}
											/>
										)
										break
									case 'image':
										element = <PhotoView key={i} photos={item?.content} />
										break
									case 'video':
										element = (
											<VideoPlayer key={i} url={item?.content} course={true} />
										)
										break
									case 'files':
										element = <FileView key={i} Files={item?.content} />
										break
									case 'table':
										element = (
											<TableView
												key={i}
												cols={item?.content?.cols}
												rows={item?.content?.rows}
												values={item?.content?.data}
											/>
										)
										break
									case 'audio':
										element = (
											<CustomAudioPlayer
												key={i}
												audioUrl={item?.content?.fileUrl}
											/>
										)
										break
									case 'callout':
										element = (
											<CalloutView
												key={i}
												title={item?.content?.title}
												description={item?.content?.description}
												IconName={item?.content?.icon}
											/>
										)
										break
									case 'formula':
										element = (
											<FormulaView key={i} Formula={item?.content?.formula} />
										)
										break
									case 'button':
										element = (
											<ButtonView
												key={i}
												title={item?.content?.buttonTitle}
												to={item?.content?.buttonUrl}
											/>
										)
										break
									default:
										element = null
								}

								return (
									<motion.div
										key={i}
										initial={{ scale: 0.8, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										transition={{
											duration: 0.3,
											delay: i * 0.1,
											ease: 'easeOut',
										}}
									>
										{element}
									</motion.div>
								)
							})}

							{contentType === 'practice' && (
								<motion.div
									key={normalizedContent.length}
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{
										duration: 0.3,
										delay: normalizedContent.length * 0.1,
									}}
								>
									<div className='w-full flex flex-col justify-center gap-3'>
										<p className='text-center font-medium text-xl text-[var(--black)]'>
											Прикрепить файл для проверки
										</p>
										<ConstructorFileInput
											onChange={setStudentWork}
											takeValues={studentWork?.content}
										/>

										<SubmitButton
											title={'Отправить на проверку'}
											onClick={sendResultOfWork}
										/>
									</div>
								</motion.div>
							)}
						</>
					) : (
						<div className='flex w-full h-150 justify-center items-center'>
							<p className='text-lg text-[var(--middle)] font-medium flex items-center gap-3'>
								Пусто <Frown />
							</p>
						</div>
					)}
				</>
			)}

			{/* =============================
			   TEST BLOCK
			   ============================= */}
			{contentType === 'test' && (
				<>
					{gradeStatus === 'assessed' ? (
						<div className='w-full relative flex justify-center items-center'>
							<p className='px-4 absolute top-100 py-2 font-medium rounded-lg bg-[var(--hero-epta)] text-white text-xl'>
								{score} / 5
							</p>
						</div>
					) : gradeStatus === 'pending' ? (
						<div className='w-full h-full flex justify-center items-center'>
							<p className='font-normal text-[var(--black)] text-xl'>
								На рассмотрении
							</p>
							<p className='px-4 py-2 font-medium rounded-lg bg-[var(--hero-epta)] text-white text-xl'>
								? / 5
							</p>
						</div>
					) : (
						gradeStatus === 'not_attempted' && (
							<>
								{session === false ? (
									<div className='w-full h-225 flex items-center justify-center'>
										<StartButton title={'Начать тест'} onClick={startSession} />
									</div>
								) : (
									<>
										<LevelsBar
											questions={questions}
											activeIndex={activeIndex}
											setActiveIndex={setActiveIndex}
											filled={studentAnswers}
										/>

										<div className='w-full flex justify-center'>
											{(() => {
												const q = questions[activeIndex]

												if (q?.type === 'multiple') {
													return (
														<MoreVariantView
															testId={q?.id}
															onAnswerSelect={setAnswers}
														/>
													)
												} else if (q?.type === 'single') {
													return (
														<OneVariantView
															testId={q?.id}
															onAnswerSelect={setAnswers}
														/>
													)
												} else if (q?.type === 'matching') {
													return (
														<SortVariantView
															testId={q?.id}
															onAnswerSelect={setAnswers}
															Answered={questions[activeIndex]?.filled}
														/>
													)
												} else if (q?.type === 'open') {
													return (
														<OpenQuestionView
															testId={q?.id}
															onChange={setAnswers}
														/>
													)
												}

												return null
											})()}
										</div>

										<div className='flex justify-center gap-3'>
											{!lastQuestion ? (
												<div className='flex flex-col gap-3 items-center'>
													<button
														onClick={handleStudentAnswer}
														disabled={questions[activeIndex]?.filled}
														className={`w-fit px-3 py-2 bg-[var(--black)] text-[var(--white)] rounded-lg font-medium flex ${
															questions[activeIndex]?.filled
																? 'opacity-25 cursor-not-allowed'
																: 'hover:bg-[var(--hero-epta)] hover:text-white'
														}`}
													>
														Ответить
													</button>

													<p className='text-[var(--middle)] font-light'>
														Внимание: после отправки вы не сможете изменить
														ответ.
													</p>
												</div>
											) : (
												<button
													onClick={() => testEnd()}
													className='px-4 py-2 bg-[var(--black)] text-[var(--white)] rounded-lg font-medium hover:bg-[var(--hero-epta)] hover:text-white'
												>
													Завершить тест
												</button>
											)}
										</div>
									</>
								)}
							</>
						)
					)}
				</>
			)}
		</div>
	)
}

export const CourseOverview = ({ moderationCourseId }) => {
	const { courseId, SectionId } = useParams()

	const [selectedType, setSelectedType] = useState(null)
	const [selectedName, setSelectedName] = useState(null)
	const [selectedContent, setSelectedContent] = useState(null)
	const [sectionId, setSectionId] = useState(null)
	const [content, setContent] = useState([])
	const [loading, setLoading] = useState(false)

	const handleContentSelect = (SectionType, SectionName) => {
		setSectionId(SectionId)
		setSelectedType(SectionType)
		setSelectedName(SectionName)
	}

	useEffect(() => {
		if (!SectionId) return

		const fetchContent = async () => {
			try {
				const res = await api.get(`${API}/sections/${SectionId}/content`, {
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				})

				const data = res.data
				setSelectedType(data?.type)
				setSelectedName(data?.title)
				setSelectedContent(data?.content)
			} catch (error) {
				setSelectedContent(null)
			}
		}

		fetchContent()
	}, [SectionId])

	useEffect(() => {
		const fetchCourses = async () => {
			setLoading(true)

			try {
				const res = await api.get(
					`${API}/courses/${moderationCourseId || courseId}`,
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
							//хуйня
						},
					},
				)

				setContent(res.data)
				setGlobalError(null)
			} catch (error) {
			} finally {
				setLoading(false)
			}
		}

		fetchCourses()
	}, [courseId, moderationCourseId])

	if (moderationCourseId && loading) {
		return (
			<div className=' flex items-center justify-center h-full'>
				<Loader />
			</div>
		)
	}

	return (
		<>
			{SectionId && <SectionTimeTracker />}
			<div className='grid min-[1200px]:grid-cols-[1fr_3fr] h-[70vh] gap-5 '>
				<div
					className={`flex flex-col gap-3 h-[70vh] ${
						selectedContent && 'max-[1200px]:hidden'
					}`}
				>
					<div className='flex bg-[var(--white)] justify-center rounded-xl shadow-[var(--shadow)] px-4 py-3 gap-3'>
						<Gem size={32} color='var(--hero-epta)' strokeWidth={1.5} />
						<p className='font-medium text-2xl text-[var(--black)]'>
							{content?.name}
						</p>
					</div>
					<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-xl pb-0 px-3 pt-5 flex flex-col justify-between h-full '>
						<div className='flex flex-col gap-3'>
							<div className='flex flex-col gap-3 px-2'>
								<div className='flex justify-between w-full'>
									<p className='font-medium text-[20px] text-[var(--black)]'>
										Содержимое
									</p>
									{/* <Button icon={ArrowRightFromLine} style='white' size={32} /> */}
								</div>
								{/* <div className='flex gap-[10px]'>
									<SearchInput width={'100%'} />
									<Button icon={ListRestart} style='white' size={40} />
								</div> */}
							</div>

							<div className='flex flex-col gap-3 rounded-xl max-h-[55vh] overflow-y-scroll'>
								<ModuleBlock
									ModuleInfo={content?.modules}
									selectedContent={selectedContent}
								/>
							</div>
						</div>
					</div>
				</div>
				<div
					className={`${
						!selectedContent && 'max-[1200px]:hidden max-[1200px]:-ml-10'
					}`}
				>
					<ContentView
						content={selectedContent}
						contentType={selectedType}
						contentTitle={selectedName}
						testId={selectedContent?.id}
						sectionId={SectionId}
						clearSelection={() => {
							setSelectedContent(null)
						}}
					/>
				</div>
			</div>
		</>
	)
}

const CoursePage = ({ moderationCourseId }) => {
	const { courseId, SectionId } = useParams()
	const [courseContent, setCourseContent] = useState()

	const [Files, setFiles] = useState([])

	const fetchFiles = async () => {
		try {
			const res = await api.get(`${API}/courses/${courseId}/attachments`, {
				withCredentials: true,
				headers: {},
			})

			const result = res.data || []

			const mapped = result.map(file => ({
				file_path: `${file.file_path}`,
				name: file.original_name,
				size: file.file_size,
				type: file.file_extension,
				id: file.id,
			}))

			setFiles(mapped)
		} catch (e) {}
	}

	useEffect(() => {
		fetchFiles()
	}, [])

	return (
		<>
			<div
				className={`flex flex-col gap-5 h-[73vh] ${Files.length === 0 ? 'mb-20' : 'mb-12'} `}
			>
				<div className='flex justify-between items-center mt-10'></div>

				{SectionId ? (
					<Outlet />
				) : (
					<CourseOverview moderationCourseId={moderationCourseId} />
				)}
			</div>
			{Files.length !== 0 && (
				<div className=''>
					<p className='text-[var(--black)] text-center text-xl font-medium mb-3'>
						Прикрепленный материал
					</p>
					<FileView Files={Files} haveType={true} pinedFiles={true} />
				</div>
			)}
		</>
	)
}
export default CoursePage
