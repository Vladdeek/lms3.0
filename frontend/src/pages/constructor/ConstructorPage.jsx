import {
	BrickWall,
	CalendarClock,
	Gem,
	Settings,
	UsersRound,
	QrCode,
} from 'lucide-react'
import { AltRadioButton, Button } from '../../components/Buttons'
import { useEffect, useState } from 'react'
import Constructor from './Constructor'
import AccessManagement from './AccessManagement'
import {
	FileInput,
	InputDefault,
	TextArea,
	Checkbox,
} from '../../components/Inputs'
import QRCode from '../../components/QrCode'
import { useParams } from 'react-router-dom'
import { API } from '../../API'
import { useNavigate } from 'react-router-dom'

const SettingsButton = ({ courseId }) => {
	const [isOpen, setIsOpen] = useState(true)
	const navigate = useNavigate()

	async function deleteCourse() {
		try {
			const response = await fetch(`${API}/courses/delete/${courseId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (!response.ok) {
				throw new Error(`Ошибка HTTP: ${response.status}`)
			}

			if (response.status === 204) {
				return { success: true, message: 'Секция успешно удален' }
			}

			const data = await response.json()
			navigate(-1)
			return { success: true, data }
		} catch (error) {
			console.error('Ошибка при удалении модуля:', error)
			return {
				success: false,
				error: error.message,
				moduleId: moduleId,
			}
		}
	}

	return (
		<div className='relative'>
			<button
				onClick={() => setIsOpen(prev => !prev)}
				className='rounded-lg h-full flex gap-4 aspect-square justify-center items-center hover:scale-102 transition-all cursor-pointer text-[var(--black)] p-[12px] bg-[var(--white)] shadow-[var(--shadow)]'
			>
				<Settings size={24} />
			</button>
			{!isOpen && (
				<div className='absolute w-[466px] bg-[var(--white)] rounded-xl shadow-[var(--shadow)] flex flex-col gap-3 p-4 top-14 left-0'>
					<p className='font-medium text-xl text-center'>Настройки курса</p>
					<InputDefault
						placeholder={'Введите название'}
						title={'Название курса'}
					/>
					<TextArea placeholder={'Введите описание'} title={'Описание курса'} />
					<FileInput title={'Загрузить превью'} />
					<div className='flex gap-3 w-full'>
						<Button
							title={'Удалить курс'}
							style='outline'
							width={'100%'}
							onClick={deleteCourse}
						/>
						<Button title={'Сохранить'} style='black' width={'100%'} />
					</div>
				</div>
			)}
		</div>
	)
}

const QrCodeButton = ({ url }) => {
	const [isOpen, setIsOpen] = useState(true)
	return (
		<div className='relative'>
			<button
				onClick={() => setIsOpen(prev => !prev)}
				className='rounded-lg h-full flex gap-4 aspect-square justify-center items-center hover:scale-102 transition-all cursor-pointer text-[var(--black)] p-[12px] bg-[var(--white)] shadow-[var(--shadow)]'
			>
				<QrCode size={24} />
			</button>
			{!isOpen && (
				<div className='absolute bg-[var(--white)] rounded-xl shadow-[var(--shadow)] flex flex-col gap-3 p-4 top-14 right-0'>
					<div className='w-50 h-50 flex justify-center items-center shadow-[var(--shadow)] rounded-lg overflow-hidden'>
						{url ? <QRCode size={200} url={url} /> : <QrCode size={32} />}
					</div>
					<p className='text-[var(--middle)] text-sm text-center'>Cсылка</p>
					<input
						className='bg-[var(--bg)] rounded-lg px-2 py-1 outline-none w-full text-[var(--middle)]'
						type='url'
						value={url}
					/>
					<Button title={'Скопировать'} style='black' />
				</div>
			)}
		</div>
	)
}

const DateButton = () => {
	const [isOpen, setIsOpen] = useState(true)
	const Inputs = [
		{ label: 'Дата создания курса', input: '27.09.2005' },
		{ label: 'Дата активации курса', input: '27.09.2005' },
		{ label: 'Дата окончания курса', input: '27.09.2005' },
	]
	const [checked, setChecked] = useState([false, false, false])
	const handleCheckboxChange = idx => {
		const newChecked = [...checked]
		newChecked[idx] = !newChecked[idx]
		setChecked(newChecked)
	}

	return (
		<div className='relative'>
			<button
				onClick={() => setIsOpen(prev => !prev)}
				className='rounded-lg h-full flex gap-4 aspect-square justify-center items-center hover:scale-102 transition-all cursor-pointer text-[var(--black)] p-[12px] bg-[var(--white)] shadow-[var(--shadow)]'
			>
				<CalendarClock size={24} />
			</button>
			{!isOpen && (
				<div className='absolute bg-[var(--white)] rounded-xl shadow-[var(--shadow)] flex flex-col gap-4 p-4 top-14 right-0 min-w-[320px]'>
					{Inputs.map((item, idx) => (
						<div key={idx} className='flex flex-col gap-1 mb-2'>
							<Checkbox
								checked={checked[idx]}
								onChange={() => handleCheckboxChange(idx)}
								label={<span className='cursor-pointer'>{item.label}</span>}
							/>

							<InputDefault type='date' value={item.input} />
						</div>
					))}
				</div>
			)}
		</div>
	)
}

const ConstructorPage = () => {
	const options = [
		{ value: 0, title: 'Конструктор', icon: BrickWall },
		{ value: 1, title: 'Управление доступом', icon: UsersRound },
	]

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

	// Модули
	const addModule = newModule =>
		setCourseContent(prev => ({
			...prev,
			modules: [...(prev?.modules || []), newModule],
		}))

	const replaceModule = (tempId, realModule) =>
		setCourseContent(prev => ({
			...prev,
			modules: prev.modules.map(m => (m.id === tempId ? realModule : m)),
		}))

	const removeModule = tempId =>
		setCourseContent(prev => ({
			...prev,
			modules: prev.modules.filter(m => m.id !== tempId),
		}))

	// Уроки
	const addLesson = (moduleId, newLesson) =>
		setCourseContent(prev => ({
			...prev,
			modules: prev.modules.map(m =>
				m.id === moduleId
					? { ...m, module_sections: [...(m.module_sections || []), newLesson] }
					: m
			),
		}))

	const replaceLesson = (moduleId, tempId, realLesson) =>
		setCourseContent(prev => ({
			...prev,
			modules: prev.modules.map(m =>
				m.id === moduleId
					? {
							...m,
							module_sections: m.module_sections.map(s =>
								s.id === tempId ? realLesson : s
							),
					  }
					: m
			),
		}))

	const removeLesson = (moduleId, tempId) =>
		setCourseContent(prev => ({
			...prev,
			modules: prev.modules.map(m =>
				m.id === moduleId
					? {
							...m,
							module_sections: m.module_sections.filter(s => s.id !== tempId),
					  }
					: m
			),
		}))

	// удаление с фронта
	const onRemoveModule = moduleId => {
		setCourseContent(prev => ({
			...prev,
			modules: prev.modules.filter(m => m.id !== moduleId),
		}))
	}

	const onRemoveLesson = sectionId => {
		setCourseContent(prev => ({
			...prev,
			modules: prev.modules.map(m => ({
				...m,
				module_sections: m.module_sections.filter(s => s.id !== sectionId),
			})),
		}))
	}
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
						<p className='font-medium text-2xl text-[var(--black)]'>
							{courseContent?.name}
						</p>
					</div>
					<div className='flex gap-5 items-center'>
						{selected === 1 ? (
							<QrCodeButton
								url={'https://www.npmjs.com/package/qr-code-styling'}
							/>
						) : (
							<DateButton />
						)}

						<SettingsButton courseId={courseId} />
						<Button title={'Сохранить'} style='outline' />
						<Button title={'Опубликовать курс'} style='black' />
					</div>
				</div>
				{selected === 0 ? (
					<Constructor
						content={courseContent}
						onAddModule={addModule}
						onReplaceModule={replaceModule}
						onRemoveModule={removeModule}
						onAddLesson={addLesson}
						onReplaceLesson={replaceLesson}
						onRemoveLesson={removeLesson}
						courseId={courseId}
						deleteModule={onRemoveModule}
						deleteSection={onRemoveLesson}
					/>
				) : (
					selected === 1 && <AccessManagement />
				)}
			</div>
		</>
	)
}
export default ConstructorPage
