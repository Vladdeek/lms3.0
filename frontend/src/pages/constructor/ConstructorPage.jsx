import {
	BrickWall,
	CalendarClock,
	Gem,
	Settings,
	UsersRound,
	QrCode,
} from 'lucide-react'
import { AltRadioButton, Button } from '../../components/Buttons'
import { useState } from 'react'
import Constructor from './Constructor'
import AccessManagement from './AccessManagement'
import {
	FileInput,
	InputDefault,
	TextArea,
	Checkbox,
} from '../../components/Inputs'
import QRCode from '../../components/QrCode'

const SettingsButton = () => {
	const [isOpen, setIsOpen] = useState(true)
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
						<Button title={'Удалить курс'} style='outline' width={'100%'} />
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
						{selected === 1 ? (
							<QrCodeButton
								url={'https://www.npmjs.com/package/qr-code-styling'}
							/>
						) : (
							<DateButton />
						)}

						<SettingsButton />
						<Button title={'Сохранить'} style='outline' />
						<Button title={'Опубликовать курс'} style='black' />
					</div>
				</div>
				{selected === 0 ? (
					<Constructor />
				) : (
					selected === 1 && <AccessManagement />
				)}
			</div>
		</>
	)
}
export default ConstructorPage
