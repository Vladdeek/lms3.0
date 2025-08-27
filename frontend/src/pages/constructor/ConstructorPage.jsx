import {
	BrickWall,
	CalendarClock,
	Gem,
	Settings,
	UsersRound,
} from 'lucide-react'
import { AltRadioButton, Button } from '../../components/Buttons'
import { useState } from 'react'
import Constructor from './Constructor'
import AccessManagement from './AccessManagement'

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
