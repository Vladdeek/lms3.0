import { act, useEffect, useState } from 'react'
import {
	Sun,
	Moon,
	UsersRound,
	CopyCheck,
	Bell,
	MessageSquare,
	MessagesSquare,
	AlignJustify,
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
			}  text-[var(--black)] shadow-[var(--shadow)] transition-all flex items-center justify-center cursor-pointer`}
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
							className={`h-4 w-4 p-[1px] flex justify-center items-center rounded-full absolute -top-1 -right-1 bg-[var(--hero-epta)] text-[var(--white)] ${
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

const HeaderLink = ({ title, icon: Icon, to }) => {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				`inline-flex justify-center items-center gap-2 rounded-lg px-4 py-3 cursor-pointer shadow-[var(--shadow)] transition-all select-none ${
					!isActive
						? 'bg-[var(--white)]'
						: 'bg-[var(--hero-epta)] text-[var(--white)]'
				}`
			}
		>
			{({ isActive }) => (
				<>
					<Icon size={24} />
					<p
						className={`font-medium transition-all text-base ${
							isActive
								? 'text-[var(--primary)]'
								: 'hover:text-[var(--primary)] text-[var(--text)]'
						}`}
					>
						{title}
					</p>
				</>
			)}
		</NavLink>
	)
}

const Header = () => {
	const HeaderLinkInfo = [
		{
			title: 'Каталог',
			icon: AlignJustify,
			to: '/catalog',
		},
		{
			title: 'Студенты и группы',
			icon: UsersRound,
			to: '/students',
		},
		{
			title: 'Проверка заданий',
			icon: CopyCheck,
			to: '/tasks',
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
					{HeaderLinkInfo.map((item, index) => (
						<HeaderLink
							key={index}
							title={item.title}
							icon={item.icon}
							to={item.to}
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
							<div className='flex items-center gap-4 shadow-[var(--shadow)] rounded-lg py-[15px] pl-3 pr-[15px]'>
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
