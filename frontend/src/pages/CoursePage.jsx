import React, { useEffect, useMemo, useState } from 'react'

import {
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
import { useParams } from 'react-router-dom'
import { API } from '../API'
import { useError } from '../components/Errors'
import { ConstructorFileInput } from '../components/ConstructorComponents/FileImport'
import { motion } from 'framer-motion'
import { is } from 'date-fns/locale'
import axios from 'axios'

const ModuleTitle = ({ title, index, isExpanded, onToggle }) => {
	const options = [
		{
			title: 'Переместить вверх',
			icon: <ChevronsUp size={20} />,
			action: 'up',
		},
		{
			title: 'Переместить вниз',
			icon: <ChevronsDown size={20} />,
			action: 'down',
		},
		{ title: 'Дублировать', icon: <Copy size={20} />, action: 'copy' },
		{ title: 'Удалить', icon: <Trash size={20} />, action: 'del' },
	]
	return (
		<div className='flex justify-between items-center'>
			<div className='flex gap-3 text-[var(--middle)] items-center'>
				<div className='flex items-center gap-4 bg-[var(--white)] shadow-[var(--shadow)] rounded-xl px-3 py-2 text-[var(--black)]'>
					<Package size={20} />
					<p className='font-medium text-base whitespace-nowrap'>
						Модуль {index}
					</p>
				</div>
				<p className='font-bold text-base'>/</p>
				<p className='font-normal text-base'>{title}</p>
			</div>
			<div className='flex gap-3'>
				<Button
					icon={isExpanded ? ChevronUp : ChevronDown}
					style='white'
					size={32}
					onClick={onToggle}
				/>
			</div>
		</div>
	)
}

const ModuleContent = ({ type, index, title, bg, onClick, isLocked }) => {
	return (
		<div
			onClick={!isLocked && onClick}
			className={`flex justify-between items-center ${
				!bg && isLocked
					? 'px-3 opacity-50 cursor-not-allowed'
					: 'hover:bg-[var(--light-middle)] cursor-pointer px-3'
			} rounded-lg cursor-default  transition-all  `}
		>
			<div className='flex gap-3 text-[var(--middle)] items-center'>
				<div
					className={`flex items-center gap-4 text-[var(--black)] px-3 py-2 rounded-lg ${
						bg && 'bg-[var(--white)] shadow-[var(--shadow)]'
					}`}
				>
					{type === 'lecture' ? (
						<BookMarked size={20} />
					) : type === 'practice' ? (
						<NotebookPen size={20} />
					) : (
						type === 'test' && <LaptopMinimalCheck size={20} />
					)}
					<p className='font-medium text-base whitespace-nowrap'>
						{type === 'lecture'
							? 'Лекция'
							: type === 'practice'
							? 'Практика'
							: type === 'test' && 'Тест'}
						{index}
					</p>
				</div>
				<p className='font-bold text-base'>/</p>
				<p className={`font-normal  ${bg ? 'text-base' : 'text-sm w-3/5'}`}>
					{title}
				</p>
			</div>
		</div>
	)
}

const ModuleBlock = ({ ModuleInfo, onContentSelect, selectedContent }) => {
	const [expandedModules, setExpandedModules] = useState({})

	const toggleModule = index => {
		setExpandedModules(prev => ({
			...prev,
			[index]: !prev[index],
		}))
	}

	return (
		<div className='h-fit overflow-y-scroll hide-scrollbar hide-scrollbar p-2'>
			<div className=' flex flex-col gap-3 rounded-xl'>
				{ModuleInfo?.map((item, index) => {
					const isExpanded = expandedModules[index] === true

					return (
						<div key={index} className='flex flex-col gap-3'>
							<ModuleTitle
								title={item.name}
								index={index + 1}
								isExpanded={isExpanded}
								onToggle={() => toggleModule(index)}
							/>
							{isExpanded && (
								<>
									<div className=''>
										{item?.module_sections?.map((lesson, lessonIndex) => {
											return (
												<ModuleContent
													key={lesson?.id}
													title={lesson?.title}
													type={lesson?.type}
													onClick={() =>
														onContentSelect(
															lesson?.id,
															lesson?.type,
															lesson?.title
														)
													}
													isSelected={selectedContent?.id === lesson?.id}
													isLocked={lesson?.locked}
												/>
											)
										})}
									</div>
								</>
							)}
						</div>
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
						onClick={() => setActiveIndex(idx)}
						className={`w-10 h-10 flex justify-center items-center rounded-md shadow-[var(--shadow)] cursor-pointer transition-all
                            ${
															activeIndex === idx
																? 'bg-[var(--hero-epta)] text-[var(--white)]'
																: 'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--hero-epta)] hover:text-[var(--white)]'
														}
                            active:scale-90`}
					>
						{idx + 1}
					</div>
				))}
			</div>
		</>
	)
}

const ContentView = ({ content, contentType, contentTitle, testId }) => {
	const [answers, setAnswers] = useState({})
	const [questions, setQuestions] = useState([])
	const token = localStorage.getItem('access_token')

	const [session, setSession] = useState(null)

	const { setError } = useError()

	const fetchSession = async () => {
		try {
			const res = await axios.get(`${API}/tests/is-active/${testId}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})

			console.log('res: ', res.data)

			setSession(res.data.is_active)

			setError(null)
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
		contentType === 'test' && setQuestions(content?.content)
		if (contentType === 'test') {
			fetchSession()
		}
	}, [content])

	const [activeIndex, setActiveIndex] = useState(0)

	const [studentWork, setStudentWork] = useState()
	const [studentAnswers, setStudentAnswers] = useState([])

	const handleStudentsWorks = data => {
		setStudentWork(prev => {
			const base =
				Array.isArray(prev) && prev.length > 0 ? prev[0] : { content: '' }
			const updated = [{ ...base, content: data }]

			return updated
		})
	}

	const handleStudentAnswer = () => {
		setActiveIndex(prev => prev + 1)
		const q = content.content[activeIndex]
		const data = { question_id: q?.id, answers_data: answers }

		setStudentAnswers(oldArray => {
			const existingIndex = oldArray.findIndex(
				item => item.question_id === q?.id
			)

			if (existingIndex !== -1) {
				const newArray = [...oldArray]
				newArray[existingIndex] = {
					...newArray[existingIndex],
					answers_data: answers,
				}
				return newArray
			} else {
				return [...oldArray, data]
			}
		})
	}

	useEffect(() => {
		const PUT = async () => {
			try {
				const response = await fetch(
					`${API}/tests/student-answers/update/${testId}`,
					{
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(studentAnswers),
					}
				)
				const result = await response.json()

				console.log('результат: ', result)
			} catch (error) {
				console.error('Ошибка:', error)
			}
		}

		PUT()
	}, [studentAnswers])

	if (!content) {
		return (
			<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-xl p-6 flex items-center justify-center h-full'>
				<p className='text-[var(--middle)] text-lg'>
					Выберите занятие для просмотра
				</p>
			</div>
		)
	}

	return (
		<div className='bg-[var(--white)] shadow-[var(--shadow)] flex flex-col gap-3 rounded-xl p-5 overflow-scroll'>
			<ModuleContent bg={true} type={contentType} title={contentTitle} />
			<div className='flex flex-col gap-5'>
				{content.length !== 0 ? (
					contentType !== 'test' ? (
						<>
							{content.map((item, i) => {
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
										element = <PhotoView photos={item?.content} />
										break
									case 'video':
										console.log(item)
										element = <VideoPlayer url={item?.content} course={true} />
										break
									case 'files':
										element = <FileView Files={item?.content} />
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
											<CustomAudioPlayer audioUrl={item?.content?.fileUrl} />
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
									key={content?.length}
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{
										duration: 0.3,
										delay: content?.length * 0.1,
										ease: 'easeOut',
									}}
								>
									<div className='w-full flex flex-col justify-center gap-3'>
										<p className='text-center font-medium text-xl'>
											Прикрепить файл для проверки
										</p>
										<ConstructorFileInput
											onChange={data => handleStudentsWorks(1, data)}
											takeValues={studentWork?.content}
										/>

										<SubmitButton title={'Отправить на проверку'} />
									</div>
								</motion.div>
							)}
						</>
					) : (
						<>
							{session === false ? (
								<div className='w-full h-225 flex items-center justify-center'>
									<div className='h-12'>
										<StartButton title={'Начать тест'} onClick={fetchSession} />
									</div>
								</div>
							) : (
								<>
									<LevelsBar
										questions={questions}
										activeIndex={activeIndex}
										setActiveIndex={setActiveIndex}
									/>
									<div className='w-full flex justify-center'>
										{(() => {
											const q = content.content[activeIndex]

											if (q.type === 'multiple') {
												return (
													<MoreVariantView
														testId={questions[activeIndex]?.id}
														onAnswerSelect={data =>
															console.log('ответ: ', data)
														}
													/>
												)
											} else if (q.type === 'single') {
												return (
													<OneVariantView
														testId={questions[activeIndex]?.id}
														onAnswerSelect={setAnswers}
													/>
												)
											} else if (q.type === 'matching') {
												return (
													<SortVariantView
														testId={questions[activeIndex]?.id}
														onAnswerSelect={data =>
															console.log('ответ: ', data)
														}
													/>
												)
											} else if (q.type === 'open') {
												return (
													<OpenQuestionView
														testId={questions[activeIndex]?.id}
														onAnswerSelect={data =>
															console.log('ответ: ', data)
														}
													/>
												)
											}

											return null
										})()}
									</div>
									<div className='flex justify-center gap-3'>
										{activeIndex + 1 !== questions.length ? (
											<button
												onClick={handleStudentAnswer}
												className=' justify-center items-center px-3 py-2 bg-[var(--black)] text-[var(--white)] rounded-lg font-medium hover:bg-[var(--hero-epta)] hover:text-white transition-all cursor-pointer flex'
											>
												<p>Ответить</p>
											</button>
										) : (
											<button
												onClick={() => console.log('')}
												className=' justify-center items-center px-4 py-2 bg-[var(--black)] text-[var(--white)] rounded-lg font-medium hover:bg-[var(--hero-epta)] hover:text-white transition-all cursor-pointer flex'
											>
												<p>Завершить тест</p>
											</button>
										)}
									</div>
								</>
							)}
						</>
					)
				) : (
					<div className='flex w-full h-150 justify-center items-center'>
						<div className='flex gap-3 text-lg items-center font-medium text-[var(--middle)]'>
							<p>Пусто</p>
							<Frown />
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

const CourseOverview = ({ content }) => {
	const [selectedContent, setSelectedContent] = useState(null)
	const [selectedType, setSelectedType] = useState(null)
	const [selectedName, setSelectedName] = useState(null)
	const [sectionId, setSectionId] = useState(null)

	const handleContentSelect = (SectionId, SectionType, SectionName) => {
		setSectionId(SectionId)
		setSelectedType(SectionType)
		setSelectedName(SectionName)
	}

	useEffect(() => {
		if (!sectionId) return

		const fetchContent = async () => {
			try {
				const res = await fetch(`${API}/sections/${sectionId}/content`)
				if (!res.ok) throw new Error('Ошибка при загрузке контента')
				const data = await res.json()

				console.log('Fetched content data:', data)
				setSelectedContent(data)
			} catch (err) {
				setSelectedContent(null)
				console.error(err)
			}
		}

		fetchContent()
	}, [sectionId])

	return (
		<>
			<div className='grid grid-cols-[1fr_3fr] gap-5 h-5/6 '>
				<div className='flex flex-col gap-3 '>
					<div className='flex bg-[var(--white)] justify-center rounded-xl shadow-[var(--shadow)] px-4 py-3 gap-3'>
						<Gem size={32} color='var(--hero-epta)' strokeWidth={1.5} />
						<p className='font-medium text-2xl text-[var(--black)]'>
							{content?.name}
						</p>
					</div>
					<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-xl pb-5 px-3 pt-5 flex flex-col justify-between h-full'>
						<div className='flex flex-col gap-3'>
							<div className='flex flex-col gap-3 px-2'>
								<div className='flex justify-between w-full'>
									<p className='font-medium text-[20px] text-[var(--black)]'>
										Содержимое
									</p>
									<Button icon={ArrowRightFromLine} style='white' size={32} />
								</div>
								<div className='flex gap-[10px]'>
									<SearchInput width={'100%'} />
									<Button icon={ListRestart} style='white' size={40} />
								</div>
							</div>

							<div className='flex flex-col gap-3 rounded-xl p-2'>
								<ModuleBlock
									ModuleInfo={content?.modules}
									onContentSelect={handleContentSelect}
									selectedContent={selectedContent}
								/>
							</div>
						</div>
					</div>
				</div>

				<ContentView
					content={selectedContent}
					contentType={selectedType}
					contentTitle={selectedName}
					testId={selectedContent?.id}
				/>
			</div>
		</>
	)
}

const CoursePage = ({}) => {
	const { courseId } = useParams()
	const [courseContent, setCourseContent] = useState()

	const { setError } = useError()

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const res = await fetch(`${API}/courses/${courseId}`)
				const data = await res.json()

				if (!res.ok) {
					setError(res.status.toString())
				} else {
					setError(null)
					setCourseContent(data)
					console.log('!!!!!!!!!!!!!!!курсы:', data)
				}
			} catch (err) {
				setError('500')
			}
		}

		fetchCourses()
	}, [courseId])

	return (
		<>
			<div className='flex flex-col gap-5 h-screen'>
				<div className='flex justify-between items-center mt-10'></div>

				<CourseOverview content={courseContent} />
			</div>
		</>
	)
}
export default CoursePage
