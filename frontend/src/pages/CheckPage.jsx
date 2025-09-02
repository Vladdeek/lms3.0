import { act, useState } from 'react'
import { OptionInput } from '../components/Inputs'
import { groups } from '../data/groups'
import { students } from '../data/students'
import { ArrowBigDownDash, CalendarDays, Filter } from 'lucide-react'
import { FilterButton } from '../components/Buttons'

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
	const type = [
		'ПР1',
		'T1',
		'ПР2',
		'T2',
		'ПР3',
		'T3',
		'ПР4',
		'T4',
		'ПР5',
		'T5',
		'ПР6',
		'T6',
		'ПР7',
		'T7',
	]
	const StudentScore = [
		{
			name: 'Рязанов Владислав Денисович',
			score: [3, 4, '', 5, 4, 3, '', 5, 5, 4, 4, 3, '', ''],
		},
		{
			name: 'Иванов Иван Иванович',
			score: [3, 2, '', '', 4, 3, 5, 5, '', 4, 4, 3, '', ''],
		},
		{
			name: 'Ковалев Евген Алексеевич',
			score: [3, 4, '', '', 4, 2, '', 5, 3, 4, 4, 3, '', ''],
		},
		{
			name: 'Козак Дмитрий Денисович',
			score: [3, 4, '', 2, 4, 3, '', '', 2, 4, 4, '', '', ''],
		},
	]
	return (
		<>
			<div className='flex items-center text-[var(--black)]  rounded-lg'>
				<div className='w-1/4 flex items-center'>
					<div className='w-1/5 flex items-center justify-center'>
						<p className='bg-[var(--light-gray)] h-full w-full text-center py-2 rounded-lg'>
							№
						</p>
					</div>
					<div className='w-4/5 flex items-center justify-center'>
						<p>ФИО</p>
					</div>
				</div>
				<div className='w-3/4 flex items-center justify-between'>
					{type.map((item, index) => {
						return (
							<div
								className={`flex items-center justify-center w-15 h-full py-2 rounded-lg ${
									index % 2 === 0
										? 'bg-[var(--light-gray)]'
										: 'bg-[var(--white)] '
								}`}
							>
								<p className='text-center' key={index}>
									{item}
								</p>
							</div>
						)
					})}
					<p className='w-15 text-center bg-[var(--light-gray)] h-full py-2 rounded-lg'>
						ср/б
					</p>
				</div>
			</div>
			<div className='flex flex-col gap-2 mt-3'>
				{StudentScore.map((item, index) => {
					return (
						<StudentCard4Table
							num={index + 1}
							FullName={item.name}
							scores={item.score}
							average={4}
						/>
					)
				})}
			</div>
		</>
	)
}

const StudentCard4Table = ({ num, FullName, scores }) => {
	const calculateAverage = scores => {
		const validScores = scores.filter(score => score !== '' && !isNaN(score))
		if (validScores.length === 0) return 0
		const sum = validScores.reduce((total, score) => total + Number(score), 0)
		return (sum / validScores.length).toFixed(0)
	}
	const average = calculateAverage(scores)
	return (
		<>
			<div className='flex items-center text-[var(--black)] shadow-[var(--shadow)] rounded-lg overflow-hidden'>
				<div className='w-1/4 flex items-center'>
					<div className='w-1/5 flex items-center justify-center'>
						<p className='bg-[var(--light-gray)] h-full w-full text-center py-2'>
							{num}
						</p>
					</div>
					<div className='w-4/5 flex items-center justify-center'>
						<p className='bg-[var(--white)] h-full w-full text-center py-2'>{`${
							FullName.split(' ')[0]
						} ${FullName.split(' ')[1]} ${FullName.split(' ')[2][0]}.`}</p>
					</div>
				</div>
				<div className='w-3/4 flex items-center justify-between'>
					{scores.map((item, index) => {
						return (
							<div
								key={index}
								className={`flex items-center justify-center w-15 h-full ${
									item.length !== 0 ? 'py-2' : 'py-5'
								} ${
									index % 2 === 0
										? 'bg-[var(--light-gray)]'
										: 'bg-[var(--white)] '
								}`}
							>
								<p className='text-center'>{item}</p>
							</div>
						)
					})}
					<p className='w-15 text-center bg-[var(--light-gray)] py-2' h-full>
						{average}
					</p>
				</div>
			</div>
		</>
	)
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
				<div className='col-span-7 bg-[var(--white)] rounded-lg shadow-[var(--shadow)] flex p-4'>
					<div className='w-[95%]'>
						<StudentTable />
					</div>
					<div className='w-[5%] flex h-fit justify-center'>
						<FilterButton option={['по фамилии', 'по среднему балу']} />
					</div>
				</div>
			</div>
		</>
	)
}
export default CheckPage
