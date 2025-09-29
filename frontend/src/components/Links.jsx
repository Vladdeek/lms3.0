import { NavLink } from 'react-router-dom'

export const Link = ({ to, title }) => {
	return (
		<>
			<NavLink
				to={to}
				className='flex flex-col items-center group w-fit text-2xl text-[var(--black)] p-1'
			>
				<p className='group-hover:text-[var(--hero-epta)]'>{title}</p>
				<div className='bg-[var(--hero-epta)] h-[1px]  w-0 group-hover:w-full transition-all'></div>
			</NavLink>
		</>
	)
}
