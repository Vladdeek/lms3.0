import {
	ArrowDownUp,
	ArrowLeftFromLine,
	ArrowRightFromLine,
	AudioLines,
	BookMarked,
	CheckSquare,
	ChevronDown,
	ChevronsDown,
	ChevronsUp,
	ChevronUp,
	CircleCheckBig,
	CloudUpload,
	Code,
	Copy,
	CopyCheck,
	FilePlus2,
	Files,
	Film,
	Image,
	LaptopMinimalCheck,
	Layers2,
	ListChecks,
	ListOrdered,
	ListRestart,
	MousePointerClick,
	NotebookPen,
	Package,
	Plus,
	Presentation,
	SquareFunction,
	Table,
	Text,
	TextCursorInput,
	Trash,
	X,
} from 'lucide-react'
import { Button, EllipsisButton, SubmitButton } from '../../components/Buttons'
import { useEffect, useState } from 'react'
import { InputDefault, SearchInput } from '../../components/Inputs'
import { ConstructorEditor } from '../../components/ConstructorComponents/TextEditor'
import { CodeFileInput } from '../../components/ConstructorComponents/CodeImport'
import { ConstructorPhotoInput } from '../../components/ConstructorComponents/PhotoImport'
import { ConstructorVideoInput } from '../../components/ConstructorComponents/VideoImport'
import { ConstructorFileInput } from '../../components/ConstructorComponents/FileImport'
import { TableConstructor } from '../../components/ConstructorComponents/TableConstructor'
import { AudioInput } from '../../components/ConstructorComponents/AudioImport'
import { CalloutConstructor } from '../../components/ConstructorComponents/CalloutConstructor'
import FormulaConstructor from '../../components/ConstructorComponents/FormulaInput'
import { ButtonConstructor } from '../../components/ConstructorComponents/ButtonConstructor'
import OneVariant from '../../components/ConstructorTest/OneVariant'
import MoreVariant from '../../components/ConstructorTest/MoreVariants'
import SortVariants from '../../components/ConstructorTest/SortVariants'
import OpenQuestion from '../../components/ConstructorTest/OpenQuestion'
import { API } from '../../API'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Loader from '../../components/Loader'
import { ButtonView } from '../../components/Viewer/ButtonView'
import FormulaView from '../../components/Viewer/FormulaView'
import { CalloutView } from '../../components/Viewer/CalloutView'
import TableView from '../../components/Viewer/TableView'
import { FileView } from '../../components/Viewer/FileView'
import VideoPlayer from '../../components/VideoPlayer'
import { PhotoView } from '../../components/Viewer/PhotoView'
import CustomCodeBlock from '../../components/CustomCodeBlock'
import { TextViewer } from '../../components/Viewer/TextViewer'
import CustomAudioPlayer from '../../components/AudioPlayer'

