import {
	ArrowRightFromLine,
	AudioLines,
	Bookmark,
	BookMarked,
	BrickWall,
	CalendarClock,
	ChevronDown,
	ChevronsDown,
	ChevronsUp,
	ChevronUp,
	CircleCheckBig,
	CloudUpload,
	Code,
	Copy,
	EllipsisVertical,
	FilePlus2,
	Files,
	Film,
	Gem,
	Image,
	Layers2,
	ListRestart,
	NotebookPen,
	Package,
	Settings,
	Table,
	Text,
	Trash,
	UsersRound,
} from 'lucide-react'
import { AltRadioButton, Button, EllipsisButton } from '../components/Buttons'
import { useState } from 'react'
import { SearchInput } from '../components/Inputs'
import {
	AudioInput,
	CalloutConstructor,
	CodeFileInput,
	ConstructorFileInput,
	ConstructorPhotoInput,
	ConstructorTextArea,
	ConstructorTitleInput,
	ConstructorVideoInput,
	TableConstructor,
} from '../components/ConstructorInputs'

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
					<p className='font-medium text-base'>Модуль {index}</p>
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
				<EllipsisButton
					options={options}
					onOptionClick={option => console.log(option.action)}
					bg={true}
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
					) : (
						<NotebookPen size={20} />
					)}
					<p className='font-medium text-base whitespace-nowrap'>
						{type} {index}
					</p>
				</div>
				<p className='font-bold text-base'>/</p>
				<p className={`font-normal  ${bg ? 'text-base' : 'text-sm w-2/5'}`}>
					{title}
				</p>
			</div>
			{!bg && (
				<EllipsisButton
					options={options}
					onOptionClick={option => console.log(option.action)}
				/>
			)}
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
			{ModuleInfo.map((item, index) => {
				const isExpanded = expandedModules[index] === true // По умолчанию закрыто

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
												key={lessonIndex}
												title={lesson.title}
												type={lesson.type}
												onClick={() => onContentSelect(lesson)}
												isSelected={selectedContent?.id === lesson.id}
											/>
										)
									})}
								</div>
								<Button
									icon={FilePlus2}
									title={'Добавить занятие'}
									textSize={16}
									className='mx-3'
								/>
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

	const addBlock = type => {
		setBlocks(prev => [...prev, type])
	}

	const removeBlock = index => {
		setBlocks(prev => prev.filter((_, i) => i !== index))
	}

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
			{/* Заголовок — всегда первый */}
			<ConstructorTitleInput DelComponent={() => {}} />

			{/* Рендерим блоки по типу */}
			{blocks.map((block, i) => {
				const del = () => removeBlock(i) // функция удаления для конкретного блока
				switch (block) {
					case 'text':
						return <ConstructorTextArea key={i} DelComponent={del} />
					case 'code':
						return <CodeFileInput key={i} DelComponent={del} />
					case 'photo':
						return <ConstructorPhotoInput key={i} DelComponent={del} />
					case 'video':
						return <ConstructorVideoInput key={i} DelComponent={del} />
					case 'files':
						return <ConstructorFileInput key={i} DelComponent={del} />
					case 'table':
						return <TableConstructor key={i} DelComponent={del} />
					case 'audio':
						return <AudioInput key={i} DelComponent={del} />
					case 'callout':
						return <CalloutConstructor key={i} DelComponent={del} />
					default:
						return null
				}
			})}

			{/* Меню для добавления новых блоков */}
			<ConstructorMenu onAdd={addBlock} />
		</div>
	)
}

const ConstructorMenu = ({ onAdd }) => {
	const buttons = [
		{
			title: 'Текст',
			type: 'text',
			icon: <Text size={32} color='var(--middle)' />,
		},
		{
			title: 'Код',
			type: 'code',
			icon: <Code size={32} color='var(--middle)' />,
		},
		{
			title: 'Фото',
			type: 'photo',
			icon: <Image size={32} color='var(--middle)' />,
		},
		{
			title: 'Видео',
			type: 'video',
			icon: <Film size={32} color='var(--middle)' />,
		},
		{
			title: 'Файлы',
			type: 'files',
			icon: <Files size={32} color='var(--middle)' />,
		},
		{
			title: 'Таблица',
			type: 'table',
			icon: <Table size={32} color='var(--middle)' />,
		},
		{
			title: 'Аудио',
			type: 'audio',
			icon: <AudioLines size={32} color='var(--middle)' />,
		},
		{
			title: 'Выноска',
			type: 'callout',
			icon: <Layers2 size={32} color='var(--middle)' />,
		},
	]

	return (
		<div className='grid grid-cols-4 gap-2 p-3 bg-[var(--white)] rounded-xl shadow-[var(--shadow)] w-fit'>
			{buttons.map((item, index) => (
				<button
					key={index}
					onClick={() => onAdd(item.type)}
					className='flex flex-col aspect-square items-center justify-center gap-2 bg-[var(--light-middle)] rounded-lg h-25 hover:scale-102 hover:shadow-md transition-all'
				>
					{item.icon}
					<p className='text-base text-[var(--middle)]'>{item.title}</p>
				</button>
			))}
		</div>
	)
}

