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
	UserPen,
	ChevronUp,
	ChevronDown,
	X,
} from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { isWithinInterval } from 'date-fns'
import { API, FILE_API } from '../API'
import axios from 'axios'
import Loader, { BlockLoader } from './Loader'
import { useError } from './Errors'
import Moderation from '../pages/Moderation'
import { token } from '../TOKEN'

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

const HeaderLink = ({ title, icon: Icon, to }) => {
	const { setError } = useError()
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
						className={`font-medium text-base whitespace-nowrap transition-all ${
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
	console.log('userInfo: ', UserInfo)
	const { setError } = useError()
	const isDashboard = location?.pathname === '/dashboard'
	const isStudent = UserInfo?.current_user_role === 'student'
	const Wrapper = isStudent ? NavLink : 'div'
	const toProps = isStudent ? { to: '/dashboard' } : {}
	const activeClass =
		isStudent && isDashboard
			? 'bg-[var(--hero-epta)] text-white'
			: 'bg-[var(--white)]'

	const navigate = useNavigate()

	function useLockBodyScroll(lock) {
		useEffect(() => {
			if (lock) {
				document.body.style.overflow = 'hidden'
			} else {
				document.body.style.overflow = ''
			}

			return () => {
				document.body.style.overflow = ''
			}
		}, [lock])
	}

	const [showOptions, setShowOptions] = useState(false)
	const [showMessage, setShowMessage] = useState(false)
	const [showSelectRoleModal, setShowSelectRoleModal] = useState(false)

	useLockBodyScroll(showMessage)

	const logout = async () => {
		const storedAccess = localStorage.getItem('access_token')
		const storedRefresh = localStorage.getItem('refresh_token')

		try {
			const res = await fetch(`${API}/auth/jwt/logout`, {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
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

	const [userRolesLoading, setUserRolesLoading] = useState(false)
	const [userRoles, setUserRoles] = useState({
		roles: [],
		directions: [],
	})

	const fetchUserRoles = async () => {
		setUserRolesLoading(true)
		setShowSelectRoleModal(true)

		try {
			const res = await axios.get(`${API}/user/active-profiles`, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			})

			console.log('res: ', res.data)

			setUserRolesLoading(false)
			setUserRoles(res.data)
		} catch (err) {
			console.log('err: ', err)
		}
	}

	const putUserActiveRoles = async (name, id) => {
		console.log(
			'input data!!! ',
			'\nprofile_name: ',
			name,
			'\nprofile_id: ',
			id
		)
		setShowSelectRoleModal(false)

		try {
			const res = await axios.put(
				`${API}/user/active-profile`,
				{ profile_name: name, profile_id: id },
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
			console.log('res data: ', res.data)
			name === 'moderator'
				? navigate('/moderation')
				: name === 'student'
				? navigate('/catalogs/courses')
				: name === 'teacher' && navigate('/catalogt/courses')
			res.data && window.location.reload()
		} catch (err) {
			console.log('err: ', err)
		}
	}

	const roleMass = userRoles.roles
		.map(role => {
			if (role.profile_name === 'student') {
				const directions = userRoles.directions.map(dir => ({
					name: dir.group_name,
					id: dir.student_profile_id,
				}))

				return {
					name: 'Студент',
					type: 'student',
					id: directions.length === 1 ? directions[0].id : null, // если одно направление — подставляем id напрямую
					directions,
				}
			}
			if (role.profile_name === 'teacher') {
				return {
					name: 'Преподаватель',
					type: 'teacher',
					id: role.profile_id,
				}
			}
			if (role.profile_name === 'moderator') {
				return {
					name: 'Модератор',
					type: 'moderator',
					id: role.profile_id,
				}
			}
			return null
		})
		.filter(Boolean)

	const [openIndex, setOpenIndex] = useState(null)

	return (
		<div className='relative'>
			{showMessage && (
				<div
					className={`absolute z-1000 h-screen w-screen -left-10 flex items-center backdrop-blur-xs justify-center transition-all`}
				>
					<div className='p-4 h-30 rounded-xl flex flex-col gap-5 items-center justify-center bg-[var(--white)] shadow-[var(--shadow)]'>
						<p>Вы уверены что хотите выйти?</p>
						<div className='flex gap-3'>
							<button
								onClick={logout}
								className='bg-[var(--black)] text-[var(--white)] rounded-xl px-4 py-2 hover:text-white hover:bg-red-500 transition-all cursor-pointer'
							>
								Выйти
							</button>
							<button
								onClick={() => {
									setShowMessage(false)
								}}
								className='bg-[var(--black)] text-[var(--white)] rounded-xl px-4 py-2 hover:text-[var(--black)] hover:bg-[var(--white)] border-1 border-transparent hover:border-[var(--middle)] shadow-[var(--shadow)] transition-all cursor-pointer'
							>
								Отмена
							</button>
						</div>
					</div>
				</div>
			)}
			{showSelectRoleModal && (
				<div
					className={`absolute z-1000 h-screen w-screen -left-10 flex items-center backdrop-blur-xs justify-center transition-all`}
				>
					<div className='relative p-4 h-fit w-1/4 rounded-xl flex flex-col gap-5 items-center justify-center bg-[var(--white)] shadow-[var(--shadow)]'>
						<X
							onClick={() => setShowSelectRoleModal(false)}
							className='absolute top-2 right-2 text-[var(--black)] hover:text-red-500 cursor-pointer'
						/>
						<p className='text-[var(--black)] font-medium text-2xl'>
							Смена роли
						</p>
						{userRolesLoading ? (
							<Loader />
						) : (
							<div className='flex flex-col items-center gap-3 w-full'>
								{roleMass.map((item, index) => {
									return (
										<div key={index} className='w-full'>
											{item.type === 'student' && item.directions.length > 1 ? (
												<div className='w-full rounded-lg bg-[var(--white)] shadow-[var(--shadow)] relative'>
													<div
														onClick={() =>
															setOpenIndex(openIndex === index ? null : index)
														}
														className='relative w-full flex justify-center items-center px-4 py-3 font-medium cursor-pointer hover:bg-[var(--hero-epta)] hover:text-white transition-all rounded-lg'
													>
														<span>{item.name}</span>

														<ChevronDown
															size={20}
															strokeWidth={2.5}
															className={openIndex === index && 'rotate-180'}
														/>
														{openIndex === index && (
															<div className='flex flex-col absolute top-15 bg-[var(--white)] shadow-[var(--shadow)] text-[var(--black)] rounded-lg w-full overflow-hidden'>
																{item.directions.map((dir, i) => (
																	<p
																		key={i}
																		onClick={() => {
																			putUserActiveRoles(item?.type, dir.id)
																		}}
																		className='py-2 text-center cursor-pointer hover:bg-[var(--light-gray)] text-[var(--black)] transition-all'
																	>
																		{dir.name}
																	</p>
																))}
															</div>
														)}
													</div>
												</div>
											) : (
												<p
													onClick={() => {
														putUserActiveRoles(item.type, item.id)
													}}
													className='w-full rounded-lg bg-[var(--white)] shadow-[var(--shadow)] flex items-center justify-center hover:bg-[var(--hero-epta)] hover:text-white transition-all py-3 font-medium cursor-pointer'
												>
													{item.directions?.length === 1
														? `${item.name} (${item.directions[0].name})`
														: item.name}
												</p>
											)}
										</div>
									)
								})}
							</div>
						)}
					</div>
				</div>
			)}

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

						{/* <Wrapper
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
												: UserInfo?.current_user_role === 'teacher'
												? 'Преподаватель'
												: UserInfo?.current_user_role === 'moderator' &&
												  'Модератор'}
										</span>
									</p>
								</>
							) : (
								<div className='w-32 flex flex-col items-end gap-1.5'>
									<BlockLoader height={20} width={135} />
									<BlockLoader height={20} width={128} />
								</div>
							)} */}

						<div
							onClick={() => {
								setShowOptions(prev => !prev)
							}}
							className={`
								flex items-center gap-4 shadow-[var(--shadow)] rounded-lg py-[15px] pl-3 pr-[15px] cursor-pointer transition-all relative
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
												? `Студент (${UserInfo?.student_group_name})`
												: UserInfo?.current_user_role === 'teacher'
												? 'Преподаватель'
												: UserInfo?.current_user_role === 'moderator' &&
												  'Модератор'}
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
							{showOptions && (
								<div className='absolute top-20 -left-10 md:right-0 shadow-[var(--shadow)] bg-[var(--white)] rounded-xl flex flex-col w-50 p-2'>
									<div
										onClick={() => {
											fetchUserRoles()
										}}
										className='rounded-md items-center justify-end hover:bg-[var(--light-gray)] flex gap-3 px-4 py-2 text-[var(--black)]  transition-all'
									>
										<p>Смена роли</p>
										<UserPen size={20} />
									</div>
									<div
										onClick={() => {
											setShowMessage(true)
										}}
										className='rounded-md items-center justify-end hover:bg-[var(--light-gray)] hover:text-red-500 flex gap-3 px-4 py-2 text-[var(--black)] transition-all'
									>
										<p>Выйти</p>
										<LogOut size={20} />
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
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
