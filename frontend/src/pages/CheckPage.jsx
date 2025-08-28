import { act, useState } from 'react'
import { OptionInput } from '../components/Inputs'
import { groups } from '../data/groups'
import { students } from '../data/students'
import { ArrowBigDownDash, CalendarDays } from 'lucide-react'

const StudentCard = ({ img_path, FullName, score, onClick, active }) => {
	const [Active, setActive] = useState(active)
	return (
		<div
			onClick={onClick}
			className={`bg-[var(--white)] shadow-[var(--shadow)] flex gap-3 rounded-md px-3 py-[10px] ${
				Active && 'border-1 border-[var(--hero-epta)]'
			}`}
		>
			<img className='aspect-square rounded-full h-10 ' src={img_path} alt='' />
			<div className='flex flex-col justify-between'>
				<p
					className={`text-[var(--black)] whitespace-nowrap font-medium text-sm ${
						Active && 'text-[var(--hero-epta)]'
					}`}
				>
					{`${FullName.split(' ')[0]} 
					${FullName.split(' ')[1]} 
					${FullName.split(' ')[2]?.[0]}.`}
				</p>
				<p className='text-[var(--middle)] whitespace-nowrap text-sm'>
					Оценка: {score}
				</p>
			</div>
		</div>
	)
}

const MaterialCard = ({ title }) => {
	return (
		<>
			<div className='flex gap-2 h-[50px]'>
				<div className='bg-[var(--white)] rounded-lg shadow-[var(--shadow)] w-full flex gap-3 px-3 py-[9px] items-center select-none'>
					<img className='h-8 w-8' src='./assets/icons/file1.svg' alt='' />
					<p className='text-sm text-[var(--black)]'>{title}</p>
				</div>
				<div className='bg-[var(--white)] rounded-lg shadow-[var(--shadow)] w-10 flex justify-center items-center cursor-pointer hover:scale-110 active:scale-95 active:brightness-95 transition-all'>
					<ArrowBigDownDash />
				</div>
			</div>
		</>
	)
}

const StudentTable = () => {
	return <></>
}

const CheckPage = () => {
	const [Active, setActive] = useState(0)
	const [ActiveType, setActiveType] = useState(0)
	const GroupMass = [
		'2211-0101.1',
		'2324-0121.2',
		'2232-0101.5',
		'2211-0131.7',
		'2321-0101.3',
		'2211-0211.1',
		'4211-0101.2',
		'2211-0101.1',
		'2211-0141.1',
		'2421-0101.1',
		'2211-4201.1',
		'2211-0101.2',
	]
	const Type = ['Оценка', 'Комментарий']
	const Score = [1, 2, 3, 4, 5]
	return (
		<>
			<div className='grid grid-cols-12 gap-5 mt-20 select-none'>
				<div className='col-span-2 flex flex-col gap-5'>
					<div className='bg-[var(--white)] flex flex-col gap-3 rounded-lg shadow-[var(--shadow)] p-5'>
						<p className='text-[var(--middle)] text-sm'>
							Выберите группу студентов
						</p>
						<OptionInput Options={GroupMass} />
					</div>
					<div className='bg-[var(--white)] flex flex-col gap-3 rounded-lg shadow-[var(--shadow)] p-5 h-150 overflow-y-scroll'>
						{students.map((item, index) => (
							<StudentCard
								key={item.id || index}
								onClick={() => setActive(index)}
								active={Active === index}
								img_path={item.img}
								FullName={item.name}
								score={item.score}
							/>
						))}
					</div>
				</div>
				<div className='col-span-3 bg-[var(--white)] rounded-lg shadow-[var(--shadow)] flex flex-col justify-between p-5'>
					<div className='flex flex-col gap-4'>
						<p className='font-medium text-[var(--black)] text-xl'>
							Оценивание
						</p>
						<p className='font-medium text-[var(--black)] text-base'>
							Предоставлены материалы для оценки
						</p>
						<div className='h-50 overflow-y-scroll flex flex-col gap-3 pl-2 pr-4 pt-1 pb-3'>
							<MaterialCard
								title={'ndsaj jdbsja bdjbsajb fjbdab fbd sjab fdsbafb ks'}
							/>
							<MaterialCard
								title={'ndsaj jdbsja bdjbsajb fjbdab fbd sjab fdsbafb ks'}
							/>
							<MaterialCard
								title={'ndsaj jdbsja bdjbsajb fjbdab fbd sjab fdsbafb ks'}
							/>
							<MaterialCard
								title={'ndsaj jdbsja bdjbsajb fjbdab fbd sjab fdsbafb ks'}
							/>
							<MaterialCard
								title={'ndsaj jdbsja bdjbsajb fjbdab fbd sjab fdsbafb ks'}
							/>
							<MaterialCard
								title={'ndsaj jdbsja bdjbsajb fjbdab fbd sjab fdsbafb ks'}
							/>
						</div>

						<div className='flex flex-col gap-2'>
							<p className='text-sm text-[var(--middle)]'>
								Выберите тип ответа
							</p>
							<OptionInput Options={Type} />
						</div>
						<div className='flex flex-col gap-2'>
							<p className='text-sm text-[var(--middle)]'>Выберите балл</p>
							<OptionInput Options={Score} />
						</div>
					</div>

					<div className='flex gap-2 items-center'>
						<CalendarDays size={20} />
						<p className='text-[var(--black)] font-medium mt-1'>
							Дата оценивания: 15.08.2025
						</p>
					</div>
				</div>
				<div className='col-span-7 bg-[var(--white)] rounded-lg shadow-[var(--shadow)]'></div>
			</div>
		</>
	)
}
export default CheckPage