const CreateModuleButton = ({
	onAddModule,
	onReplaceModule,
	onRemoveModule,
	courseId,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [title, setTitle] = useState('')
	const [isNameValid, setIsNameValid] = useState(false)

	const handleAddModule = async () => {
		const tempId = Date.now().toString()
		const tempModule = {
			id: tempId,
			name: title,
			module_sections: [],
			isTemp: true,
		}

		onAddModule(tempModule)

		try {
			const res = await fetch(`${API}/modules/${courseId}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: title }),
			})

			if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`)
			const data = await res.json()

			console.log(data)
			onReplaceModule(tempId, data)
		} catch (error) {
			console.error(error)
			onRemoveModule(tempId)
		}
	}

	const handleSave = () => {
		if (!isNameValid) return
		handleAddModule()
		setTitle('')
		setIsOpen(false)
		setIsNameValid(false)
	}

	return (
		<div className='relative w-full'>
			<Button
				icon={Package}
				title={'Добавить модуль'}
				textSize={16}
				className='w-full'
				onClick={() => setIsOpen(prev => !prev)}
			/>
			{isOpen && (
				<div className='absolute bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 top-14 left-0 flex flex-col gap-3 z-10 w-full'>
					<InputDefault
						title={'Название модуля'}
						placeholder={'Введите название'}
						required={true}
						InputStatus={false}
						value={title}
						onChange={e => setTitle(e.target.value)}
						onStatusChange={setIsNameValid}
					/>
					<div className='flex justify-between mt-2 gap-2'>
						<Button
							title='Добавить модуль'
							style='black'
							onClick={handleSave}
							width={'100%'}
							disabled={!isNameValid}
						/>
					</div>
				</div>
			)}
		</div>
	)
}

const CreateLessonButton = ({
	moduleId,
	onAddLesson,
	onReplaceLesson,
	onRemoveLesson,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [selected, setSelected] = useState(0)
	const [step, setStep] = useState(0)
	const [isNameValid, setIsNameValid] = useState(false)
	const [lessonTitle, setLessonTitle] = useState('')

	const lessonTypes = [
		{
			label: 'Лекция',
			apiType: 'lecture',
			icon: <BookMarked size={24} />,
			description:
				'Теоретический материал с поддержкой текста, изображений, видео и аудио. Можно прикреплять дополнительные файлы для изучения.',
		},
		{
			label: 'Практика',
			apiType: 'practice',
			icon: <NotebookPen size={24} />,
			description:
				'Задания для самостоятельного выполнения. Включает текстовые инструкции, примеры и возможность загрузки решений.',
		},
		{
			label: 'Тест',
			apiType: 'test',
			icon: <LaptopMinimalCheck size={24} />,
			description:
				'Проверка знаний с помощью различных типов вопросов: выбор, ввод ответа, соответствие и др.',
		},
	]

	const handleAddLesson = async lesson => {
		const tempId = Date.now().toString()
		const tempLesson = {
			id: tempId,
			title: lesson.title,
			type: lesson.type,
			content: {},
			isTemp: true,
		}

		onAddLesson(moduleId, tempLesson)

		try {
			const token = localStorage.getItem('access_token')
			const res = await fetch(`${API}/sections/modules/${moduleId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					title: lesson.title,
					type: lesson.type,
					content: {},
				}),
			})

			if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`)
			const data = await res.json()
			console.log(data)

			onReplaceLesson(moduleId, tempId, data)
		} catch (error) {
			console.error(error)
			onRemoveLesson(moduleId, tempId)
		}
	}

	const Save = () => {
		handleAddLesson({ type: lessonTypes[selected].apiType, title: lessonTitle })
		setStep(0)
		setIsOpen(false)
		setLessonTitle('')
		setIsNameValid(false)
	}

	const steps = [
		<>
			<div className='flex justify-center gap-5'>
				{lessonTypes.map((item, index) => (
					<button
						key={index}
						type='button'
						onClick={() => setSelected(index)}
						className={`
                                flex flex-col items-center justify-center gap-2 aspect-square rounded-lg transition-all
                                ${
																	selected === index
																		? 'bg-[var(--hero-epta)] text-white'
																		: 'bg-[var(--bg)] text-[var(--middle)]'
																}
                                hover:scale-105
                                min-w-[100px]
                            `}
					>
						<span className='mb-1'>{item.icon}</span>
						<span className='font-medium'>{item.label}</span>
					</button>
				))}
			</div>
			{lessonTypes[selected] && (
				<p className='text-[var(--middle)] text-center'>
					{lessonTypes[selected].description}
				</p>
			)}

			<div className='flex justify-end mt-2'>
				<Button title='Далее' style='black' onClick={() => setStep(1)} />
			</div>
		</>,
		<>
			<InputDefault
				title={'Название занятия'}
				placeholder={'Введите название'}
				required={true}
				InputStatus={false}
				value={lessonTitle}
				onChange={e => setLessonTitle(e.target.value)}
				onStatusChange={setIsNameValid}
			/>
			<div className='flex justify-between gap-2 mt-2'>
				<Button title='назад' style='outline' onClick={() => setStep(0)} />
				<Button
					title='Добавить занятие'
					style='black'
					onClick={Save}
					width={'100%'}
					disabled={!isNameValid}
				/>
			</div>
		</>,
	]

	return (
		<div className=''>
			<Button
				icon={FilePlus2}
				title={'Добавить занятие'}
				textSize={16}
				className=''
				onClick={() => setIsOpen(prev => !prev)}
				width={'100%'}
			/>
			{isOpen && (
				<div className=' bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 mt-2  flex flex-col gap-3 z-1000 w-full'>
					{steps[step]}
				</div>
			)}
		</div>
	)
}

const ConstructorTitleInput = ({}) => {
	const [inputValue, setInputValue] = useState('')
	const [inputStatus, setInputStatus] = useState(false)

	const handleInputChange = e => {
		const value = e.target.value
		setInputValue(value)
		const status = validate ? validate(value) : value.trim() !== ''
		setInputStatus(status)
		if (onStatusChange) onStatusChange(status)
	}

	return (
		<input
			type={'text'}
			value={inputValue}
			onChange={handleInputChange}
			className={`outline-0 transition mt-3 text-[20px] font-bold px-4 py-3 rounded-lg ${
				inputStatus ? 'text-[--black]' : 'text-[--middle]'
			}`}
			placeholder={'Заголовок занятия'}
		/>
	)
}

const ModuleTitle = ({
	title,
	index,
	isExpanded,
	onToggle,
	moduleId,
	onRemoveModule,
}) => {
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
		{
			title: 'Удалить',
			icon: <Trash size={20} />,
			action: () => deleteModule(moduleId),
		},
	]

	const deleteModule = async id => {
		try {
			const response = await fetch(`${API}/modules/${id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			})

			if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`)
			onRemoveModule(id)
		} catch (err) {
			console.error('Ошибка при удалении модуля:', err)
		}
	}

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
				<EllipsisButton
					options={options}
					onOptionClick={options => options.action(moduleId)}
					bg={true}
				/>
			</div>
		</div>
	)
}

