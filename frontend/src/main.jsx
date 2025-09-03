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
import Tasks from './pages/Tasks'
import Catalog from './pages/Сatalog'
import ConstructorPage from './pages/constructor/ConstructorPage'
import Dashboard from './pages/Dashboard'
import Schedule from './pages/Schedule'
import ScorePage from './pages/ScorePage'
import StudentsAndGroups from './pages/Students&Groups'
import CoursePage from './pages/CoursePage'

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
					<Route path='/tasks' element={<Tasks />} />
					<Route path='/students' element={<StudentsAndGroups />} />
					<Route path='/constructor' element={<ConstructorPage />} />
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/schedule' element={<Schedule />} />
					<Route path='/score' element={<ScorePage />} />
					<Route path='/course' element={<CoursePage />} />
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
