import { NavLink } from 'react-router-dom'

export const ButtonView = ({ title, to }) => {
	return (
		<div className='flex justify-center'>
			<NavLink
				to={to}
				className='text-[var(--white)] px-4 py-3 w-fit rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all bg-[var(--hero-epta)] font-medium'
			>
				{title}
			</NavLink>
		</div>
	)
}
