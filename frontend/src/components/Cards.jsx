import { NavLink } from 'react-router-dom'
import { isAfter } from 'date-fns'

export const CourseCard = ({
	img_path,
	education,
	course,
	title,
	status,
	deadline,
	description,
	to,
}) => {
	return (
		<>
			<NavLink
				to={to}
				className='h-129 p-[10px] w-full rounded-xl flex flex-col justify-between shadow-[var(--shadow)] bg-[var(--white)] hover:scale-101 transition-all cursor-pointer'
			>
				<div className='inline-flex flex-col'>
					<img
						className='h-[239px] w-full rounded-md object-cover'
						src={img_path}
						alt=''
					/>

					<p className={`font-bold text-[20px] mt-3 text-[var(--black)]`}>
						{title}
					</p>
					<p className='text-[var(--middle)]'>{description}</p>
					<p
						className={`p-[10px] rounded-lg text-sm font-normal w-fit mt-5 ${
							status === 'Опубликован'
								? 'text-[var(--green-status-text)] bg-[var(--green-status-bg)]'
								: status === 'В разработке'
								? 'text-[var(--yellow-status-text)] bg-[var(--yellow-status-bg)]'
								: ''
						}`}
					>
						{status}
					</p>
				</div>
				<p className='text-[var(--middle)] text-sm font-normal mb-[10px]'>
					Крайний срок сдачи:{' '}
					<span className='font-medium'>{deadline || 'Не определен'}</span>
				</p>
			</NavLink>
		</>
	)
}

export const WebinarCard = ({ img_path, title, deadline, to }) => {
	const now = new Date()
	const webinarTime = deadline ? new Date(deadline) : null
	const isAvailable = webinarTime ? isAfter(now, webinarTime) : false

	return (
		<div className='h-129 p-[10px] w-full rounded-xl flex flex-col justify-between shadow-[var(--shadow)] bg-[var(--white)] transition-all cursor-pointer'>
			<div className='inline-flex flex-col'>
				<img
					className='aspect-square h-auto w-full rounded-md object-cover'
					src={img_path}
					alt=''
				/>

				<p className={`font-bold text-[20px] mt-3 text-[var(--black)]`}>
					{title}
				</p>
				<p className='text-[var(--middle)] text-sm font-normal mb-[10px]'>
					Начало вэбинара: <br />
					Дата -{' '}
					<span className='font-medium'>
						{deadline
							? new Date(deadline).toLocaleDateString('ru-RU')
							: 'Не определен'}
					</span>
					{'  '}
					Время -{' '}
					<span className='font-medium'>
						{deadline
							? new Date(deadline).toLocaleTimeString('ru-RU', {
									hour: '2-digit',
									minute: '2-digit',
							  })
							: 'Не определен'}
					</span>
				</p>
			</div>

			<NavLink
				to={isAvailable ? to : '#'}
				className={`flex justify-center items-center p-2 rounded-lg transition-all ${
					isAvailable
						? 'bg-[var(--black)] text-[var(--white)] hover:bg-[var(--hero-epta)] hover:text-white cursor-pointer'
						: 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed'
				}`}
				onClick={e => {
					if (!isAvailable) e.preventDefault()
				}}
			>
				Присоединиться
			</NavLink>
		</div>
	)
}
