import { NavLink } from 'react-router-dom'

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
			<div className='h-129 p-[10px] w-full rounded-xl flex flex-col justify-between shadow-[var(--shadow)] bg-[var(--white)] hover:scale-101 transition-all'>
				<div className='inline-flex flex-col'>
					<img
						className='h-[239px] w-full rounded-md object-cover'
						src={img_path}
						alt=''
					/>

					<NavLink
						to={to}
						className={`font-bold text-[20px] mt-3 text-[var(--black)]`}
					>
						{title}
					</NavLink>
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
			</div>
		</>
	)
}
