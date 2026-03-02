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
import api, { API } from '../API'

import { ConstructorFileInput } from '../components/ConstructorComponents/FileImport'
import { motion } from 'framer-motion'
import { is } from 'date-fns/locale'
import axios from 'axios'
import { set } from 'date-fns'
import Loader from '../components/Loader'
import VariantModerationView from '../components/TestModerationView/VariantsModertionView'
import { getCookie, token } from '../TOKEN'
import SortVariantModerationView from '../components/TestModerationView/SortVariantsModertionView'
import OpenQuestionModerationView from '../components/TestModerationView/OpenQuestionModertionView'
import { setGlobalError } from '../components/Errors'

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
				className='w-auto h-full p-1.5 aspect-square hover:bg-[var(--light-middle)] rounded-lg cursor-pointer text-[var(--black)] transition-all'
			>
				<ChevronUp
					className={`${!isExpanded ? 'rotate-x-180' : ''} transition-all duration-500`}
					size={18}
				/>
			</button>
		</div>
	)
}

const ModuleContent = ({ type, title, onClick, isLocked, isSelected }) => {
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

				<div className='w-full'>
					<p className='font-normal w-full whitespace-normal px-2 text-sm'>
						{title}
					</p>
				</div>
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

	// авто раскрытие модуля при выборе урока
	useEffect(() => {
		if (!selectedContent) return

		ModuleInfo?.forEach((module, moduleIndex) => {
			const hasSelectedLesson = module.module_contents?.some(
				lesson => lesson.id === selectedContent.id,
			)

			if (hasSelectedLesson) {
				setExpandedModules(prev => ({
					...prev,
					[moduleIndex]: true,
				}))
			}
		})
	}, [selectedContent, ModuleInfo])

	console.log(ModuleInfo)

	const [selectedContentId, setSelectedContentId] = useState(null)

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
							{module.module_contents?.map((lesson, idx) => (
								<ModuleContent
									key={lesson.id}
									title={lesson.title}
									type={lesson.type}
									isLocked={lesson.locked}
									isSelected={selectedContentId === lesson.id}
									onClick={() => {
										onContentSelect(lesson.id, lesson.type, lesson.title)
										setSelectedContentId(lesson.id)
									}}
								/>
							))}
						</ModuleTitle>
					)
				})}
			</div>
		</div>
	)
}

const LevelsBar = ({ questions, activeIndex, setActiveIndex }) => {
	return (
		<>
			<div className='flex flex-wrap gap-3'>
				{questions.map((q, idx) => (
					<div
						key={q.id}
						onClick={() => setActiveIndex(idx)}
						className={`w-10 h-10 flex justify-center items-center rounded-md shadow-[var(--shadow)]  transition-all
							${
								activeIndex === idx
									? 'bg-[var(--hero-epta)] text-white'
									: 'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--hero-epta)] hover:text-white'
							} active:scale-90 cursor-pointer`}
					>
						{idx + 1}
					</div>
				))}
			</div>
		</>
	)
}

const ContentView = ({ content, contentType, contentTitle }) => {
	const [questions, setQuestions] = useState([])

	const [activeIndex, setActiveIndex] = useState(0)

	useEffect(() => {
		contentType === 'test' && setQuestions(content?.content)
	}, [content])

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
		<div className='bg-[var(--white)] shadow-[var(--shadow)] flex flex-col gap-3 rounded-xl p-5 overflow-y-auto hide-scrollbar h-full min-h-0'>
			<ModuleContent bg={true} type={contentType} title={contentTitle} />
			<div className='flex flex-col gap-5'>
				{content.content?.length !== 0 ? (
					contentType !== 'test' ? (
						<>
							{content.content?.map((item, i) => {
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
						</>
					) : (
						<>
							<LevelsBar
								questions={questions}
								activeIndex={activeIndex}
								setActiveIndex={setActiveIndex}
							/>
							<div className='w-full flex justify-center'>
								{(() => {
									const q = content?.content[activeIndex]

									if (q?.type === 'multiple' || q?.type === 'single') {
										return (
											<VariantModerationView
												testId={questions[activeIndex]?.id}
											/>
										)
									} else if (q?.type === 'matching') {
										return (
											<SortVariantModerationView
												testId={questions[activeIndex]?.id}
											/>
										)
									} else if (q?.type === 'open') {
										return (
											<OpenQuestionModerationView
												testId={questions[activeIndex]?.id}
											/>
										)
									}

									return null
								})()}
							</div>
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
				const res = await api.get(`${API}/sections/${sectionId}/content`, {
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				})

				const data = res.data
				setSelectedContent(data)
			} catch (error) {
				setSelectedContent(null)
			}
		}

		fetchContent()
	}, [sectionId])

	return (
		<>
			<div className='grid grid-cols-[320px_1fr] gap-5 h-full min-h-0'>
				<div className='flex flex-col gap-3 '>
					<div className='flex bg-[var(--white)] justify-center rounded-xl shadow-[var(--shadow)] px-4 py-3 gap-3'>
						<Gem size={32} color='var(--hero-epta)' strokeWidth={1.5} />
						<p className='font-medium text-2xl text-[var(--black)]'>
							{content?.name}
						</p>
					</div>
					<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-xl pb-5 px-3 pt-5 flex flex-col justify-between h-full'>
						<div className='flex flex-col gap-3 overflow-y-scroll h-[65.5vh]'>
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
					sectionId={sectionId}
				/>
			</div>
		</>
	)
}

const ModerationComponent = ({ moderationCourseId }) => {
	const { courseId } = useParams()
	const [courseContent, setCourseContent] = useState()

	const [loading, setLoading] = useState(false)

	useEffect(() => {
		setLoading(true)
		const fetchCourses = async () => {
			try {
				const res = await api.get(
					`${API}/courses/${moderationCourseId || courseId}`,
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					},
				)
				const data = res.data

				setGlobalError(null)
				setCourseContent(data)
				setLoading(false)
			} catch (error) {}
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
			<div className='flex flex-col gap-5 h-full min-h-0'>
				<div className='flex justify-between items-center mt-10'></div>

				<CourseOverview content={courseContent} />
			</div>
		</>
	)
}
export default ModerationComponent