const ModuleContent = ({
	type,
	index,
	title,
	bg,
	onClick,
	sectionId,
	onRemoveLesson,
}) => {
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
		{
			title: 'Удалить',
			icon: <Trash size={20} />,
			action: () => deleteSection(sectionId),
		},
	]

	const deleteSection = async id => {
		try {
			const response = await fetch(`${API}/sections/${id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			})

			if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`)
			onRemoveLesson(id)
		} catch (err) {
			console.error('Ошибка при удалении секции:', err)
		}
	}

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
				<p className={`font-normal  ${bg ? 'text-base' : 'text-sm w-2/5'}`}>
					{title}
				</p>
			</div>
			{!bg && (
				<EllipsisButton
					options={options}
					onOptionClick={options => options.action(sectionId)}
					bg={false}
				/>
			)}
		</div>
	)
}

const ModuleBlock = ({
	ModuleInfo,
	onContentSelect,
	selectedContent,
	onAddLesson,
	onReplaceLesson,
	onRemoveLesson,
	deleteModule,
	deleteSection,
}) => {
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
				{ModuleInfo &&
					ModuleInfo.map((module, index) => {
						const isExpanded = expandedModules[index] === true

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
								<div key={index} className='flex flex-col gap-3'>
									<ModuleTitle
										title={module.name}
										moduleId={module.id}
										index={index + 1}
										isExpanded={isExpanded}
										onToggle={() => toggleModule(index)}
										onRemoveModule={deleteModule}
									/>
									{isExpanded && module.module_sections && (
										<div>
											<div>
												{module.module_sections.map((section, sectionIndex) => {
													return (
														<motion.div
															key={section.id}
															initial={{ scale: 0.8, opacity: 0 }}
															animate={{ scale: 1, opacity: 1 }}
															transition={{
																duration: 0.3,
																delay: sectionIndex * 0.1,
																ease: 'easeOut',
															}}
														>
															<ModuleContent
																title={section.title}
																type={section.type}
																sectionId={section.id}
																onClick={() => onContentSelect(section)}
																isSelected={selectedContent?.id === section.id}
																onRemoveLesson={deleteSection}
															/>
														</motion.div>
													)
												})}
											</div>
											<motion.div
												key={module.module_sections.length + 1}
												initial={{ scale: 0.8, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												transition={{
													duration: 0.3,
													delay: module.module_sections.length * 0.1,
													ease: 'easeOut',
												}}
											>
												<CreateLessonButton
													moduleId={module.id}
													onAddLesson={onAddLesson}
													onReplaceLesson={onReplaceLesson}
													onRemoveLesson={onRemoveLesson}
												/>
											</motion.div>
										</div>
									)}
								</div>
							</motion.div>
						)
					})}
			</div>
		</div>
	)
}

