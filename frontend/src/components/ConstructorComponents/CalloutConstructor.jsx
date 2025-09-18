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
	X,
} from 'lucide-react'
import { useState, useEffect } from 'react'

export const CalloutConstructor = ({ DelComponent, onChange, takeValues }) => {
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

	const [isOpen, setIsOpen] = useState(false)
	const [selectedIcon, setSelectedIcon] = useState(icons[1])
	const [title, setTitle] = useState(takeValues?.title || '')
	const [description, setDescription] = useState(takeValues?.description || '')

	useEffect(() => {
		const data = {
			icon: selectedIcon.name,
			title,
			description,
		}
		onChange?.(data)
	}, [selectedIcon, title, description])

	const handleIconSelect = item => {
		setSelectedIcon(item)
		setIsOpen(false)
	}

	const iconObj = icons.find(i => i.name === takeValues?.icon)

	return (
		<div className='flex gap-2'>
			<button
				className='self-start bg-[var(--white)] shadow-[var(--shadow)] p-1 rounded-lg hover:brightness-95 active:brightness-90 cursor-pointer transition-all'
				onClick={DelComponent}
			>
				<X />
			</button>

			<div className='flex bg-[var(--white)] shadow-[var(--shadow)] items-start rounded-xl w-1/3 gap-3 p-4 relative'>
				<button
					onClick={() => setIsOpen(prev => !prev)}
					className='relative cursor-pointer text-[var(--middle)] hover:text-[var(--black)] transition-all'
				>
					{takeValues ? iconObj?.icon : selectedIcon.icon}
				</button>

				{isOpen && (
					<div className='absolute top-full left-0 -mt-15 z-10 grid grid-cols-3 gap-1 p-2 rounded-xl bg-[var(--white)] shadow-[var(--shadow)] min-w-max'>
						{icons.map((item, index) => (
							<button
								key={index}
								className='bg-[var(--light-middle)] text-[var(--middle)] rounded-lg p-2 hover:bg-[var(--hero-epta)] hover:text-[var(--white)] transition-all cursor-pointer'
								onClick={() => handleIconSelect(item)}
							>
								{item.icon}
							</button>
						))}
					</div>
				)}
				<div className='flex flex-col w-full gap-3 h-30'>
					<input
						type='text'
						className='text-base font-medium outline-0'
						placeholder='Заголовок'
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
					<textarea
						className='resize-none h-full text-sm font-normal outline-0'
						placeholder='Описание'
						value={description}
						onChange={e => setDescription(e.target.value)}
					></textarea>
				</div>
			</div>
		</div>
	)
}
