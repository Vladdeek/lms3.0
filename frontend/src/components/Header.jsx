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
	LogOut,
	ImageOff,
} from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { isWithinInterval } from 'date-fns'
import { API, FILE_API } from '../API'
import axios from 'axios'
import { BlockLoader } from './Loader'
import { useError } from './Errors'

const NotificationCard = ({ title, description }) => {
	return (
		<div className='bg-[var(--white)] shadow-[var(--shadow)] rounded-lg px-3 py-2'>
			<p className='text-lg font-medium text-[var(--black)]'>{title}</p>
			<p className='text-base font-normal text-[var(--middle)]'>
				{description}
			</p>
		</div>
	)
}

const ToggleTheme = () => {
	const [isLight, setIsLight] = useState(() => {
		const savedTheme = localStorage.getItem('theme')
		if (savedTheme) {
			return savedTheme === 'light'
		}
		return document.documentElement.dataset.theme === 'light'
	})

	useEffect(() => {
		const theme = isLight ? 'light' : 'dark'
		document.documentElement.dataset.theme = theme
		localStorage.setItem('theme', theme)
	}, [isLight])

	const toggleTheme = () => {
		setIsLight(prev => !prev)
	}

	return (
		<button
			onClick={toggleTheme}
			className={`relative rounded-lg p-[14px] hover:bg-[var(--hero-epta)] hover:text-white text-[var(--black)] shadow-[var(--shadow)] transition-all flex items-center justify-center cursor-pointer `}
		>
			{!isLight ? <Sun size={20} /> : <Moon size={20} />}
		</button>
	)
}

