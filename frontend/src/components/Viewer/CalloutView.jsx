import {
	Asterisk,
	BadgeAlert,
	BookAlert,
	Bookmark,
	Flag,
	Megaphone,
	MessageCircleWarning,
	ShieldAlert,
	Siren,
} from 'lucide-react'

export const CalloutView = ({ IconId, title, description }) => {
	const icons = [
		{ icon: <ShieldAlert size={32} strokeWidth={1.5} /> },
		{ icon: <Megaphone size={32} strokeWidth={1.5} /> },
		{ icon: <Flag size={32} strokeWidth={1.5} /> },
		{ icon: <BookAlert size={32} strokeWidth={1.5} /> },
		{ icon: <BadgeAlert size={32} strokeWidth={1.5} /> },
		{ icon: <Siren size={32} strokeWidth={1.5} /> },
		{ icon: <MessageCircleWarning size={32} strokeWidth={1.5} /> },
		{ icon: <Bookmark size={32} strokeWidth={1.5} /> },
		{ icon: <Asterisk size={32} strokeWidth={1.5} /> },
	]

	return (
		<>
			<div className='flex justify-center w-full'>
				<div className='flex bg-[var(--white)] shadow-[var(--shadow)] items-start rounded-xl min-w-1/3 max-w-1/2 gap-3 p-4 relative'>
					<div className='text-[var(--middle)] transition-all'>
						{icons[IconId].icon}
					</div>

					<div className='flex flex-col w-full gap-3 h-30'>
						<p className='text-base font-medium'>{title}</p>
						<p className=' h-fit text-sm font-normal'>{description}</p>
					</div>
				</div>
			</div>
		</>
	)
}
