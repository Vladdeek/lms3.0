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
import { set } from 'date-fns'
import Loader from '../components/Loader'
import VariantModerationView from '../components/TestModerationView/VariantsModertionView'
import { getCookie, token } from '../TOKEN'
import SortVariantModerationView from '../components/TestModerationView/SortVariantsModertionView'
import OpenQuestionModerationView from '../components/TestModerationView/OpenQuestionModertionView'

const { setError } = useError()

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

const LevelsBar = ({ questions, activeIndex, setActiveIndex }) => {
	console.log('questions: ', questions)
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
		<div className='bg-[var(--white)] shadow-[var(--shadow)] flex flex-col gap-3 rounded-xl p-5 overflow-y-scroll hide-scrollbar'>
			<ModuleContent bg={true} type={contentType} title={contentTitle} />
			<div className='flex flex-col gap-5'>
				{content?.length !== 0 ? (
					contentType !== 'test' ? (
						<>
							{content?.map((item, i) => {
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
				const res = await axios.get(`${API}/sections/${sectionId}/content`, {
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
						'X-CSRF-TOKEN': getCookie('csrftoken'),
					},
				})

				const data = res.data
				console.log('Fetched content data:', data)
				setSelectedContent(data)
			} catch (err) {
				setSelectedContent(null)
				console.error(err)
				setError(err.response ? String(err.response.status) : '500')
			}
		}

		fetchContent()
	}, [sectionId])

	return (
		<>
			<div className='grid grid-cols-[1fr_3fr] gap-5 h-full '>
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
				const res = await axios.get(
					`${API}/courses/${moderationCourseId || courseId}`,
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
							'X-CSRF-TOKEN': getCookie('csrftoken'),
						},
					}
				)
				const data = res.data

				setError(null)
				setCourseContent(data)
				setLoading(false)
			} catch (err) {
				console.error(err)
				setError(err.response ? String(err.response.status) : '500')
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
			<div className='flex flex-col gap-5 h-[73vh]'>
				<div className='flex justify-between items-center mt-10'></div>

				<CourseOverview content={courseContent} />
			</div>
		</>
	)
}
export default ModerationComponent
