import { createRoot } from 'react-dom/client'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useNavigate,
} from 'react-router-dom'
import { Suspense, use, useEffect, useState } from 'react'
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
import CatalogS from './pages/Tasks'
import { useScroll } from 'framer-motion'

function MainApp() {
	const navigate = useNavigate()
	const [isTeacher, setIsTeacher] = useState()

	const [role, setRole] = useState()

	useEffect(() => {
		setRole(!isTeacher ? 'teacher' : 'student')
	}, [isTeacher])

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
				<Route path='/' element={<DashboardLayout onChange={setIsTeacher} />}>
					<Route path='/catalogt' element={<Catalog role={role} />} />
					<Route path='/catalogs' element={<CatalogS role={role} />} />
					<Route path='/students' element={<StudentsAndGroups />} />
					<Route
						path='/constructor/:courseId?'
						element={<ConstructorPage role={role} />}
					/>
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/schedule' element={<Schedule />} />
					<Route path='/score' element={<ScorePage />} />
					<Route
						path='/course/:courseId?'
						element={<CoursePage role={role} />}
					/>
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
