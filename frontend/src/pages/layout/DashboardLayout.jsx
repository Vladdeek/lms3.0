import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function DashboardLayout() {
	return (
		<>
			<div className='mx-10'>
				<Header />
				<div className='h-25'></div>
				<div className='mb-40'>
					<Outlet />
				</div>
				<Footer />
			</div>
		</>
	)
}
