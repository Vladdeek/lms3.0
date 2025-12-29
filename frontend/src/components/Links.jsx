import { NavLink } from 'react-router-dom'

export const Link = ({
	to,
	title,
	textsize = 'text-2xl',
	underline = false,
}) => {
	return (
		<>
			<NavLink
				to={to}
				className={`flex flex-col items-center group w-fit ${textsize} text-[var(--black)] p-1`}
			>
				<p className='group-hover:text-[var(--hero-epta)]'>{title}</p>
				{underline && (
					<div className='bg-[var(--black)] h-[1px] w-full opacity-100 group-hover:opacity-100 group-hover:bg-[var(--hero-epta)] transition-all'></div>
				)}

				<div className='bg-[var(--hero-epta)] h-[1px]  w-0 group-hover:w-full transition-all'></div>
			</NavLink>
		</>
	)
}

export const LinkBTN = ({
	onClick,
	title,
	textsize = 'text-2xl',
	underline = false,
}) => {
	return (
		<>
			<button
				type={'button'}
				onClick={onClick}
				className={`flex flex-col items-center group w-fit ${textsize} text-[var(--black)] p-1`}
			>
				<p className='group-hover:text-[var(--hero-epta)]'>{title}</p>
				{underline && (
					<div className='bg-[var(--black)] h-[1px] w-full opacity-100 group-hover:opacity-100 group-hover:bg-[var(--hero-epta)] transition-all'></div>
				)}

				<div className='bg-[var(--hero-epta)] h-[1px]  w-0 group-hover:w-full transition-all'></div>
			</button>
		</>
	)
}
