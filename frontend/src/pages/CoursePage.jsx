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
import { Button, EllipsisButton } from '../components/Buttons'
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

const ModuleContent = ({ type, index, title, bg, onClick }) => {
	return (
		<div
			onClick={onClick}
			className={`flex justify-between items-center ${
				!bg && 'hover:bg-[var(--light-middle)] cursor-pointer px-3'
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
		<>
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
												key={lesson.id}
												title={lesson.title}
												type={lesson.type}
												onClick={() =>
													onContentSelect(lesson.id, lesson.type, lesson.title)
												}
												isSelected={selectedContent?.id === lesson.id}
											/>
										)
									})}
								</div>
							</>
						)}
					</div>
				)
			})}
		</>
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
			<div className='flex gap-3'>
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

const ContentView = ({ content, contentType, contentTitle }) => {
	const [answers, setAnswers] = useState({})
	const [singleAnswers, setSingleAnswers] = useState({})

	const questions = useMemo(() => {
		if (!content || !content.content) return []
		return [...content.content].sort(() => Math.random() - 0.5)
	}, [content])

	const [activeIndex, setActiveIndex] = useState(0)

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
		<div className='bg-[var(--white)] shadow-[var(--shadow)] flex flex-col gap-3 rounded-xl p-5 overflow-scroll max-h-200'>
			<ModuleContent bg={true} type={contentType} title={contentTitle} />
			<div className='flex flex-col gap-5'>
				{content.length !== 0 ? (
					contentType !== 'test' ? (
						content.map((item, i) => {
							switch (item.type) {
								case 'text':
									return <TextViewer key={i} content={item?.content?.content} />
								case 'code':
									return (
										<CustomCodeBlock
											view={true}
											key={i}
											codeInfo={item?.content}
										/>
									)
								case 'image':
									return <p>блок {item.type}</p>
								case 'video':
									return <p>блок {item.type}</p>
								case 'files':
									return <p>блок {item.type}</p>
								case 'table':
									return (
										<TableView
											key={i}
											cols={item?.content?.cols}
											rows={item?.content?.rows}
											values={item?.content?.data}
										/>
									)
								case 'audio':
									return <p>блок {item.type}</p>

								case 'callout':
									return (
										<CalloutView
											key={i}
											title={item?.content?.title}
											description={item?.content?.description}
											IconName={item?.content?.icon}
										/>
									)
								case 'formula':
									return (
										<FormulaView key={i} Formula={item?.content?.formula} />
									)
								case 'button':
									return (
										<ButtonView
											key={i}
											title={item?.content?.buttonTitle}
											to={item?.content?.buttonUrl}
										/>
									)
								default:
									return null
							}
						})
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
									if (q.type === 'more') {
										return (
											<MoreVariantView
												question={q.question}
												Answers={q.answers}
												selected={answers[activeIndex] || []}
												onAnswerSelect={(id, checked) => {
													setAnswers(prev => {
														const prevSelected = prev[activeIndex] || []
														const newSelected = checked
															? [...prevSelected, id]
															: prevSelected.filter(x => x !== id)
														return { ...prev, [activeIndex]: newSelected }
													})
												}}
											/>
										)
									} else if (q.type === 'single') {
										return (
											<OneVariantView
												question={q.question}
												Answers={q.answers}
												selectedId={singleAnswers[activeIndex] ?? null}
												onAnswerSelect={id => {
													setSingleAnswers(prev => ({
														...prev,
														[activeIndex]: id,
													}))
												}}
											/>
										)
									} else if (q.type === 'sort') {
										return (
											<SortVariantView
												question={q.question}
												initialPairs={q.answers}
											/>
										)
									} else if (q.type === 'open') {
										return <OpenQuestionView question={q.question} />
									}

									return null
								})()}
							</div>
							<div className='flex justify-center gap-3'>
								{activeIndex !== 0 ? (
									<button
										onClick={() => setActiveIndex(prev => prev - 1)}
										className={` justify-center items-center pr-4 pl-1 py-2 bg-[var(--black)] text-[var(--white)] rounded-lg font-medium hover:bg-[var(--hero-epta)] hover:text-white transition-all cursor-pointer flex`}
									>
										<ChevronLeft />
										<p>Назад</p>
									</button>
								) : (
									<div></div>
								)}
								{activeIndex + 1 !== questions.length ? (
									<button
										onClick={() => setActiveIndex(prev => prev + 1)}
										className=' justify-center items-center pl-4 pr-1 py-2 bg-[var(--black)] text-[var(--white)] rounded-lg font-medium hover:bg-[var(--hero-epta)] hover:text-white transition-all cursor-pointer flex'
									>
										<p>Далее</p>
										<ChevronRight />
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

	const handleContentSelect = (SectionId, SectionType) => {
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

				console.log('Fetched content data:', data) // Логируем полученные данные
				setSelectedContent(data)
			} catch (err) {
				console.error(err)
			}
		}

		fetchContent()
	}, [sectionId])

	return (
		<>
			<div className='grid grid-cols-[1fr_3fr] gap-5 h-fit min-h-[607px]'>
				<div className='flex flex-col gap-3'>
					<div className='flex bg-[var(--white)] justify-center rounded-xl shadow-[var(--shadow)] px-4 py-3 gap-3'>
						<Gem size={32} color='var(--hero-epta)' strokeWidth={1.5} />
						<p className='font-medium text-2xl text-[var(--black)]'>
							{content?.name}
						</p>
					</div>
					<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-xl pb-5 px-3 pt-5 flex flex-col justify-between'>
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

							<div className='h-150 flex flex-col gap-3 overflow-scroll w-full py-2 px-2'>
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
				/>
			</div>
		</>
	)
}

const CoursePage = () => {
	const { courseId } = useParams()
	const [courseContent, setCourseContent] = useState()

	useEffect(() => {
		const fetchCourses = async () => {
			const res = await fetch(`${API}/courses/${courseId}`)
			const data = await res.json()
			setCourseContent(data)
		}
		fetchCourses()
	}, [courseId])

	return (
		<>
			<div className='flex flex-col gap-5'>
				<div className='flex justify-between items-center mt-10'></div>

				<CourseOverview content={courseContent} />
			</div>
		</>
	)
}
export default CoursePage
