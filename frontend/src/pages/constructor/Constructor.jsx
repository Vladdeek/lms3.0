import {
	ArrowDownUp,
	ArrowLeftFromLine,
	ArrowRightFromLine,
	AudioLines,
	BookMarked,
	Check,
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
	FlaskConical,
	Image,
	LaptopMinimalCheck,
	Layers2,
	ListChecks,
	ListOrdered,
	ListRestart,
	MousePointerClick,
	NotebookPen,
	Package,
	Pen,
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
import api, { API } from '../../API'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Loader, { AltLoader, BlockLoader } from '../../components/Loader'
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
import { getCookie, token } from '../../TOKEN'
import axios from 'axios'
import { setGlobalError } from '../../components/Errors'
import SortVariantView from '../../components/TestView/SortVariantsView'
import MoreVariantView from '../../components/TestView/MoreVariantsView'
import OpenQuestionView from '../../components/TestView/OpenQuestionView'
import OneVariantView from '../../components/TestView/OneVariantView'
import VariantModerationView from '../../components/TestModerationView/VariantsModertionView'
import SortVariantModerationView from '../../components/TestModerationView/SortVariantsModertionView'
import OpenQuestionModerationView from '../../components/TestModerationView/OpenQuestionModertionView'
import { isEditor } from 'slate'
import { se } from 'date-fns/locale'

const CreateModuleButton = ({ onAddModule, courseId }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [title, setTitle] = useState('')
	const [isNameValid, setIsNameValid] = useState(false)

	const handleAddModule = async () => {
		try {
			const { data } = await api.post(
				`${API}/modules/${courseId}`,
				{ name: title },
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)
			data && onAddModule(data)
		} catch (error) {}
	}

	const handleSave = () => {
		if (!isNameValid) return
		handleAddModule()
		setTitle('')
		setIsOpen(false)
		setIsNameValid(false)
	}

	return (
		<div className='w-full'>
			<Button
				icon={Package}
				title={'Добавить модуль'}
				textSize={16}
				className='w-full'
				onClick={() => setIsOpen(prev => !prev)}
			/>
			{isOpen && (
				<div className=' bg-[var(--white)] rounded-xl shadow-[var(--shadow)] p-4 mt-3 flex flex-col gap-3 z-10 w-full'>
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

const CreateLessonButton = ({ moduleId, onAddLesson }) => {
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
		// {
		// 	label: 'Лаба',
		// 	apiType: 'lab',
		// 	icon: <FlaskConical size={24} />,
		// 	description:
		// 		'Задания для самостоятельного выполнения. Включает текстовые инструкции, примеры и возможность загрузки решений.',
		// },
		{
			label: 'Тест',
			apiType: 'test',
			icon: <LaptopMinimalCheck size={24} />,
			description:
				'Проверка знаний с помощью различных типов вопросов: выбор, ввод ответа, соответствие и др.',
		},
	]

	const handleAddLesson = async lesson => {
		try {
			const { data } = await api.post(
				`${API}/sections/modules/${moduleId}`,
				{
					title: lesson.title,
					type: lesson.type,
					content: {},
				},
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)
			data && onAddLesson(moduleId, data)
		} catch (error) {}
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
			<div className='grid grid-cols-3 gap-2'>
				{lessonTypes.map((item, index) => (
					<button
						key={index}
						type='button'
						onClick={() => setSelected(index)}
						className={`
                                flex flex-col items-center justify-center gap-2 py-2 rounded-lg transition-all
                                ${
																	selected === index
																		? 'bg-[var(--hero-epta)] text-white'
																		: 'bg-[var(--bg)] text-[var(--middle)]'
																}
                                hover:scale-105
                                min-w-[100px] cursor-pointer
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
		<div className=''>
			<InputDefault
				title={'Название занятия'}
				placeholder={'Введите название'}
				required={true}
				InputStatus={false}
				value={lessonTitle}
				onChange={e => setLessonTitle(e.target.value)}
				onStatusChange={setIsNameValid}
			/>
			<div className='flex min-[1200px]:flex-wrap-reverse justify-between min-[1700px]:flex-nowrap gap-2 mt-2'>
				<Button
					width={'100%'}
					title='назад'
					style='outline'
					onClick={() => setStep(0)}
				/>
				<Button
					title='Добавить занятие'
					style='black'
					onClick={Save}
					width={'100%'}
					disabled={!isNameValid}
				/>
			</div>
		</div>,
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
	children,
	onMoveModule,
	indexOrder,
	length,
}) => {
	const [deleteModalActive, setDeleteModalActive] = useState(false)
	const [editModeActive, setEditModeActive] = useState(false)
	const [changedValue, setChangedValue] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (changedValue === '') {
			setChangedValue(title)
		}
	}, [title])

	const moveModule = async direction => {
		try {
			const { data } = await api.put(
				`${API}/modules/${moduleId}/move`,
				{ direction: direction },
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)

			data ? onMoveModule?.() : null
		} catch (error) {}
	}

	const options = [
		{
			title: 'Переместить вверх',
			icon: <ChevronsUp size={20} />,
			action: () => indexOrder > 0 && moveModule('up'),
			disabled: indexOrder <= 0,
		},

		{
			title: 'Переместить вниз',
			icon: <ChevronsDown size={20} />,
			action: () => indexOrder < length - 1 && moveModule('down'),
			disabled: indexOrder >= length - 1,
		},
		{
			title: 'Редактировать',
			icon: <Pen size={20} />,
			action: () => setEditModeActive(true),
		},
		{
			title: 'Удалить',
			icon: <Trash size={20} />,
			action: () => setDeleteModalActive(true),
		},
	]

	useEffect(() => {
		if (deleteModalActive) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}

		return () => {
			document.body.style.overflow = ''
		}
	}, [deleteModalActive])

	const deleteModule = async id => {
		setIsLoading(true)
		try {
			await api.delete(`${API}/modules/${id}`, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			})

			onRemoveModule(id)
			setDeleteModalActive(false)
			setIsLoading(false)
		} catch (error) {}
	}
	const handleEditName = async id => {
		try {
			await api.put(
				`${API}/modules/${id}`,
				{ name: changedValue },
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)

			setEditModeActive(false)
			setIsLoading(false)
			window.location.reload()
		} catch (error) {}
	}
	return (
		<>
			{deleteModalActive && (
				<div className='fixed inset-0 z-[1000] flex items-center justify-center backdrop-blur-xs'>
					<div className='p-4 h-30 rounded-xl flex flex-col gap-5 items-center justify-center bg-[var(--white)] shadow-[var(--shadow)]'>
						{isLoading ? (
							<div className='w-91 flex justify-center items-center'>
								<AltLoader />
							</div>
						) : (
							<>
								<p className='text-[var(--black)]'>
									Вы уверены что хотите удалить это занятие?
								</p>
								<div className='flex gap-3'>
									<button
										onClick={() => deleteModule(moduleId)}
										className='bg-[var(--black)] text-[var(--white)] rounded-xl px-4 py-2 hover:text-white hover:bg-red-500 transition-all cursor-pointer'
									>
										Удалить
									</button>
									<button
										onClick={() => {
											setDeleteModalActive(false)
										}}
										className='bg-[var(--black)] text-[var(--white)] rounded-xl px-4 py-2 hover:text-[var(--black)] hover:bg-[var(--white)] border-1 border-transparent hover:border-[var(--middle)] shadow-[var(--shadow)] transition-all cursor-pointer'
									>
										Отмена
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
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

						<EllipsisButton
							options={options}
							onOptionClick={opt => opt.action(sectionId)}
							active={true}
						/>
					</div>

					{/* NAME */}
					<div className='px-3'>
						{editModeActive ? (
							<form
								action={() => handleEditName(moduleId)}
								className='
            flex bg-[var(--white)]
            pr-1 pl-2 py-1 rounded-md
            ring-1 ring-[var(--hero-epta)]
            focus-within:ring-3 focus-within:text-[var(--black)]
            transition-all
            w-1/3 min-[2100px]:w-1/2 min-[2275px]:w-full
          '
							>
								<input
									type='text'
									value={changedValue}
									onChange={e => setChangedValue(e.target.value)}
									className='w-full outline-none'
								/>

								<button
									type='submit'
									className='
              text-[var(--black)]
              hover:text-[var(--green-status-text)]
              hover:bg-[var(--green-status-bg)]
              px-1 rounded-sm cursor-pointer transition-all
            '
								>
									<Check size={20} />
								</button>
							</form>
						) : (
							<p
								title={changedValue}
								className='font-normal text-base truncate'
							>
								{changedValue}
							</p>
						)}
					</div>
				</div>

				{/* CHILDREN */}
				{isExpanded && (
					<div className='flex flex-col gap-2 p-2 w-full'>{children}</div>
				)}
				<button
					onClick={() => onToggle()}
					className='
          w-auto h-full p-1.5 aspect-square
          hover:bg-[var(--light-middle)]
          rounded-lg cursor-pointer
          text-[var(--black)] transition-all
        '
				>
					<ChevronUp
						className={`
  ${!isExpanded ? 'rotate-x-180' : ''}
  transition-all duration-500
`}
						size={18}
					/>
				</button>
			</div>
		</>
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
	selectedSectionId,
	moduleId,
	indexOrder,
	length,
	onMoveSection,
}) => {
	const [deleteModalActive, setDeleteModalActive] = useState(false)
	const [editModeActive, setEditModeActive] = useState(false)
	const [changedValue, setChangedValue] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (changedValue === '') {
			setChangedValue(title)
		}
	}, [title])

	useEffect(() => {
		if (deleteModalActive) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}

		return () => {
			document.body.style.overflow = ''
		}
	}, [deleteModalActive])

	const isSelected = selectedSectionId === sectionId
	const activeNoBg = isSelected && !bg

	const wrapperClass = `
  flex justify-between items-center
  rounded-lg relative transition-all
  p-1 cursor-default w-full border-[var(--hero-epta)]
  ${
		activeNoBg
			? 'border-l-3  text-[var(--black)] shadow-[var(--shadow)]'
			: 'hover:bg-[var(--light-middle)] bg-[var(--white)] shadow-[var(--shadow)] cursor-pointer'
	}
`

	const columnTextColor = activeNoBg
		? 'text-[var(--middle)]'
		: 'text-[var(--middle)]'
	const headerTextColor = activeNoBg
		? 'text-[var(--black)]'
		: 'text-[var(--black)]'

	const moveSection = async direction => {
		try {
			const { data } = await api.put(
				`${API}/sections/${sectionId}/move`,
				{ module_id: moduleId, direction: direction },
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)

			data ? onMoveSection?.() : null
		} catch (error) {}
	}

	const options = [
		{
			title: 'Переместить вверх',
			icon: <ChevronsUp size={20} />,
			action: () => indexOrder > 0 && moveSection('up'),
			disabled: indexOrder <= 0,
		},

		{
			title: 'Переместить вниз',
			icon: <ChevronsDown size={20} />,
			action: () => indexOrder < length - 1 && moveSection('down'),
			disabled: indexOrder >= length - 1,
		},

		{
			title: 'Редактировать',
			icon: <Pen size={20} />,
			action: () => setEditModeActive(true),
			disabled: false,
		},
		{
			title: 'Удалить',
			icon: <Trash size={20} />,
			action: () => setDeleteModalActive(true),
			disabled: false,
		},
	]

	const deleteSection = async id => {
		setIsLoading(true)
		try {
			await api.delete(`${API}/sections/${id}`, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			})

			onRemoveLesson(id)
			setDeleteModalActive(false)
			setIsLoading(false)
			setGlobalError(null)
		} catch (error) {}
	}

	const handleEditName = async id => {
		try {
			await api.put(
				`${API}/sections/${id}`,
				{ title: changedValue },
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)

			setEditModeActive(false)
			setIsLoading(false)
			window.location.reload()
		} catch (error) {}
	}

	return (
		<>
			{deleteModalActive && (
				<div className='fixed inset-0 z-[1000] flex items-center justify-center backdrop-blur-xs'>
					<div className='p-4 h-30 rounded-xl flex flex-col gap-5 items-center justify-center bg-[var(--white)] shadow-[var(--shadow)]'>
						{isLoading ? (
							<div className='w-91 flex justify-center items-center'>
								<AltLoader />
							</div>
						) : (
							<>
								<p className='text-[var(--black)]'>
									Вы уверены что хотите удалить это занятие?
								</p>
								<div className='flex gap-3'>
									<button
										onClick={() => deleteSection(sectionId)}
										className='bg-[var(--black)] text-[var(--white)] rounded-xl px-4 py-2 hover:text-white hover:bg-red-500 transition-all cursor-pointer'
									>
										Удалить
									</button>
									<button
										onClick={() => {
											setDeleteModalActive(false)
										}}
										className='bg-[var(--black)] text-[var(--white)] rounded-xl px-4 py-2 hover:text-[var(--black)] hover:bg-[var(--white)] border-1 border-transparent hover:border-[var(--middle)] shadow-[var(--shadow)] transition-all cursor-pointer'
									>
										Отмена
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			)}
			<div onClick={isSelected ? undefined : onClick} className={wrapperClass}>
				<div
					className={`flex flex-col gap-1 w-full rounded-xl ${columnTextColor}`}
				>
					{/* HEADER */}
					<div className='flex justify-between pt-0.5 w-full pr-0.5'>
						<div
							className={`
          flex items-center gap-2 w-full
          px-2 rounded-lg
          ${headerTextColor}
          ${bg ? 'bg-[var(--white)] shadow-[var(--shadow)]' : ''}
        `}
						>
							{type === 'lecture' && <BookMarked size={20} />}
							{type === 'practice' && <NotebookPen size={20} />}
							{type === 'test' && <LaptopMinimalCheck size={20} />}

							<p className='font-medium pt-1 text-base whitespace-nowrap truncate min-w-0'>
								{type === 'lecture' && 'Лекция'}
								{type === 'practice' && 'Практика'}
								{type === 'test' && 'Тест'}
							</p>
						</div>

						{!bg && (
							<EllipsisButton
								options={options}
								onOptionClick={opt => opt.action(sectionId)}
								active={isSelected}
							/>
						)}
					</div>

					{/* NAME */}
					<div className='w-full'>
						{editModeActive ? (
							<form
								action={() => handleEditName(sectionId)}
								className='w-full flex bg-[var(--white)] text-[var(--black)] pr-1 pl-2 py-1 rounded-md'
							>
								<input
									type='text'
									value={changedValue}
									onChange={e => setChangedValue(e.target.value)}
									className='w-full outline-none'
								/>

								<button
									type='submit'
									className='
            text-[var(--black)]
            hover:text-[var(--green-status-text)]
            hover:bg-[var(--green-status-bg)]
            px-1 rounded-sm cursor-pointer transition-all
          '
								>
									<Check size={20} />
								</button>
							</form>
						) : (
							<p
								title={changedValue}
								className={`font-normal w-full whitespace-normal px-2 ${bg ? 'text-base' : 'text-sm'}`}
							>
								{changedValue}
							</p>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

const ModuleBlock = ({
	ModuleInfo,
	onContentSelect,
	selectedContent,
	onAddLesson,
	deleteModule,
	deleteSection,
	sectionId,
	onMove,
}) => {
	const [expandedModules, setExpandedModules] = useState({})

	const toggleModule = index => {
		setExpandedModules(prev => ({
			...prev,
			[index]: !prev[index],
		}))
	}

	return (
		<div className='h-fit hide-scrollbar hide-scrollbar p-2'>
			<div className=' flex flex-col gap-3 rounded-xl'>
				{ModuleInfo &&
					ModuleInfo.slice()
						.sort((a, b) => a.index_order - b.index_order)
						.map((module, index) => {
							const isExpanded = expandedModules[index] === true

							return (
								<motion.div
									key={module.id}
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{
										duration: 0.3,
										delay: index * 0.1,
										ease: 'easeOut',
									}}
								>
									<div className='flex flex-col gap-3'>
										<ModuleTitle
											title={module.name}
											moduleId={module.id}
											index={index + 1}
											isExpanded={isExpanded}
											onToggle={() => toggleModule(index)}
											onRemoveModule={deleteModule}
											onMoveModule={onMove}
											indexOrder={module.index_order}
											length={ModuleInfo.length}
										>
											{module.module_contents
												.slice()
												.sort((a, b) => a.index_order - b.index_order)
												.map((section, sectionIndex) => {
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
																type={section.type.toLowerCase()}
																sectionId={section.id}
																onClick={() => onContentSelect(section)}
																isSelected={selectedContent?.id === section.id}
																onRemoveLesson={deleteSection}
																selectedSectionId={sectionId}
																moduleId={module.id}
																indexOrder={section.index_order}
																length={module.module_contents.length}
																onMoveSection={onMove}
															/>
														</motion.div>
													)
												})}
											<motion.div
												key={module.module_contents.length + 1}
												initial={{ scale: 0.8, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												transition={{
													duration: 0.3,
													delay: module.module_contents.length * 0.1,
													ease: 'easeOut',
												}}
											>
												<CreateLessonButton
													moduleId={module.id}
													onAddLesson={onAddLesson}
												/>
											</motion.div>
										</ModuleTitle>
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
					className='absolute top-1 right-1 text-[var(--middle)] hover:text-red-500 transition-all cursor-pointer'
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
											? 'bg-[var(--hero-epta)] text-white'
											: 'text-[var(--black)] bg-[var(--white)] hover:bg-[var(--hero-epta)] hover:text-white'
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
	isEdit,
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
					className={`${isEdit === false && 'hidden'} w-10 h-10 bg-[var(--white)] shadow-[var(--shadow)] text-[var(--black)] rounded-md hover:bg-[var(--hero-epta)] hover:text-white flex justify-center items-center p-2 transition-all cursor-pointer active:scale-90`}
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
	const [removedBlocks, setRemovedBlocks] = useState([])

	console.log(questions)

	const giveId = (index, id) => {
		setQuestions(prev => {
			const updated = [...prev]

			updated[index] = { ...updated[index], id }

			return updated
		})
	}

	useEffect(() => {
		if (!content) return

		const sectionType = content.type
		onSectionTypeChange?.(sectionType)

		if (sectionType === 'test') {
			setQuestions(content.content || [])
			setBlocks([])
		} else {
			setBlocks(content.content || [])
			setQuestions([])
		}

		setActiveIndex(0)
	}, [content])

	const addBlock = type => setBlocks(prev => [...prev, { type, content: null }])

	const blockHadContent = block => {
		if (!block) return false

		switch (block.type) {
			case 'video':
				return Array.isArray(block.content) && block.content.length > 0

			case 'image':
				return Array.isArray(block.content) && block.content.length > 0

			case 'files':
				return Array.isArray(block.content) && block.content.length > 0

			case 'audio':
				return block.content !== null

			default:
				return false
		}
	}

	const getBlockFilePaths = block => {
		if (!block) return []

		switch (block.type) {
			case 'video':
				return block.content?.map(i => i.fileUrl).filter(Boolean) || []

			case 'image':
				return block.content?.map(i => i.photoUrl).filter(Boolean) || []

			case 'files':
				return block.content?.map(i => i.file_path).filter(Boolean) || []

			case 'audio':
				return block.content?.fileUrl ? [block.content.fileUrl] : []

			default:
				return []
		}
	}

	const removeBlock = index => {
		setBlocks(prev => {
			const removedBlock = prev[index]
			const updated = prev.filter((_, i) => i !== index)

			const hadContent = blockHadContent(removedBlock)

			// если блок был с файлами — удаляем их с сервера
			if (hadContent) {
				const paths = getBlockFilePaths(removedBlock)
				paths.forEach(path => removeFile(path))
			}

			// пробрасываем наверх
			// forceSave = true если удалили заполненный медиа блок
			onBlocksChange?.(updated, { forceSave: hadContent })

			return updated
		})
	}

	const removeFile = path => {
		try {
			const response = api.delete(`${API}/files`, {
				data: {
					file_path: path.replace(
						/^https:\/\/s3\.ru1\.storage\.beget\.cloud\/02eb54dfa411-vm-lms\//,
						'',
					),
				},
				withCredentials: true,
			})
		} catch (error) {}
	}

	const handleBlockChange = (index, data) => {
		setBlocks(prev => {
			const updated = prev.map((b, i) =>
				i === index ? { ...b, content: data } : b,
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
					<div className='min-[1200px]:hidden'>
						<Button
							icon={ArrowLeftFromLine}
							style='white'
							size={40}
							onClick={clearSelection}
						/>
					</div>

					<div className='flex gap-2 items-center w-full'>
						<div
							className={`
          flex items-center gap-2 w-fit
          px-2 py-1.5 rounded-lg
          text-[var(--black)]
         bg-[var(--white)] shadow-[var(--shadow)]
        `}
						>
							{SectionType === 'lecture' && <BookMarked size={20} />}
							{SectionType === 'practice' && <NotebookPen size={20} />}
							{SectionType === 'test' && <LaptopMinimalCheck size={20} />}

							<p className='font-medium pt-1 text-base whitespace-nowrap truncate min-w-0'>
								{SectionType === 'lecture' && 'Лекция'}
								{SectionType === 'practice' && 'Практика'}
								{SectionType === 'test' && 'Тест'}
							</p>
						</div>
						<p className='text-[var(--middle)] text-xl'>/</p>
						<p className='text-[var(--black)] text-lg w-full'>{SectionName}</p>
					</div>
				</div>

				{SectionType === 'test' ? (
					<>
						<ConstructorLevels
							questions={questions}
							setQuestions={setQuestions}
							activeIndex={activeIndex}
							setActiveIndex={setActiveIndex}
							isEdit={isEdit}
						/>
						{isLoading ? (
							<Loader />
						) : (
							questions?.length > 0 && (
								<div
									className={`${isEdit === false && 'flex w-full justify-center'}`}
								>
									{questions[activeIndex]?.type === 'single' &&
										(isEdit === true ? (
											<OneVariant
												sectionId={sectionId}
												testId={questions[activeIndex]?.id}
												onChange={data => giveId(activeIndex, data)}
												deletedQuestion={() => {
													setActiveIndex(prev => prev > 0 && prev - 1)
													setQuestions(prev =>
														prev.filter((_, i) => i !== activeIndex),
													)
												}}
											/>
										) : (
											<VariantModerationView
												testId={questions[activeIndex]?.id}
											/>
										))}
									{questions[activeIndex]?.type === 'multiple' &&
										(isEdit === true ? (
											<MoreVariant
												sectionId={sectionId}
												testId={questions[activeIndex]?.id}
												onChange={data => giveId(activeIndex, data)}
												deletedQuestion={() => {
													setActiveIndex(prev => prev > 0 && prev - 1)
													setQuestions(prev =>
														prev.filter((_, i) => i !== activeIndex),
													)
												}}
											/>
										) : (
											<VariantModerationView
												testId={questions[activeIndex]?.id}
											/>
										))}
									{questions[activeIndex]?.type === 'matching' &&
										(isEdit === true ? (
											<SortVariants
												sectionId={sectionId}
												testId={questions[activeIndex]?.id}
												onChange={data => giveId(activeIndex, data)}
												deletedQuestion={() => {
													setActiveIndex(prev => prev > 0 && prev - 1)
													setQuestions(prev =>
														prev.filter((_, i) => i !== activeIndex),
													)
												}}
											/>
										) : (
											<SortVariantModerationView
												testId={questions[activeIndex]?.id}
											/>
										))}
									{questions[activeIndex]?.type === 'open' &&
										(isEdit === true ? (
											<OpenQuestion
												sectionId={sectionId}
												testId={questions[activeIndex]?.id}
												onChange={data => giveId(activeIndex, data)}
												deletedQuestion={() => {
													setActiveIndex(prev => prev > 0 && prev - 1)
													setQuestions(prev =>
														prev.filter((_, i) => i !== activeIndex),
													)
												}}
											/>
										) : (
											<OpenQuestionModerationView
												testId={questions[activeIndex]?.id}
											/>
										))}
								</div>
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
						{isEdit && (
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
	onMove,
}) => {
	const [selectedContent, setSelectedContent] = useState(null)
	const [section, setSection] = useState(null)

	const [showMassage, setShowMassage] = useState(null)

	const showMassageFunc = status => {
		setShowMassage(status)
		const timer = setTimeout(() => {
			setShowMassage(null)
		}, 5000)

		return () => clearTimeout(timer)
	}

	const handleContentSelect = SectionId => {
		if (isEdit === false) {
			setSection(SectionId)
			onSelectedContentChange?.(SectionId?.id)
			setSelectedContent(null)
		} else {
			showMassageFunc(
				selectedContent?.type === 'test'
					? 'Сначала завершите редактирование'
					: 'Сначала сохраните изменения',
			)
		}
	}

	useEffect(() => {
		if (!section) return

		const fetchContent = async () => {
			try {
				setSelectedContent(null)

				const { data } = await api.get(
					`${API}/sections/${section?.id}/content`,
					{
						withCredentials: true,
						headers: {
							'Content-Type': 'application/json',
						},
					},
				)

				setSelectedContent(data)
			} catch (error) {
				setSelectedContent(null)
				console.error('Ошибка при загрузке контента:', error)
			}
		}
		if (isEdit === false) {
			fetchContent()
		}
	}, [section])

	return (
		<div className='relative'>
			<p
				className={`absolute transition-all bg-[var(--red-status-bg)] text-[var(--red-status-text)]  px-6 py-2 rounded-lg shadow-[var(--shadow)] left-1/2 -translate-x-1/2 text-2xl ${
					showMassage
						? '2xl:-top-27 -top-47  opacity-100'
						: '2xl:-top-47  -top-65  opacity-50'
				} `}
			>
				{showMassage}
			</p>
			<div className='grid min-[1200px]:grid-cols-[1fr_3fr] gap-3 2xl:gap-5 md:min-h-[calc(80vh-100px)] '>
				<div
					className={`${
						selectedContent && 'max-[1200px]:hidden'
					} bg-[var(--white)] shadow-[var(--shadow)] max-[1200px]:w-full rounded-xl pb-5 px-3 pt-5 flex flex-col justify-between max-h-[72vh] overflow-y-scroll`}
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

						<div className='flex flex-col gap-3 rounded-xl'>
							<ModuleBlock
								ModuleInfo={content?.modules}
								onContentSelect={handleContentSelect}
								selectedContent={selectedContent}
								onAddLesson={onAddLesson}
								onReplaceLesson={onReplaceLesson}
								onRemoveLesson={onRemoveLesson}
								deleteModule={deleteModule}
								deleteSection={deleteSection}
								sectionId={section?.id}
								onMove={onMove}
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
							SectionType={section?.type.toLowerCase()}
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
		</div>
	)
}

export default Constructor