const CreateLevelModal = ({ isOpen, onClose, onCreate }) => {
	if (!isOpen) return null

	const [answerType, setAnswerType] = useState('single')

	const answerTypes = [
		{ id: 'single', label: 'Один правильный ответ', icon: CopyCheck },
		{
			id: 'multiple',
			label: 'Несколько правильных ответов',
			icon: ListChecks,
		},
		{
			id: 'matching',
			label: 'Расположить в правильном порядке',
			icon: ArrowDownUp,
		},
		{
			id: 'open',
			label: 'Открытый вопрос',
			icon: TextCursorInput,
		},
	]

	const handleAnswerTypeChange = type => setAnswerType(type)

	const handleCreate = () => {
		onCreate(answerType)
		onClose()
	}

	return (
		<div className='fixed inset-0 flex items-center justify-center backdrop-blur-xs z-1000'>
			<div className='bg-[var(--white)] relative p-5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.125)] z-1001 min-w-[400px]'>
				<X
					onClick={onClose}
					className='absolute top-1 right-1 text-[var(--middle)] cursor-pointer'
				/>
				<h2 className='text-2xl font-medium text-[var(--black)] mb-5 text-center'>
					Создание вопроса
				</h2>
				<div className='flex gap-3'>
					<div className='mb-4'>
						{answerTypes.map(type => {
							const IconComponent = type.icon
							const isSelected = answerType === type.id
							return (
								<div
									key={type.id}
									className={`rounded-lg shadow-[var(--shadow)] flex gap-3 px-4 py-2 select-none ${
										isSelected
											? 'bg-[var(--hero-epta)] text-[var(--white)]'
											: 'text-[var(--black)] bg-[var(--white)] hover:bg-[var(--hero-epta)] hover:text-[var(--white)]'
									}   items-center p-2 transition-all cursor-pointer active:scale-95 font-medium mb-2 last:mb-0`}
									onClick={() => handleAnswerTypeChange(type.id)}
								>
									<IconComponent className='flex-shrink-0' />
									<p className='flex-1'>{type.label}</p>
								</div>
							)
						})}

						<p className='border-3 border-[var(--light-middle)] border-dashed rounded-lg text-[var(--middle)] w-125 p-2 mt-5'>
							{answerType === 'single'
								? 'Это классический вопрос, где требуется выбрать единственный верный вариант из предложенного списка. Идеально подходит для проверки знания конкретных фактов. В сам вопрос вы можете вставить аудио для прослушивания, изображение для анализа или формулу — на основе этого медиа-контента и будет строиться задание.'
								: answerType === 'multiple'
								? 'Здесь из списка вариантов необходимо отметить все верные, их может быть два или более. Этот формат отлично проверяет умение анализировать и выделять ключевые аспекты. Как и в других типах, вы можете дополнить вопрос аудиофрагментом, фотографией или формулой, чтобы задание стало комплексным.'
								: answerType === 'matching'
								? 'Данный тип вопроса требует расположить элементы в правильной последовательности, например, расставив исторические события по хронологии или этапы алгоритма по порядку. Для наглядности вы можете добавить в вопрос аудиозапись, изображение или формулу, которые нужно будет проанализировать и использовать для восстановления логической цепочки.'
								: answerType === 'open'
								? 'На данный тип вопроса участник сам формулирует ответ. Это может быть объяснение, вывод, мнение или решение задачи. Для контекста можно добавить изображение, аудио, таблицу или формулу.'
								: ''}
						</p>
					</div>
				</div>

				<button
					className='w-full mt-4 bg-[var(--black)] text-[var(--white)] rounded-lg py-2 font-medium hover:scale-105 active:scale-95 transition-all cursor-pointer'
					onClick={handleCreate}
				>
					Создать
				</button>
			</div>
		</div>
	)
}

