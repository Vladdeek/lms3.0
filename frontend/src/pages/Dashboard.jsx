import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import Calendar from '../components/Calendar'
import MiniCalendar from '../components/MiniCalendar'
import MoodBlock from '../components/MoodBlock'
import { students } from '../data/students'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

const Comment = ({ img_path, FullName, lesson, comment }) => {
	return (
		<>
			<div className='w-full h-35 bg-[var(--white)] rounded-lg shadow-[var(--shadow)] p-4 flex gap-3 text-[var(--black)]'>
				<img className=' rounded-lg h-10 w-10' src={img_path} alt='' />
				<div className='flex flex-col'>
					<div className='flex justify-between text-sm '>
						<p>
							{`${FullName.split(' ')[0]} ${FullName.split(' ')[1][0]}. ${
								FullName.split(' ')[2][0]
							}.`}
						</p>
						<p>{lesson}</p>
					</div>
					<p className='text-[var(--middle)] text-sm'>{comment}</p>
				</div>
			</div>
		</>
	)
}

const AverageScore = ({ score, subject, course, education }) => {
	return (
		<>
			<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-lg p-4 flex gap-3'>
				<div className='w-full flex flex-col text-[var(--black)] text-sm'>
					<p>{subject}</p>
					<div className='flex gap-3'>
						<p>Курс {course}</p>
						<p>{education}</p>
					</div>
				</div>
				<div className='h-full aspect-square rounded-md shadow-[var(--shadow)] bg-[var(--white)] flex items-center justify-center font-bold text-[var(--hero-epta)]'>
					<p>{score}</p>
				</div>
			</div>
		</>
	)
}

const LessonCard = ({ lesson, description, status, deadline }) => {
	return (
		<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-lg flex items-center p-4'>
			<div className='w-3/5 flex flex-col'>
				<p className='text-[var(--black)] font-medium text-sm'>{lesson}</p>
				<p className='text-[var(--middle)] text-sm'>{description}</p>
			</div>
			<div className='w-2/5 flex justify-between items-center'>
				<p
					className={` py-1 font-medium text-sm ${
						status === 'выполнено'
							? 'text-[var(--green-status-text)] bg-[var(--green-status-bg)] px-3'
							: 'text-[var(--red-status-text)] bg-[var(--red-status-bg)] px-2'
					}  rounded-md`}
				>
					{status}
				</p>
				<div className='flex gap-1 text-sm items-center'>
					<p className='text-[var(--black)] '>Дедлайн</p>
					<p
						className={` py-1 font-medium text-sm ${
							status === 'выполнено'
								? 'text-[var(--middle)] bg-[var(--light-middle)] px-3'
								: 'text-[var(--red-status-text)] bg-[var(--red-status-bg)] px-2'
						}  rounded-md`}
					>
						{deadline}
					</p>
				</div>
			</div>
		</div>
	)
}

const Dashboard = () => {
	const percentage = 75

	return (
		<>
			<div className='grid grid-cols-12 gap-5 mt-10'>
				<div className='col-span-5 flex flex-col gap-5'>
					<div className='flex gap-5'>
						<div className='bg-[var(--white)] shadow-[var(--shadow)] flex flex-col items-center gap-3 rounded-xl w-2/5 p-4'>
							<img
								className='aspect-square rounded-lg shadow-[var(--shadow)]'
								src={students[0].img}
								alt=''
							/>
							<p className='font-medium text-[var(--black)]'>
								{students[0].name}
							</p>
						</div>
						<div className='w-3/5'>
							<MiniCalendar />
						</div>
					</div>
					<div className='flex gap-5'>
						<div className='w-2/5'></div>
						<div className='w-3/5'>
							<MoodBlock />
						</div>
					</div>
				</div>

				<div className='col-span-7 flex flex-col gap-5'>
					<div className='h-1/2 bg-[var(--white)] shadow-[var(--shadow)] rounded-xl p-4 grid grid-cols-6'>
						<div className='col-span-2 flex flex-col gap-3'>
							<div className='flex justify-between items-center w-full text-[var(--black)]'>
								<ChevronLeft
									size={32}
									className='hover:scale-125 active:scale-90 cursor-pointer transition-all'
								/>
								<p className='text-xl font-medium select-none'>предмет</p>
								<ChevronRight
									size={32}
									className='hover:scale-125 active:scale-90 cursor-pointer transition-all'
								/>
							</div>
							<div className='h-full w-full flex items-center justify-center select-none'>
								<div className='flex flex-col items-center'>
									<div
										style={{ width: 200, height: 200, position: 'relative' }}
									>
										<CircularProgressbar
											value={percentage}
											strokeWidth={12} // толщина прогресса
											styles={buildStyles({
												pathColor: 'var(--hero-epta)',
												trailColor: 'var(--light-gray)',
												strokeLinecap: 'round',
												trailWidth: 6, // толщина trail (тоньше path)
											})}
										/>
										<div
											style={{
												position: 'absolute',
												top: 0,
												left: 0,
												width: '100%',
												height: '100%',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												flexDirection: 'column',
												pointerEvents: 'none',
											}}
										>
											<span className='text-[var(--black)] font-medium text-2xl'>
												{percentage}%
											</span>
											<span className='text-[var(--middle)]'>
												Пройдено курса
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='col-span-4 overflow-y-scroll flex flex-col gap-3 w-full h-85 p-1 pr-3 pb-2'>
							<LessonCard
								lesson={'основы программирования'}
								description={'тут описание какое то'}
								status={'выполнено'}
								deadline={'12:00'}
							/>
						</div>
					</div>
					<div className='h-1/2 grid grid-cols-7 gap-5'>
						<div className='col-span-4 h-full bg-[var(--white)] shadow-[var(--shadow)] rounded-xl p-4'>
							<p className='text-[var(--black)]'>
								Комментарии к выполненным работам
							</p>
							<div className='overflow-y-scroll w-full h-75 flex flex-col gap-3 p-1 pr-5 pb-2'>
								<Comment
									img_path={students[0].img}
									FullName={students[0].name}
									lesson={'Практика №1'}
									comment={
										'очень большой и информативный комментарий к выполненой работе, тут сказано какой я красавчик что хоть что то сделал и какой я лох что я нихуя не смог сделать но хоть попробовал'
									}
								/>
							</div>
						</div>
						<div className='col-span-3 h-full bg-[var(--white)] shadow-[var(--shadow)] rounded-xl p-4'>
							<button className='bg-[var(--white)] shadow-[var(--shadow)] rounded-lg text-[var(--black)] w-full flex justify-between items-center font-medium px-4 py-2'>
								<p className='pt-[2px]'>Моя успеваемость</p>
								<ArrowUpRight />
							</button>
							<div className='overflow-y-scroll w-full h-70 flex flex-col gap-3 p-1 px-3 pb-2 mt-5'>
								<AverageScore
									score={3.5}
									education={'Бакалавриат'}
									course={3}
									subject={'Основы программирования'}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
export default Dashboard