const Constructor = () => {
	const ModuleInfo = [
		{
			id: 0,
			title: 'Вступление',
			content: [
				{
					id: 0,
					type: 'Лекция',
					title: 'Hello, World! Или как подружиться с кодом',
					content: 'Содержимое лекции о основах программирования...',
				},
				{
					id: 1,
					type: 'Практика',
					title: 'Hello, World! Или как подружиться с кодом',
					content: 'Задания для практического занятия...',
				},
			],
		},
		{
			id: 1,
			title: 'Основы программирования',
			content: [
				{
					id: 2,
					type: 'Лекция',
					title: 'Переменные и типы данных',
					content: 'Содержимое лекции о переменных...',
				},
				{
					id: 3,
					type: 'Практика',
					title: 'Работа с переменными',
					content: 'Задания для практического занятия...',
				},
			],
		},
		{
			id: 2,
			title: 'Условия и циклы',
			content: [
				{
					id: 4,
					type: 'Лекция',
					title: 'Условные конструкции if/else',
					content: 'Содержимое лекции об условиях...',
				},
				{
					id: 5,
					type: 'Практика',
					title: 'Решение задач с условиями',
					content: 'Задания для практического занятия...',
				},
			],
		},
	]

	const [selectedContent, setSelectedContent] = useState(null)

	const handleContentSelect = content => {
		setSelectedContent(content)
	}

	return (
		<>
			<div className='grid grid-cols-[1fr_3fr] gap-5 h-fit min-h-[607px]'>
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
								<SearchInput />
								<Button icon={ListRestart} style='white' size={40} />
								<Button
									icon={CloudUpload}
									style='white'
									size={40}
									IconColor={'var(--green-status-text)'}
								/>
							</div>
						</div>

						<div className='h-104 flex flex-col gap-3 overflow-scroll w-full py-2 px-2'>
							<ModuleBlock
								ModuleInfo={ModuleInfo}
								onContentSelect={handleContentSelect}
								selectedContent={selectedContent}
							/>
							<div className='h-fit mt-2'>
								<Button
									icon={Package}
									title={'Добавить модуль'}
									textSize={16}
									className='w-full'
								/>
							</div>
						</div>
					</div>

					<div className='h-fit'>
						<Button
							icon={CircleCheckBig}
							title={'Завершение курса'}
							textSize={16}
							className='mt-2 w-full'
						/>
					</div>
				</div>

				<ContentView content={selectedContent} />
			</div>
		</>
	)
}

const ConstructorPage = () => {
	const title = 'Основы программирования'
	const options = [
		{ value: 0, title: 'Конструктор', icon: BrickWall },
		{ value: 1, title: 'Управление доступом', icon: UsersRound },
	]

	const [selected, setSelected] = useState(0)
	return (
		<>
			<div className='flex flex-col gap-5'>
				<div className='flex justify-between items-center mt-10'>
					<div className='flex gap-5 items-center '>
						{options.map(option => (
							<AltRadioButton
								key={option.value}
								name='example'
								value={option.value}
								title={option.title}
								icon={option.icon}
								checked={selected === option.value}
								onChange={() => setSelected(option.value)}
							/>
						))}
					</div>
					<div className='flex bg-[var(--white)] rounded-lg shadow-[var(--shadow)] px-4 py-3 gap-3'>
						<Gem size={32} color='var(--hero-epta)' strokeWidth={1.5} />
						<p className='font-medium text-2xl text-[var(--black)]'>{title}</p>
					</div>
					<div className='flex gap-5 items-center'>
						<Button icon={CalendarClock} style='white' />
						<Button icon={Settings} style='white' />
						<Button title={'Сохранить'} style='outline' />
						<Button title={'Опубликовать курс'} style='black' />
					</div>
				</div>
				<Constructor />
			</div>
		</>
	)
}
export default ConstructorPage
