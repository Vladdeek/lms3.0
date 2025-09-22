import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import Footer from '../../components/Footer'
import { Header, MobileMenuBar } from '../../components/Header'
import { useEffect, useState } from 'react'
import { AlignJustify, CalendarDays, CopyCheck, UsersRound } from 'lucide-react'
import ToggleRole from '../../components/ToggleRole'

export default function DashboardLayout({ onChange }) {
	const [activeUser, setActiveUser] = useState(null)
	const location = useLocation()
	const HeaderLinkInfo = [
		{
			teacher: [
				{
					title: 'Каталог',
					icon: AlignJustify,
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
					title: 'Каталог',
					icon: AlignJustify,
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
		},
	]

	const HeaderBtnInfo = [
		{
			action: 'toggleTheme',
		},
	]

	const [isTeacher, setIsTeacher] = useState(true)
	const handleRoleChange = () => {
		setIsTeacher(prev => !prev)
		onChange(isTeacher)
	}

	const UserInfo = [
		{
			uuid: 'dsadsadsad',
			FullName: 'Иванов Иван Иванович',
			role: isTeacher ? 'student' : 'teacher',
			img_path:
				'https://i.pinimg.com/1200x/ed/55/e0/ed55e005e9d504e6a273c19adeee2b49.jpg',
		},
	]

	const [openIndex, setOpenIndex] = useState(null)

	const links = HeaderLinkInfo[0][UserInfo[0].role]

	return (
		<>
			<div className='fixed bottom-2 right-2'>
				<ToggleRole onChange={value => handleRoleChange(value)} />
			</div>
			<div className='md:mx-10 mx-2'>
				<Header
					links={links}
					HeaderBtnInfo={HeaderBtnInfo}
					UserInfo={UserInfo}
				/>
				<div className='h-25'></div>
				<div className='mb-40'>
					<Outlet />
				</div>
			</div>
			<div className='md:hidden'>
				<MobileMenuBar links={links} />
			</div>
		</>
	)
}
