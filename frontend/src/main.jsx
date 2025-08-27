import { createRoot } from 'react-dom/client'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useNavigate,
} from 'react-router-dom'
import { Suspense } from 'react'
import './index.css'
import './themes.css'
import DashboardLayout from './pages/layout/DashboardLayout'
import CustomCursor from './components/Cursor'
import Students from './pages/Students'
import Tasks from './pages/Tasks'
import Catalog from './pages/Сatalog'
import ConstructorPage from './pages/constructor/ConstructorPage'

function MainApp() {
	const navigate = useNavigate()
	return (
		<Suspense
			fallback={
				<>
					<p>Загрузка</p>
				</>
			}
		>
			<Routes>
				<Route path='/auth' element={''} />
				<Route path='/' element={<DashboardLayout />}>
					<Route path='/catalog' element={<Catalog />} />
					<Route path='/students' element={<Students />} />
					<Route path='/tasks' element={<Tasks />} />
					<Route path='/constructor' element={<ConstructorPage />} />
				</Route>
			</Routes>
		</Suspense>
	)
}

createRoot(document.getElementById('root')).render(
	<Router>
		<MainApp />
	</Router>
)
