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
	Home,
} from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

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
				`inline-flex justify-center items-center gap-2 rounded-lg px-4 py-3 cursor-pointer shadow-[var(--shadow)] text-[var(--black)] transition-all select-none ${
					!isActive ? 'bg-[var(--white)]' : 'bg-[var(--hero-epta)] text-white'
				}`
			}
		>
			{({ isActive }) => (
				<>
					<Icon size={24} />
					<p
						className={`font-medium text-base transition-all ${
							isActive ? 'text-white' : 'hover:text-[var(--black)]'
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
	const [activeUser, setActiveUser] = useState(null)
	const location = useLocation()
	const HeaderLinkInfo = [
		{
			teacher: [
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
			],
			student: [
				{
					title: 'Расписание',
					icon: UsersRound,
					to: '/schedule',
				},
				{
					title: 'Каталог курсов',
					icon: AlignJustify,
					to: '/tasks',
				},
				{
					title: 'Оценки',
					icon: CopyCheck,
					to: '/score',
				},
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
			FullName: 'Иванов Иван Иванович',
			role: 'teacher',
			img_path:
				'https://i.pinimg.com/1200x/ed/55/e0/ed55e005e9d504e6a273c19adeee2b49.jpg',
		},
	]
	const Users = [
		{
			FullName: 'Иванов Иван Иванович',
			role: 'student',
			img_path:
				'https://i.pinimg.com/736x/93/88/67/938867b05625e9057d9c9138f304f2b8.jpg',
		},
		{
			FullName: 'Покуса Тамила Владимировна',
			role: 'teacher',
			img_path:
				'https://i.pinimg.com/736x/93/88/67/938867b05625e9057d9c9138f304f2b8.jpg',
		},
	]

	const [openIndex, setOpenIndex] = useState(null)

	const links = HeaderLinkInfo[0][UserInfo[0].role]

	return (
		<>
			<div className='flex justify-between items-center fixed w-full py-[15px] px-10 bg-[var(--white)] shadow-lg z-100 left-0'>
				<div className='flex items-center gap-5'>
					{links.map((item, index) => (
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
						{UserInfo.map((user, index) => {
							const isDashboard = location.pathname === '/dashboard'
							const isStudent = user.role === 'student'
							const Wrapper = isStudent ? NavLink : 'div'
							const toProps = isStudent ? { to: '/dashboard' } : {}
							const activeClass =
								isStudent && isDashboard
									? 'bg-[var(--hero-epta)] text-white'
									: 'bg-[var(--white)]'

							return (
								<Wrapper
									key={index}
									{...toProps}
									className={`
                flex items-center gap-4 shadow-[var(--shadow)] rounded-lg py-[15px] pl-3 pr-[15px] cursor-pointer transition-all
                ${activeClass}
            `}
								>
									<p
										className={`text-base font-medium whitespace-nowrap text-end leading-5 ${
											isStudent && isDashboard
												? 'text-white'
												: 'text-[var(--black)]'
										}`}
									>
										{`${user.FullName.split(' ')[0]} ${
											user.FullName.split(' ')[1]
										} ${user.FullName.split(' ')[2][0]}.`}
										<span
											className={`font-normal ${
												isStudent && isDashboard
													? 'text-white/80'
													: 'text-[var(--middle)]'
											}`}
										>
											<br />
											{user.role === 'student'
												? 'Студент'
												: user.role === 'teacher' && 'Преподаватель'}
										</span>
									</p>
									<img
										className='h-10 rounded-full aspect-square'
										src={user.img_path}
										alt=''
									/>
								</Wrapper>
							)
						})}
					</div>
				</div>
			</div>
		</>
	)
}
export default Header