const ConstructorLevels = ({
	questions,
	setQuestions,
	activeIndex,
	setActiveIndex,
}) => {
	const [createModalOpen, setCreateModalOpen] = useState(false)

	const handleCreate = type => {
		setQuestions(prev => [...prev, { type }])
		setActiveIndex(questions.length)
	}

	return (
		<>
			<CreateLevelModal
				isOpen={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
				onCreate={handleCreate}
			/>
			<div className='flex flex-wrap  gap-3'>
				{questions?.map((q, idx) => (
					<div
						key={q.id}
						onClick={() => setActiveIndex(idx)}
						className={`w-10 h-10 flex justify-center items-center rounded-md shadow-[var(--shadow)] cursor-pointer transition-all
                            ${
															activeIndex === idx
																? 'bg-[var(--hero-epta)] text-white'
																: 'bg-[var(--white)] text-[var(--black)] hover:bg-[var(--hero-epta)] hover:text-white'
														}
                            active:scale-90`}
					>
						{idx + 1}
					</div>
				))}
				<div
					onClick={() => setCreateModalOpen(true)}
					className='w-10 h-10 bg-[var(--white)] shadow-[var(--shadow)] text-[var(--black)] rounded-md hover:bg-[var(--hero-epta)] hover:text-[var(--white)] flex justify-center items-center p-2 transition-all cursor-pointer active:scale-90'
				>
					<Plus />
				</div>
			</div>
		</>
	)
}

const ContentView = ({
	content,
	onBlocksChange,
	SectionType,
	SectionName,
	isLoading,
	sectionId,
	onSectionTypeChange,
	isEdit,
	clearSelection,
}) => {
	const [questions, setQuestions] = useState([])
	const [activeIndex, setActiveIndex] = useState(0)
	const [blocks, setBlocks] = useState([])

	console.log('blocks: ', blocks)

	const giveId = (index, id) => {
		setQuestions(prev => {
			const updated = [...prev]

			updated[index] = { ...updated[index], id }

			return updated
		})
	}

	useEffect(() => {
		SectionType === 'test' ? setQuestions(content?.content) : setBlocks(content)
		onSectionTypeChange(SectionType)
	}, [content])

	const addBlock = type => setBlocks(prev => [...prev, { type, content: null }])

	const removeBlock = index => {
		setBlocks(prev => {
			const updated = prev.filter((_, i) => i !== index)
			onBlocksChange?.(updated)
			return updated
		})
	}

	const handleBlockChange = (index, data) => {
		console.log('handleBlockChange: ', data)
		setBlocks(prev => {
			const updated = prev.map((b, i) =>
				i === index ? { ...b, content: data } : b
			)
			onBlocksChange?.(updated)
			return updated
		})
	}

	if (!content && !SectionType) {
		return (
			<div className='flex items-center justify-center h-full'>
				<p className='text-[var(--middle)] text-lg'>
					Выберите занятие для просмотра
				</p>
			</div>
		)
	}

	if (SectionType && !content) {
		return (
			<div className=' flex items-center justify-center h-full'>
				<Loader />
			</div>
		)
	}

	return (
		<div className='h-fit overflow-y-scroll hide-scrollbar hide-scrollbar'>
			<div className=' flex flex-col gap-3 rounded-xl p-2'>
				<div className='flex gap-3 items-center'>
					<div className='[1200px]:hidden'>
						<Button
							icon={ArrowLeftFromLine}
							style='white'
							size={40}
							onClick={clearSelection}
						/>
					</div>

					<ModuleContent bg={true} type={SectionType} title={SectionName} />
				</div>

				{SectionType === 'test' ? (
					<>
						<ConstructorLevels
							questions={questions}
							setQuestions={setQuestions}
							activeIndex={activeIndex}
							setActiveIndex={setActiveIndex}
						/>
						{isLoading ? (
							<Loader />
						) : (
							questions?.length > 0 && (
								<>
									{questions[activeIndex]?.type === 'single' && (
										<OneVariant
											sectionId={sectionId}
											testId={questions[activeIndex]?.id}
											onChange={data => giveId(activeIndex, data)}
										/>
									)}
									{questions[activeIndex]?.type === 'multiple' && (
										<MoreVariant
											sectionId={sectionId}
											testId={questions[activeIndex]?.id}
											onChange={data => giveId(activeIndex, data)}
										/>
									)}
									{questions[activeIndex]?.type === 'matching' && (
										<SortVariants
											sectionId={sectionId}
											testId={questions[activeIndex]?.id}
											onChange={data => giveId(activeIndex, data)}
										/>
									)}
									{questions[activeIndex]?.type === 'open' && (
										<OpenQuestion
											sectionId={sectionId}
											testId={questions[activeIndex]?.id}
											onChange={data => giveId(activeIndex, data)}
										/>
									)}
								</>
							)
						)}
					</>
				) : (
					<>
						{blocks?.map((block, i) => {
							const del = () => removeBlock(i)

							let content
							switch (block.type) {
								case 'text':
									content = isEdit ? (
										<ConstructorEditor
											key={i}
											DelComponent={del}
											onChange={data => handleBlockChange(i, data)}
											takeValue={block?.content?.content}
										/>
									) : (
										<TextViewer key={i} content={block?.content?.content} />
									)
									break
								case 'code':
									content = isEdit ? (
										<CodeFileInput
											key={i}
											DelComponent={del}
											onFileChange={data => handleBlockChange(i, data)}
											takeValues={block?.content}
										/>
									) : (
										<CustomCodeBlock
											view={true}
											key={i}
											codeInfo={block?.content}
										/>
									)
									break
								case 'image':
									content = isEdit ? (
										<ConstructorPhotoInput
											key={i}
											DelComponent={del}
											onChange={data => handleBlockChange(i, data)}
											takeValues={block?.content}
										/>
									) : (
										<PhotoView photos={block?.content} />
									)
									break
								case 'video':
									console.log('video: ', block)
									content = isEdit ? (
										<ConstructorVideoInput
											key={i}
											DelComponent={del}
											onChange={data => handleBlockChange(i, data)}
											takeValues={block?.content}
										/>
									) : (
										<VideoPlayer url={block?.content} is course={true} />
									)
									break
								case 'files':
									content = isEdit ? (
										<ConstructorFileInput
											key={i}
											DelComponent={del}
											onChange={data => handleBlockChange(i, data)}
											takeValues={block?.content}
										/>
									) : (
										<FileView Files={block?.content} />
									)
									break
								case 'table':
									content = isEdit ? (
										<TableConstructor
											key={i}
											DelComponent={del}
											onChange={data => handleBlockChange(i, data)}
											takeValues={block?.content}
										/>
									) : (
										<TableView
											key={i}
											cols={block?.content?.cols}
											rows={block?.content?.rows}
											values={block?.content?.data}
										/>
									)
									break
								case 'audio':
									console.log('audio: ', block)
									content = isEdit ? (
										<AudioInput
											key={i}
											DelComponent={del}
											onFileChange={data => handleBlockChange(i, data)}
											takeValues={block?.content}
										/>
									) : (
										<CustomAudioPlayer audioUrl={block?.content?.fileUrl} />
									)
									break
								case 'callout':
									content = isEdit ? (
										<CalloutConstructor
											key={i}
											DelComponent={del}
											onChange={data => handleBlockChange(i, data)}
											takeValues={block?.content}
										/>
									) : (
										<CalloutView
											key={i}
											title={block?.content?.title}
											description={block?.content?.description}
											IconName={block?.content?.icon}
										/>
									)
									break
								case 'formula':
									content = isEdit ? (
										<FormulaConstructor
											key={i}
											DelComponent={del}
											onChange={data => handleBlockChange(i, data)}
											takeValues={block?.content}
										/>
									) : (
										<FormulaView key={i} Formula={block?.content?.formula} />
									)
									break
								case 'button':
									content = isEdit ? (
										<ButtonConstructor
											key={i}
											DelComponent={del}
											onChange={data => handleBlockChange(i, data)}
											takeValues={block?.content}
										/>
									) : (
										<ButtonView
											key={i}
											title={block?.content?.buttonTitle}
											to={block?.content?.buttonUrl}
										/>
									)
									break
								default:
									content = null
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
									{content}
								</motion.div>
							)
						})}
						{isEdit ? (
							<motion.div
								key={blocks?.length}
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{
									duration: 0.3,
									delay: blocks?.length * 0.1,
									ease: 'easeOut',
								}}
							>
								<ConstructorMenu onAdd={addBlock} />
							</motion.div>
						) : (
							SectionType === 'practice' && (
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
											Прикрепить файл для проверки (отображение у студента)
										</p>
										<ConstructorFileInput />

										<SubmitButton title={'Отправить на проверку'} />
									</div>
								</motion.div>
							)
						)}
					</>
				)}
			</div>
		</div>
	)
}

