import { NavLink } from 'react-router-dom'

const FooterLink = ({ to, title, index }) => {
	return (
		<NavLink
			to={to}
			className={`group text-base w-fit ${
				index === 0
					? 'font-medium text-[var(--black)]'
					: 'font-normal text-[var(--middle)]'
			}`}
		>
			<p>{title}</p>
			<div
				className={`${
					index === 0 ? 'bg-[var(--black)]' : 'bg-[var(--middle)]'
				} h-[1px] w-0 group-hover:w-full transition-all`}
			></div>
		</NavLink>
	)
}

const Footer = () => {
	const FooterLinks = [
		[
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
		],
		[
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
		],
		[
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
		],
		[
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
		],
		[
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
		],
		[
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
		],
		[
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
		],
		[
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
		],
		[
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
		],
		[
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
			{ title: 'Ссылка', to: '/' },
		],
	]
	return (
		<footer className='grid grid-cols-[1fr_5fr] gap-5 my-7'>
			<div className='flex flex-col gap-5'>
				<p className='uppercase text-4xl font-bold text-[var(--black)]'>
					МелГУ СУО
				</p>
				<div className='flex justify-between'>
					<div className='bg-gray-300 h-12 aspect-square rounded-lg'></div>
					<div className='bg-gray-300 h-12 aspect-square rounded-lg'></div>
					<div className='bg-gray-300 h-12 aspect-square rounded-lg'></div>
					<div className='bg-gray-300 h-12 aspect-square rounded-lg'></div>
				</div>
			</div>
			<div className='flex justify-between'>
				{FooterLinks.map((column, colIndex) => (
					<div key={colIndex} className='flex flex-col gap-4'>
						{column.map((link, linkIndex) => (
							<FooterLink key={linkIndex} {...link} index={linkIndex} />
						))}
					</div>
				))}
			</div>
		</footer>
	)
}
export default Footer
