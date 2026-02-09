import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import Footer from '../../components/Footer'
import { Header, MobileMenuBar } from '../../components/Header'
import { use, useContext, useEffect, useState } from 'react'
import {
	AlignJustify,
	Bell,
	BookOpen,
	CalendarDays,
	CopyCheck,
	GraduationCap,
	ShieldAlert,
	UsersRound,
} from 'lucide-react'
import ToggleRole from '../../components/ToggleRole'
import {
	ErrorProvider,
	InternalServerError500,
	NotFoundError404,
	setGlobalError,
} from '../../components/Errors'
import Loader from '../../components/Loader'
import { motion } from 'framer-motion'

import axios from 'axios'
import api, { API } from '../../API'
import { getCookie } from '../../TOKEN'

export default function DashboardLayout({ onChange }) {
	const [userInfo, setUserInfo] = useState()
	const location = useLocation()
	const navigate = useNavigate()
	const HeaderLinkInfo = [
		{
			teacher: [
				{
					title: 'Мои курсы',
					icon: GraduationCap,
					to: '/catalogt',
				},
				{
					title: 'Расписание',
					icon: CalendarDays,
					to: '/schedule',
				},
				{
					title: 'Задания',
					icon: CopyCheck,
					to: '/students',
				},
				{
					title: 'Журнал',
					icon: CopyCheck,
					to: '/score',
				},
			],
			student: [
				{
					title: 'Курсы',
					icon: GraduationCap,
					to: '/catalogs',
				},
				{
					title: 'Расписание',
					icon: CalendarDays,
					to: '/schedule',
				},

				{
					title: 'Оценки',
					icon: CopyCheck,
					to: '/score',
				},
			],
			moderator: [
				{
					title: 'Проверка курсов',
					icon: ShieldAlert,
					to: '/moderation',
				},
			],
		},
	]

	const [openIndex, setOpenIndex] = useState(null)

	const links = HeaderLinkInfo[0][userInfo?.current_user_role] || []

	useEffect(() => {
		if (userInfo && location.pathname === '/') {
			switch (userInfo.current_user_role) {
				case 'student':
					navigate('/catalogs')
					break
				case 'teacher':
					navigate('/catalogt')
					break
				case 'moderator':
					navigate('/moderation')
					break
				default:
					break
			}
		}
	}, [userInfo])

	const fetchUser = async () => {
		try {
			const res = await api.get(`${API}/users/me`, {
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
				},
			})

			setUserInfo(res.data)
			localStorage.setItem('role', res.data.current_user_role)
		} catch (error) {
			console.error('Ошибка при получении данных пользователя:', error)
		}
	}

	useEffect(() => {
		fetchUser()
	}, [])

	useEffect(() => {
		onChange?.({
			role: userInfo?.current_user_role,
			teacher_profile_id: userInfo?.id,
		})
	}, [userInfo])

	return (
		<>
			<div className='md:mx-10 mx-2 relative'>
				{/* <div className='absolute top-3.5  overflow-hidden h-20 w-screen flex items-center justify-center'>
					<img
						onClick={() => (window.location.href = 'https://mellstroy.com/')}
						src='https://casino-otzovik.su/wp-content/uploads/2025/10/mellstroy-326x245.jpg'
						alt=''
						className='w-1/3 cursor-pointer z-1000'
					/>
				</div> */}
				<Header links={links} UserInfo={userInfo} />
				<div className='h-25'></div>
				{location.pathname === '/' && (
					<div className='h-[85vh] flex justify-center items-center'>
						<div className='w-2/3'>
							<Loader />
						</div>
					</div>
				)}
				<Outlet />
				<motion.div
					key={location.pathname}
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
					className='max-md:hidden'
				>
					<Footer />
				</motion.div>
			</div>
			<div className='md:hidden'>
				<MobileMenuBar links={links} />
			</div>
		</>
	)
}
