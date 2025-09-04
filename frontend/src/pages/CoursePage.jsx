import { useState } from 'react'
import React from 'react'
import {
	ArrowRightFromLine,
	BookMarked,
	ChevronDown,
	ChevronsDown,
	ChevronsUp,
	ChevronUp,
	Copy,
	Frown,
	Gem,
	LaptopMinimalCheck,
	ListRestart,
	NotebookPen,
	Package,
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

const ContentView = ({ content }) => {
	const [blocks, setBlocks] = useState([])

	// Для тестов: вопросы и активный индекс
	const [questions, setQuestions] = useState([])
	const [activeIndex, setActiveIndex] = useState(0)

	const addBlock = type => setBlocks(prev => [...prev, type])
	const removeBlock = index =>
		setBlocks(prev => prev.filter((_, i) => i !== index))

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
					content.content.map(item => {
						return <React.Fragment>{item}</React.Fragment>
					})
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
						<p className='font-bold text-2xl'>
							Hello, World! Или как подружиться с кодом
						</p>,
						<div className='w-full'>
							<p>
								<span className='w-full'>
									<span className='font-bold'>Тема: </span> Массивы <br />
									<span className='font-bold'>Цель: </span> Изучить массивы
								</span>
							</p>
						</div>,
						<CustomCodeBlock
							codeInfo={[
								{
									code: '<!DOCTYPE html>\r\n<html lang="en" data-theme="light">\r\n\t<head>\r\n\t\t<meta charset="UTF-8" />\r\n\t\t<link href="./src/index.css" rel="stylesheet" />\r\n\t\t<link href="./src/themes.css" rel="stylesheet" />\r\n\t\t<link rel="icon" type="image/svg+xml" href="/icon.svg" />\r\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0" />\r\n\t\t<link href="/src/index.css" rel="stylesheet" />\r\n\t\t<link rel="preconnect" href="https://fonts.googleapis.com" />\r\n\t\t<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\r\n\t\t<link\r\n\t\t\thref="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"\r\n\t\t\trel="stylesheet"\r\n\t\t/>\r\n\t\t<title>LMS</title>\r\n\t</head>\r\n\t<body>\r\n\t\t<div id="root"></div>\r\n\t\t<script type="module" src="/src/main.jsx"></script>\r\n\t</body>\r\n</html>\r\n',
									language: 'html',
								},
							]}
						/>,
						<CalloutView
							IconId={1}
							title={'Теорема'}
							description={'Описание'}
						/>,
						<ButtonView
							title={'Кнопка'}
							to={'https://lucide.dev/icons/square-function'}
						/>,
						<FileView
							Files={[
								{
									name: 'index.html',
									lastModified: 1755599372004,
									size: 811,
									type: 'text/html', // возможно нужно добавить type
								},
								{
									name: 'package.json',
									lastModified: 1756703219789,
									size: 1188,
									type: 'application/json', // возможно нужно добавить type
								},
							]}
						/>,
						<FormulaView
							Formula={String.raw`\int_0^\infty p(s) ds = 1- \frac{1}{\lambda}p(0)\implies p(0)=\lambda\left(1-\int\limits_0^\infty p(s)ds\right)\ldots\ldots`}
						/>,
						<PhotoView
							photos={[
								'https://i.pinimg.com/1200x/e5/25/ee/e525ee42975318386bbc4646c8727f0f.jpg',
								'https://i.pinimg.com/1200x/74/5d/72/745d721c64b0ca1cc316379d361576c1.jpg',
								'https://i.pinimg.com/1200x/e5/25/ee/e525ee42975318386bbc4646c8727f0f.jpg',
							]}
						/>,
						<VideoPlayer
							url={'https://rutube.ru/video/113438b8c625081c0ee12f6d36fe7c63/'}
							course={true}
						/>,
						<VideoPlayer url={'/video.mp4'} course={true} />,
						<CustomAudioPlayer audioUrl={'/audio.wav'} course={true} />,
						<TableView
							rows={3}
							cols={3}
							values={['1', '2', '', '3', '', '5', '', '', '7']}
						/>,
					],
				},
				{
					id: 1,
					type: 'Практика',
					title: 'Hello, World! Или как подружиться с кодом',
					content: [],
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

	// ...existing code...
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

	// Новый обработчик для добавления модуля
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
									onAddLesson={handleAddLesson} // передаём функцию
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
