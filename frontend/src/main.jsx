import { createRoot } from 'react-dom/client'
import Snowfall from 'react-snowfall'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	useNavigate,
} from 'react-router-dom'
import {
	StrictMode,
	Suspense,
	use,
	useContext,
	useEffect,
	useState,
} from 'react'
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
import CoursePage, { CourseOverview } from './pages/CoursePage'
import CatalogS from './pages/Tasks'
import { useScroll } from 'framer-motion'
import Authorization from './pages/Authorization'

import axios from 'axios'
import api, { API } from './API'
import Moderation from './pages/Moderation'
import { ErrorProvider } from './components/Errors'
import SchedulePage from './pages/Schedule'
import InDevelopment from './pages/Development'

function MainApp() {
	const [role, setRole] = useState()
	const [teacherProfileId, setTeacherProfileId] = useState()
	return (
		<Suspense
			fallback={
				<>
					<p>Загрузка</p>
				</>
			}
		>
			<Routes>
				<Route path='/auth' element={<Authorization isRegister={false} />} />
				<Route
					path='/'
					element={
						<DashboardLayout
							onChange={data => {
								setRole(data.role)
								setTeacherProfileId(data.teacher_profile_id)
							}}
						/>
					}
				>
					{/* <Route path='/catalog/all' element={<Catalog role={role} />} /> */}
					<Route
						path='/catalogt'
						element={
							<Catalog role={role} teacher_profile_id={teacherProfileId} />
						}
					>
						<Route path='courses' element={<Catalog role={role} />} />
						<Route path='webinars' element={<Catalog role={role} />} />
					</Route>
					<Route
						path='/catalogs'
						element={
							<CatalogS role={role} teacher_profile_id={teacherProfileId} />
						}
					>
						<Route path='courses' element={<CatalogS role={role} />} />
						<Route path='webinars' element={<CatalogS role={role} />} />
					</Route>

					<Route path='/students' element={<StudentsAndGroups />} />
					<Route path='/moderation' element={<Moderation role={role} />} />
					<Route
						path='/constructor/:courseId?'
						element={<ConstructorPage role={role} />}
					/>
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/schedule' element={<SchedulePage role={role} />} />
					{/* <Route path='/score' element={<ScorePage /> } /> */}
					<Route path='/score' element={<InDevelopment />} />
					<Route
						path='/course/:courseId?'
						element={<CoursePage role={role} userId={teacherProfileId} />}
					>
						<Route
							path='lesson/:SectionId?'
							element={<CourseOverview userId={teacherProfileId} />}
						/>
					</Route>

					<Route path='/dev' element={<InDevelopment />} />
				</Route>
			</Routes>
		</Suspense>
	)
}

createRoot(document.getElementById('root')).render(
	<Router>
		<ErrorProvider>
			<div className='relative'>
				{/* <Snowfall
					style={{
						position: 'fixed',
						width: '100vw',
						height: '100vh',
						zIndex: 9999,
						pointerEvents: 'none',
					}}
				/> */}
				<MainApp />
			</div>
		</ErrorProvider>
	</Router>,
)
