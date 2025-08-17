import { act, useEffect, useState } from 'react'
import {
	Sun,
	Moon,
	UsersRound,
	CopyCheck,
	Bell,
	MessageSquare,
	MessagesSquare,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const HeaderBtn = ({ onClick, action, icon: Icon, Notifications = null }) => {
	const [isLight, setIsLight] = useState(() => {
		return document.documentElement.dataset.theme === 'light'
	})

	const toggleTheme = () => {
		setIsLight(prev => {
			const newTheme = !prev ? 'light' : 'dark'
			document.documentElement.dataset.theme = newTheme
			return !prev
		})
	}
	return (
		<button
			onClick={action === 'toggleTheme' ? toggleTheme : onClick}
			className={`relative rounded-lg p-[14px] ${
				action === 'toggleTheme' &&
				'hover:bg-[var(--hero-epta)] hover:text-[var(--white)]'
			}  text-[var(--black)] shadow-[1px_2px_8px_rgba(0,0,0,0.125)] transition-all flex items-center justify-center `}
		>
			{action === 'toggleTheme' ? (
				!isLight ? (
					<Sun size={20} />
				) : (
					<Moon size={20} />
				)
			) : (
				<>
					<Icon size={20} />
					{Notifications !== null ? (
						<p
							className={`h-4 w-4 pt-[2px] flex justify-center items-center rounded-full absolute -top-1 -right-1 bg-[var(--hero-epta)] text-[var(--white)] ${
								Notifications > 9 ? 'text-[8px]' : 'text-xs'
							}`}
						>
							{Notifications > 9 ? '9+' : Notifications}
						</p>
					) : (
						''
					)}
				</>
			)}
		</button>
	)
}

const HeaderDropdown = ({
	title,
	option = false,
	isOpen,
	onToggle,
	icon: Icon,
	menu = false,
}) => {
	return (
		<div className='relative select-none '>
			<div
				onClick={onToggle}
				data-clickable
				className={`inline-flex justify-center items-center gap-2 ${
					!menu
						? 'bg-[var(--white)] shadow-[1px_2px_8px_rgba(0,0,0,0.125)]'
						: 'bg-[var(--hero-epta)] text-[var(--white)]'
				}  rounded-lg px-4 py-3`}
			>
				{!menu ? (
					<Icon size={24} />
				) : (
					<div className='relative h-6 w-[18px] flex flex-col justify-center items-center '>
						<div
							className={`h-[2px] w-full bg-[var(--white)] absolute rounded-full transition-all ${
								isOpen ? 'rotate-45' : 'top-[6px]'
							}`}
						></div>
						<div
							className={`h-[2px]  bg-[var(--white)] absolute rounded-full transition-all ${
								isOpen ? 'w-0 opacity-0' : 'w-full opacity-100'
							}`}
						></div>
						<div
							className={`h-[2px] w-full bg-[var(--white)] absolute rounded-full transition-all ${
								isOpen ? '-rotate-45' : 'bottom-[6px]'
							}`}
						></div>
					</div>
				)}

				<p
					className={`font-medium transition-all text-base ${
						!option
							? 'hover:text-[var(--primary)] text-[var(--text)] '
							: isOpen
							? 'text-[var(--primary)]'
							: 'hover:text-[var(--primary)] text-[var(--text)]'
					}`}
				>
					{title}
				</p>
			</div>
			{option && isOpen && (
				<div className='bg-[var(--white)] shadow-[1px_2px_8px_rgba(0,0,0,0.125)] min-w-full absolute left-0 rounded-lg flex flex-col gap-2 py-2 px-4 mt-1 text-[#101010] z-50 '>
					{option.map((item, index) => (
						<NavLink
							to={item.to}
							onClick={() => {
								setIsOpen(prev => !prev)
							}}
							date-clickable
							key={index}
							className='flex gap-3 items-center group cursor-none'
						>
							<p className='select-none text-base whitespace-nowrap'>
								{item.title}
							</p>
						</NavLink>
					))}
				</div>
			)}
		</div>
	)
}

const Header = () => {
	const HeaderDropdownInfo = [
		{
			title: 'Каталог',
			icon: '',
			option: [
				{ title: 'Раздел 1', to: '' },
				{ title: 'Раздел 2', to: '' },
				{ title: 'Раздел 3', to: '' },
				{ title: 'Раздел 4', to: '' },
			],
			menu: true,
		},
		{
			title: 'Студенты и группы',
			icon: UsersRound,
			option: [
				{ title: 'Раздел 1', to: '' },
				{ title: 'Раздел 2', to: '' },
				{ title: 'Раздел 3', to: '' },
			],
		},
		{
			title: 'Проверка заданий',
			icon: CopyCheck,
			option: [
				{ title: 'Раздел 1', to: '' },
				{ title: 'Раздел 2', to: '' },
			],
		},
	]
	const HeaderBtnInfo = [
		{
			icon: MessagesSquare,
			onClick: () => {
				console.log('Messages clicked')
			},
			Notifications: 2,
		},
		{
			action: 'toggleTheme',
		},
		{
			icon: Bell,
			onClick: () => {
				console.log('Notifications clicked')
			},
			Notifications: 8,
		},
	]

	const UserInfo = [
		{
			FullName: 'Покуса Тамила Владимировна',
			role: 'Преподаватель',
			img_path:
				'https://i.pinimg.com/736x/93/88/67/938867b05625e9057d9c9138f304f2b8.jpg',
		},
	]

	const [openIndex, setOpenIndex] = useState(null)
	return (
		<>
			<div className='flex justify-between items-center fixed w-full py-[15px] px-10 bg-[var(--white)] shadow-lg z-100 left-0'>
				<div className='flex items-center gap-5'>
					{HeaderDropdownInfo.map((item, index) => (
						<HeaderDropdown
							key={index}
							title={item.title}
							option={item.option}
							icon={item.icon}
							menu={item.menu}
							isOpen={openIndex === index}
							onToggle={() =>
								setOpenIndex(prev => (prev === index ? null : index))
							}
						/>
					))}
				</div>

				<div className='flex justify-end z-10'>
					<div className='flex items-center gap-5'>
						{HeaderBtnInfo.map((item, index) => (
							<HeaderBtn
								key={index}
								icon={item.icon}
								action={item.action}
								Notifications={item.Notifications}
							/>
						))}
						{UserInfo.map((user, index) => (
							<div className='flex items-center gap-4 shadow-[1px_2px_8px_rgba(0,0,0,0.125)] rounded-lg py-[15px] pl-3 pr-[15px]'>
								<p className='text-base font-medium text-[var(--black)] whitespace-nowrap text-end leading-5'>
									{`${user.FullName.split(' ')[0]}
										  ${user.FullName.split(' ')[1]}
										  ${user.FullName.split(' ')[2][0]}.`}
									<span className='font-normal text-[var(--middle)]'>
										<br />
										{user.role}
									</span>
								</p>
								<img
									className='h-10 rounded-full aspect-square'
									src={user.img_path}
									alt=''
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	)
}
export default Header