const Notification = () => {
	const [isOpen, setIsOpen] = useState(false)

	const Notifications = [
		{
			title: 'Обновление',
			description: 'Добавили такой-то такой-то функционал',
		},
		{
			title: 'Обновление',
			description: 'Добавили такой-то такой-то функционал',
		},
		{
			title: 'Предупреждение',
			description: 'Нужно пройти тест',
		},
	]
	return (
		<div className='relative'>
			<button
				onClick={() => {
					setIsOpen(prev => !prev)
				}}
				className={`relative rounded-lg p-[14px] hover:bg-[var(--hero-epta)] hover:text-white text-[var(--black)] shadow-[var(--shadow)] transition-all flex items-center justify-center cursor-pointer ${
					isOpen && 'bg-[var(--hero-epta)] text-white'
				}`}
			>
				<Bell size={20} />
				{Notifications?.length !== 0 && (
					<p
						className={`h-5 w-5 p-1 flex justify-center items-center ring-1 ring-[var(--white)] rounded-full absolute shadow-[var(--shadow)] -top-[6px] -right-[6px] bg-[var(--hero-epta)] text-white ${
							Notifications?.length > 9 ? 'text-[9px]' : 'text-[11px]'
						}`}
					>
						<span className='text-center pe-px'>
							{Notifications?.length > 9 ? '9+' : Notifications?.length}
						</span>
					</p>
				)}
			</button>
			{isOpen && (
				<div className='absolute bg-[var(--white)] top-14 -right-5 shadow-[var(--shadow)] rounded-2xl p-4 h-fit max-h-150  w-125'>
					<div className='flex flex-col gap-3'>
						{Notifications?.map(item => (
							<NotificationCard
								title={item?.title}
								description={item?.description}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

const Logout = () => {
	const navigate = useNavigate()
	const logout = async () => {
		const storedAccess = localStorage.getItem('access_token')
		const storedRefresh = localStorage.getItem('refresh_token')

		try {
			const res = await fetch(`${API}/auth/jwt/logout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${storedAccess}`,
				},
				body: JSON.stringify({ refresh_token: storedRefresh }),
			})

			if (!res.ok) {
				const errorData = await res.json()
				throw new Error(errorData?.detail || `Error ${res.status}`)
			}

			const data = await res.json()
			console.log('Logout success:', data)

			localStorage.removeItem('access_token')
			localStorage.removeItem('refresh_token')

			navigate('/auth')
		} catch (error) {
			console.log('Logout error:', error.message)
			localStorage.removeItem('access_token')
			localStorage.removeItem('refresh_token')
			navigate('/auth')
		}
	}

	return (
		<button
			onClick={logout}
			className={`relative rounded-lg p-[14px] hover:bg-[var(--hero-epta)] hover:text-white text-[var(--black)] active:scale-98 active:brightness-90 shadow-[var(--shadow)] transition-all flex items-center justify-center cursor-pointer`}
		>
			<LogOut size={20} />
		</button>
	)
}

const HeaderLink = ({ title, icon: Icon, to }) => {
	const clearError = () => {
		setError(null)
	}

	return (
		<NavLink
			to={to}
			onClick={clearError}
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

const MobileHeaderLink = ({ title, icon: Icon, to }) => {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				`inline-flex flex-col justify-center items-center gap-2 rounded-lg h-full aspect-square cursor-pointer text-[var(--black)] transition-all select-none ${
					!isActive ? 'text-[var(--black)]' : 'text-[var(--hero-epta)] '
				}`
			}
		>
			{({ isActive }) => (
				<>
					<Icon size={24} />
					<p
						className={`font-normal text-sm transition-all text-center ${
							!isActive ? 'text-[var(--middle)]' : 'text-[var(--hero-epta)] '
						}`}
					>
						{title}
					</p>
				</>
			)}
		</NavLink>
	)
}

export const Header = ({ links = [], UserInfo = null }) => {
	const isDashboard = location?.pathname === '/dashboard'
	const isStudent = UserInfo?.current_user_role === 'student'
	const Wrapper = isStudent ? NavLink : 'div'
	const toProps = isStudent ? { to: '/dashboard' } : {}
	const activeClass =
		isStudent && isDashboard
			? 'bg-[var(--hero-epta)] text-white'
			: 'bg-[var(--white)]'

	return (
		<>
			<div className='flex justify-between items-center fixed w-full py-[15px] px-10 bg-[var(--white)] shadow-lg z-100 left-0'>
				<div className='flex items-center gap-5 max-md:hidden'>
					{UserInfo ? (
						<>
							{links?.map((item, index) => (
								<HeaderLink
									key={index}
									title={item.title}
									icon={item.icon}
									to={item.to}
								/>
							))}
						</>
					) : (
						<>
							<BlockLoader width={135} height={45} />
							<BlockLoader width={135} height={45} />
							<BlockLoader width={135} height={45} />
						</>
					)}
				</div>

				<div className='flex max-md:w-full md:justify-end z-10'>
					<div className='flex max-md:flex-row-reverse items-center max-md:w-full max-md:justify-between gap-5'>
						<ToggleTheme />
						{/* <Notification Notifications={1} /> TO-DO Уведомления */}

						<Wrapper
							{...toProps}
							className={`
								flex items-center gap-4 shadow-[var(--shadow)] rounded-lg py-[15px] pl-3 pr-[15px] cursor-pointer transition-all
								${activeClass}
							`}
						>
							{UserInfo ? (
								<>
									<p
										className={`text-base font-medium whitespace-nowrap text-end leading-5 ${
											isStudent && isDashboard
												? 'text-white'
												: 'text-[var(--black)]'
										}`}
									>
										{UserInfo?.personal_data?.first_name}{' '}
										{UserInfo?.personal_data?.last_name}{' '}
										{UserInfo?.personal_data?.middle_name
											? `${UserInfo.personal_data.middle_name[0]}.`
											: ''}
										<span
											className={`font-normal ${
												isStudent && isDashboard
													? 'text-white/80'
													: 'text-[var(--middle)]'
											}`}
										>
											<br />

											{UserInfo?.current_user_role === 'student'
												? 'Студент'
												: UserInfo?.current_user_role === 'teacher' &&
												  'Преподаватель'}
										</span>
									</p>
								</>
							) : (
								<div className='w-32 flex flex-col items-end gap-1.5'>
									<BlockLoader height={20} width={135} />
									<BlockLoader height={20} width={128} />
								</div>
							)}

							{UserInfo ? (
								<img
									className='h-10 rounded-full aspect-square'
									src={`${FILE_API}${UserInfo?.photo}`}
									alt=''
								/>
							) : (
								<ImageOff className='h-10 w-10 p-1.75 text-[var(--middle)] rounded-full aspect-square shimmer' />
							)}
						</Wrapper>
						<Logout />
					</div>
				</div>
			</div>
		</>
	)
}

export const MobileMenuBar = ({ links }) => {
	return (
		<div className='fixed bottom-0 left-0 z-50 w-full h-20 bg-[var(--white)] shadow-[var(--shadow)] '>
			<div className='flex justify-between h-full max-w-lg  mx-20 font-medium'>
				{links.map((item, index) => (
					<MobileHeaderLink
						key={index}
						title={item.title}
						icon={item.icon}
						to={item.to}
					/>
				))}
			</div>
		</div>
	)
}
