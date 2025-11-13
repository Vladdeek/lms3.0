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
	useError,
} from '../../components/Errors'
import Loader from '../../components/Loader'
import { motion } from 'framer-motion'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { API } from '../../API'
import { getCookie } from '../../TOKEN'

export default function DashboardLayout({ onChange }) {
	const [userInfo, setUserInfo] = useState()
	const location = useLocation()
	const navigate = useNavigate()
	const HeaderLinkInfo = [
		{
			teacher: [
				{
					title: 'Каталог курсов',
					icon: AlignJustify,
					to: '/catalog/all',
				},
				{
					title: 'Мои курсы',
					icon: GraduationCap,
					to: '/catalogt',
				},
				{
					title: 'Задания',
					icon: CopyCheck,
					to: '/students',
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

	const { refreshAccessToken } = useContext(AuthContext)
	const storedAccess = localStorage.getItem('access_token')

	const fetchUser = async () => {
		if (storedAccess !== null) {
			try {
				const res = await axios.get(`${API}/users/me`, {
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					},
				})
				console.log('XSRFTOKEN: ', getCookie('csrftoken'))
				setUserInfo(res.data)
				localStorage.setItem('role', res.data.current_user_role)
			} catch (error) {
				if (error.response?.status === 401) {
					const newAccessToken = await refreshAccessToken()
					console.log('new: ', newAccessToken)
					if (newAccessToken) {
						try {
							const retryRes = await axios.get(`${API}/users/me`, {
								withCredentials: true,
								headers: {
									'Content-Type': 'application/json',
								},
							})
							console.log('XSRFTOKEN: ', getCookie('XSRF-TOKEN'))
							setUserInfo(retryRes.data)
							localStorage.setItem('role', retryRes.data.current_user_role)
						} catch (error) {
							console.error(error)
						}
					}
				} else {
					navigate('/auth')
					console.error(error)
				}
			}
		} else {
			navigate('/auth')
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
		<ErrorProvider>
			<div className='md:mx-10 mx-2'>
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
		</ErrorProvider>
	)
}
