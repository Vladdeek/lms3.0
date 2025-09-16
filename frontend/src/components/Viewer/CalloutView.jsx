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

export const CalloutView = ({ IconName, title, description }) => {
	const icons = [
		{ name: 'ShieldAlert', icon: <ShieldAlert size={32} strokeWidth={1.5} /> },
		{ name: 'Megaphone', icon: <Megaphone size={32} strokeWidth={1.5} /> },
		{ name: 'Flag', icon: <Flag size={32} strokeWidth={1.5} /> },
		{ name: 'BookAlert', icon: <BookAlert size={32} strokeWidth={1.5} /> },
		{ name: 'BadgeAlert', icon: <BadgeAlert size={32} strokeWidth={1.5} /> },
		{ name: 'Siren', icon: <Siren size={32} strokeWidth={1.5} /> },
		{
			name: 'MessageCircleWarning',
			icon: <MessageCircleWarning size={32} strokeWidth={1.5} />,
		},
		{ name: 'Bookmark', icon: <Bookmark size={32} strokeWidth={1.5} /> },
		{ name: 'Asterisk', icon: <Asterisk size={32} strokeWidth={1.5} /> },
	]

	const iconObj = icons.find(i => i.name === IconName)

	return (
		<>
			<div className='flex justify-center w-full'>
				<div className='flex bg-[var(--white)] shadow-[var(--shadow)] items-start rounded-xl min-w-1/3 max-w-1/2 gap-3 p-4 relative'>
					<div className='text-[var(--middle)] transition-all'>
						{iconObj?.icon}
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