const ConstructorMenu = ({ onAdd }) => {
	const buttons = [
		{
			title: 'Текст',
			type: 'text',
			icon: <Text size={32} />,
		},
		{
			title: 'Код',
			type: 'code',
			icon: <Code size={32} />,
		},
		{
			title: 'Фото',
			type: 'image',
			icon: <Image size={32} />,
		},
		{
			title: 'Видео',
			type: 'video',
			icon: <Film size={32} />,
		},
		{
			title: 'Файлы',
			type: 'files',
			icon: <Files size={32} />,
		},
		{
			title: 'Таблица',
			type: 'table',
			icon: <Table size={32} />,
		},
		{
			title: 'Аудио',
			type: 'audio',
			icon: <AudioLines size={32} />,
		},
		{
			title: 'Выноска',
			type: 'callout',
			icon: <Layers2 size={32} />,
		},
		{
			title: 'Формула',
			type: 'formula',
			icon: <SquareFunction size={32} />,
		},
		{
			title: 'Кнопка',
			type: 'button',
			icon: <MousePointerClick size={32} />,
		},
	]

	return (
		<>
			<div className='grid lg:grid-cols-5 grid-cols-3 gap-2 p-3 bg-[var(--white)] rounded-xl shadow-[var(--shadow)] w-fit'>
				{buttons.map((item, index) => (
					<button
						key={index}
						onClick={() => onAdd(item.type)}
						className='flex flex-col aspect-square items-center justify-center gap-2 bg-[var(--light-middle)] rounded-lg h-25 hover:bg-[var(--hero-epta)] hover:text-white cursor-pointer text-[var(--middle)] transition-all duration-100'
					>
						{item.icon}
						<p className='text-base '>{item.title}</p>
					</button>
				))}
			</div>
		</>
	)
}

