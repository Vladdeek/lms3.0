import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Header from '../../components/Header'

export default function DashboardLayout() {
	return (
		<>
			<div className='mx-40'>
				<Header />
				<div className='h-40'></div>
				<div>
					<Outlet />
				</div>
			</div>
		</>
	)
}
