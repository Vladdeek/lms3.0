import { useEffect, useMemo, useState } from 'react'
import React from 'react'
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
					{type === 'Лекция' ? (
						<BookMarked size={20} />
					) : type === 'Практика' ? (
						<NotebookPen size={20} />
					) : (
						type === 'Тест' && <LaptopMinimalCheck size={20} />
					)}
					<p className='font-medium text-base whitespace-nowrap'>
						{type} {index}
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

const ModuleBlock = ({
	ModuleInfo,
	onContentSelect,
	selectedContent,
	onAddLesson,
}) => {
	const [expandedModules, setExpandedModules] = useState({})

	const toggleModule = index => {
		setExpandedModules(prev => ({
			...prev,
			[index]: !prev[index],
		}))
	}

	return (
		<>
			{ModuleInfo.map((item, index) => {
				const isExpanded = expandedModules[index] === true

				return (
					<div key={index} className='flex flex-col gap-3'>
						<ModuleTitle
							title={item.title}
							index={index + 1}
							isExpanded={isExpanded}
							onToggle={() => toggleModule(index)}
						/>
						{isExpanded && (
							<>
								<div className=''>
									{item.content.map((lesson, lessonIndex) => {
										return (
											<ModuleContent
												key={lesson.id}
												title={lesson.title}
												type={lesson.type}
												onClick={() => onContentSelect(lesson)}
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

const ContentView = ({ content }) => {
	const [blocks, setBlocks] = useState([])
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
			<ModuleContent bg={true} type={content.type} title={content.title} />
			<div className='flex flex-col gap-5'>
				{content.content.length !== 0 ? (
					content.type !== 'test' ? (
						content.content.map((item, i) => {
							switch (item.type) {
								case 'text':
									return <TextViewer key={i} content={item?.content?.content} />
								case 'code':
									return <CustomCodeBlock key={i} codeInfo={item?.content} />
								case 'photo':
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

const CourseOverview = ({ title }) => {
	const [ModuleInfo, setModuleInfo] = useState([
		{
			id: 0,
			title: 'Вступление',
			content: [
				{
					id: 0,
					type: 'Лекция',
					title: 'Hello, World! Или как подружиться с кодом',
					content: [
						{
							type: 'text',
							content: {
								content:
									'[{"type":"paragraph","children":[{"text":"жирный","bold":true}]},{"type":"align-center","children":[{"text":"по центру"}]},{"type":"align-right","children":[{"text":"по правому краю"}]},{"type":"align-left","children":[{"text":"италик","italic":true}]},{"type":"align-left","children":[{"text":"подчеркнутый","underline":true}]},{"type":"align-left","children":[{"text":"перечекнутый","strikethrough":true}]}]',
								plainText:
									'жирныйпо центрупо правому краюиталикподчеркнутыйперечекнутый',
							},
						},
						{
							type: 'code',
							content: {
								code: "//Первый код\r\nconsole.log('Hello, world!')\r\n",
								language: 'jsx',
							},
						},
						{
							type: 'photo',
							content: [],
						},
						{
							type: 'video',
							content: [
								{
									videoUrl:
										'https://rutube.ru/video/df2207e3a752cae366d2e0e0315ea3a4/',
									preview: null,
									info: {
										name: 'Видео по ссылке',
										size: 'N/A',
										type: 'video/url',
										duration: 0,
									},
									isUrl: true,
								},
							],
						},
						{
							type: 'files',
							content: [{}, {}, {}],
						},
						{
							type: 'table',
							content: {
								rows: 2,
								cols: 2,
								data: ['1', '', '', '2'],
							},
						},
						{
							type: 'callout',
							content: {
								icon: 'Megaphone',
								title: 'заголовок',
								description: 'описание выноски',
							},
						},
						{
							type: 'formula',
							content: {
								formula: 'E = mc^2',
							},
						},
						{
							type: 'button',
							content: {
								buttonTitle: 'ссылка на видео ',
								buttonUrl:
									'https://rutube.ru/video/df2207e3a752cae366d2e0e0315ea3a4/',
							},
						},
					],
				},
				{
					id: 1,
					type: 'Практика',
					title: 'Hello, World! Или как подружиться с кодом',
					content: [
						{
							type: 'text',
							content: {
								content:
									'[{"type":"paragraph","children":[{"text":"dsadkhvsahjdvjhsavdh"}]},{"type":"align-center","children":[{"text":"dasdsa","bold":true}]}]',
								plainText: 'dsadkhvsahjdvjhsavdhdasdsa',
							},
						},
						{
							type: 'table',
							content: {
								rows: 3,
								cols: 2,
								data: ['1111', '', '', '2222', '4444', '333'],
							},
						},
						{
							type: 'callout',
							content: {
								icon: 'ShieldAlert',
								title: 'Заголовок',
								description: 'описание выноски',
							},
						},
						{
							type: 'formula',
							content: {
								formula: 'E = mc^2',
							},
						},
						{
							type: 'button',
							content: {
								buttonTitle: 'стаканы на wb',
								buttonUrl:
									'https://www.wildberries.ru/catalog/209746142/detail.aspx',
							},
						},
						{
							type: 'code',
							content: {
								code: "//Первый код\r\nconsole.log('Hello, world!')\r\n",
								language: 'jsx',
							},
						},
					],
				},
				{
					id: 2,
					type: 'Тест',
					title: 'Hello, World! Или как подружиться с кодом',
					content: [],
				},
			],
		},
		{
			id: 1,
			title: 'Основы программирования',
			content: [
				{
					id: 3,
					type: 'Лекция',
					title: 'Переменные и типы данных',
					content: [],
				},
				{
					id: 4,
					type: 'Практика',
					title: 'Работа с переменными',
					content: [],
				},
				{
					id: 5,
					type: 'Тест',
					title: 'Работа с переменными',
					content: [
						{
							type: 'more',
							question: '1',
							answers: ['a', 'b', 'c', 'd'],
						},
						{
							type: 'more',
							question: '2',
							answers: ['1', '2', '3', '4'],
						},
						{
							type: 'single',
							question: '3',
							answers: ['a', 'b', 'c', 'd'],
						},
						{
							type: 'single',
							question: '4',
							answers: ['1', '2', '3', '4'],
						},
						{
							type: 'sort',
							question:
								'Расположи шаги написания программы в правильном порядке',
							answers: [
								{ id: '1', left: '1', right: 'Написать код' },
								{ id: '2', left: '2', right: 'Запустить программу' },
								{ id: '3', left: '3', right: 'Увидеть результат' },
							],
						},
						{
							type: 'open',
							question:
								'Расположи шаги написания программы в правильном порядке',
						},
					],
				},
			],
		},
		{
			id: 2,
			title: 'Условия и циклы',
			content: [
				{
					id: 5,
					type: 'Лекция',
					title: 'Условные конструкции if/else',
					content: [],
				},
				{
					id: 6,
					type: 'Практика',
					title: 'Решение задач с условиями',
					content: [],
				},
			],
		},
	])

	const [selectedContent, setSelectedContent] = useState(null)
	const handleContentSelect = content => {
		setSelectedContent(content)
	}
	const handleAddLesson = (moduleIndex, lesson) => {
		setModuleInfo(prev =>
			prev.map((module, idx) =>
				idx === moduleIndex
					? {
							...module,
							content: [
								...module.content,
								{
									id: Date.now(),
									type: lesson.type,
									title: lesson.title,
									content: 'Задания для практического занятия...',
								},
							],
					  }
					: module
			)
		)
	}
	const handleAddModule = title => {
		setModuleInfo(prev => [
			...prev,
			{
				id: Date.now(),
				title,
				content: [],
			},
		])
	}

	return (
		<>
			<div className='grid grid-cols-[1fr_3fr] gap-5 h-fit min-h-[607px]'>
				<div className='flex flex-col gap-3'>
					<div className='flex bg-[var(--white)] justify-center rounded-xl shadow-[var(--shadow)] px-4 py-3 gap-3'>
						<Gem size={32} color='var(--hero-epta)' strokeWidth={1.5} />
						<p className='font-medium text-2xl text-[var(--black)]'>{title}</p>
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
									ModuleInfo={ModuleInfo}
									onContentSelect={handleContentSelect}
									selectedContent={selectedContent}
									onAddLesson={handleAddLesson}
								/>
							</div>
						</div>
					</div>
				</div>

				<ContentView content={selectedContent} />
			</div>
		</>
	)
}

const CoursePage = () => {
	const title = 'Основы программирования'

	return (
		<>
			<div className='flex flex-col gap-5'>
				<div className='flex justify-between items-center mt-10'></div>

				<CourseOverview title={title} />
			</div>
		</>
	)
}
export default CoursePage