const Constructor = ({
	content,
	onAddModule,
	onReplaceModule,
	onRemoveModule,
	onAddLesson,
	onReplaceLesson,
	onRemoveLesson,
	courseId,
	deleteModule,
	deleteSection,
	onBlocksChange,
	onSelectedContentChange,
	isLoading,
	onSectionTypeChange,
	isEdit,
}) => {
	const [selectedContent, setSelectedContent] = useState(null)
	const [section, setSection] = useState(null)

	const handleContentSelect = SectionId => {
		setSection(SectionId)
		onSelectedContentChange?.(SectionId?.id)
		setSelectedContent(null)
	}

	useEffect(() => {
		if (!section) {
			return
		}

		const fetchContent = async () => {
			const token = localStorage.getItem('access_token')
			try {
				setSelectedContent(null)
				const res = await fetch(`${API}/sections/${section?.id}/content`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				if (!res.ok) throw new Error('Ошибка при загрузке контента')
				const data = await res.json()

				setSelectedContent(data)
			} catch (err) {
				setSelectedContent(null)
				console.error(err)
			}
		}

		fetchContent()
	}, [section])

	return (
		<>
			<div className='grid min-[1200px]:grid-cols-[1fr_3fr] gap-3 2xl:gap-5 h-full'>
				<div
					className={`${
						selectedContent && 'max-[1200px]:hidden'
					} bg-[var(--white)] shadow-[var(--shadow)] max-[1200px]:w-full rounded-xl pb-5 px-3 pt-5 flex flex-col justify-between`}
				>
					<div className='flex flex-col gap-3'>
						<div className='flex flex-col gap-3 px-2'>
							<div className='flex justify-between w-full'>
								<p className='font-medium text-[20px] text-[var(--black)]'>
									Содержимое
								</p>
							</div>
							{/* <div className='flex gap-[10px]'>
								<SearchInput />
								<Button icon={ListRestart} style='white' size={40} />
								<Button
									icon={CloudUpload}
									style='white'
									size={40}
									IconColor={'var(--green-status-text)'}
								/>
							</div> */}
						</div>

						<div className='flex flex-col gap-3 rounded-xl p-2'>
							<ModuleBlock
								ModuleInfo={content?.modules}
								onContentSelect={handleContentSelect}
								selectedContent={selectedContent}
								onAddLesson={onAddLesson}
								onReplaceLesson={onReplaceLesson}
								onRemoveLesson={onRemoveLesson}
								deleteModule={deleteModule}
								deleteSection={deleteSection}
							/>
							<div className='h-fit mt-2'>
								<motion.div
									key={content?.modules.length + 1}
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{
										duration: 0.3,
										delay: content?.modules.length * 0.1,
										ease: 'easeOut',
									}}
								>
									<CreateModuleButton
										onAddModule={onAddModule}
										onReplaceModule={onReplaceModule}
										onRemoveModule={onRemoveModule}
										courseId={courseId}
									/>
								</motion.div>
							</div>
						</div>
					</div>
				</div>
				<div
					className={`${
						!selectedContent && 'max-[1200px]:hidden'
					} bg-[var(--white)] shadow-[var(--shadow)] rounded-xl overflow-y-auto hide-scrollbar`}
				>
					<div className='flex flex-col gap-3 rounded-xl p-5'>
						<ContentView
							content={selectedContent}
							SectionType={section?.type}
							SectionName={section?.title}
							onBlocksChange={onBlocksChange}
							isLoading={isLoading}
							sectionId={section?.id}
							onSectionTypeChange={onSectionTypeChange}
							isEdit={isEdit}
							clearSelection={() => {
								setSelectedContent(null)
							}}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default Constructor
