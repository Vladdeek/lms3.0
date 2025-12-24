import { NavLink, useLocation } from 'react-router-dom'
import { isAfter } from 'date-fns'
import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export const CourseCard = ({
	img_path,
	semester,
	education,
	course,
	title,
	status,
	deadline,
	description,
	to,
	scaleOnHover = 1.025,
	rotateAmplitude = 15,
}) => {
	const springValues = {
		damping: 30,
		stiffness: 100,
		mass: 2,
	}

	const ref = useRef(null)
	const x = useMotionValue(0)
	const y = useMotionValue(0)
	const rotateX = useSpring(useMotionValue(0), springValues)
	const rotateY = useSpring(useMotionValue(0), springValues)
	const scale = useSpring(1, springValues)
	const opacity = useSpring(0)
	const rotateFigcaption = useSpring(0, {
		stiffness: 350,
		damping: 30,
		mass: 1,
	})

	const [lastY, setLastY] = useState(0)

	function handleMouse(e) {
		if (!ref.current) return

		const rect = ref.current.getBoundingClientRect()
		const offsetX = e.clientX - rect.left - rect.width / 2
		const offsetY = e.clientY - rect.top - rect.height / 2

		const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude
		const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude

		rotateX.set(rotationX)
		rotateY.set(rotationY)

		x.set(e.clientX - rect.left)
		y.set(e.clientY - rect.top)

		const velocityY = offsetY - lastY
		rotateFigcaption.set(-velocityY * 0.6)
		setLastY(offsetY)
	}

	function handleMouseEnter() {
		scale.set(scaleOnHover)
		opacity.set(1)
	}

	function handleMouseLeave() {
		opacity.set(0)
		scale.set(1)
		rotateX.set(0)
		rotateY.set(0)
		rotateFigcaption.set(0)
	}

	return (
		<motion.figure
			ref={ref}
			className='relative w-full h-full [perspective:800px] flex flex-col items-center justify-center'
			style={{
				height: 516,
				width: '100%',
				rotateX,
				rotateY,
				scale,
			}}
			onMouseMove={handleMouse}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<NavLink
				to={to}
				className='h-129 p-[10px] w-full rounded-xl flex flex-col justify-between shadow-[var(--shadow)] bg-[var(--white)] transition-all cursor-pointer'
			>
				<div className='inline-flex flex-col'>
					<img
						className='h-[239px] w-full rounded-md object-cover'
						src={img_path}
						alt=''
					/>

					<p className='font-bold text-[20px] mt-3 text-[var(--black)]'>
						{title}
					</p>
					<p className='text-[var(--middle)]'>{description}</p>
					<div className='w-full flex gap-x-3 flex-wrap'>
						<p
							className={`py-1 px-2 rounded-lg text-sm font-normal w-fit mt-3 ${
								status === 'approved'
									? 'text-[var(--green-status-text)] bg-[var(--green-status-bg)]'
									: status === 'in_development'
									? 'text-[var(--red-status-text)] bg-[var(--red-status-bg)]'
									: status === 'pending' &&
									  'text-[var(--yellow-status-text)] bg-[var(--yellow-status-bg)] '
							}`}
						>
							{status === 'approved'
								? 'Опубликован'
								: status === 'in_development'
								? 'Не опубликован'
								: status === 'pending' && 'На рассмотрении'}
						</p>
						{education && (
							<p
								className={`py-1 px-2 rounded-lg text-sm font-normal w-fit mt-3 text-[var(--hero-epta)] bg-[var(--hero-pale)]`}
							>
								{`${education}`}
							</p>
						)}
						{course && (
							<p
								className={`py-1 px-2 rounded-lg text-sm font-normal w-fit mt-3 text-[var(--hero-epta)] bg-[var(--hero-pale)]`}
							>
								{`${course}-й курс`}
							</p>
						)}

						{semester && (
							<p
								className={`py-1 px-2 rounded-lg text-sm font-normal w-fit mt-3 text-[var(--hero-epta)] bg-[var(--hero-pale)]`}
							>
								{`${semester}-й семестр`}
							</p>
						)}
					</div>
				</div>
			</NavLink>
		</motion.figure>
	)
}

export const WebinarCard = ({ img_path, title, start, end, to }) => {
	const now = new Date()
	const startTime = start ? new Date(start) : null
	const endTime = end ? new Date(end) : null
	const isAvailable = startTime ? isAfter(now, startTime) : false

	const location = useLocation()

	return (
		<div className='aspect-9/16 w-full p-[10px] rounded-xl flex flex-col justify-between shadow-[var(--shadow)] bg-[var(--white)] transition-all cursor-pointer'>
			<div className='inline-flex flex-col'>
				<img
					className='aspect-square h-auto w-full rounded-md object-cover'
					src={img_path}
					alt=''
				/>

				<p className={`font-bold text-[20px] mt-3 text-[var(--black)]`}>
					{title}
				</p>
				<p className='text-[var(--middle)] text-sm font-normal mb-[10px]'>
					Начало вэбинара: <br />
					Дата -{' '}
					<span className='font-medium'>
						{start
							? new Date(startTime).toLocaleDateString('ru-RU')
							: 'Не определен'}
					</span>
					{'  '}
					Время -{' '}
					<span className='font-medium'>
						{start
							? new Date(startTime).toLocaleTimeString('ru-RU', {
									hour: '2-digit',
									minute: '2-digit',
							  })
							: 'Не определен'}
					</span>
				</p>
				<p className='text-[var(--middle)] text-sm font-normal mb-[10px]'>
					Окончание вэбинара: <br />
					Дата -{' '}
					<span className='font-medium'>
						{end
							? new Date(endTime).toLocaleDateString('ru-RU')
							: 'Не определен'}
					</span>
					{'  '}
					Время -{' '}
					<span className='font-medium'>
						{end
							? new Date(endTime).toLocaleTimeString('ru-RU', {
									hour: '2-digit',
									minute: '2-digit',
							  })
							: 'Не определен'}
					</span>
				</p>
			</div>

			{location.pathname === '/catalogt/webinars' ? (
				<button
					className={`flex justify-center items-center p-2 rounded-lg transition-all bg-[var(--black)] text-[var(--white)] hover:bg-[var(--hero-epta)] hover:text-white cursor-pointer `}
					onClick={() => console.log('click')}
				>
					Редактировать
				</button>
			) : (
				<NavLink
					to={isAvailable ? to : '#'}
					className={`flex justify-center items-center p-2 rounded-lg transition-all ${
						isAvailable
							? 'bg-[var(--black)] text-[var(--white)] hover:bg-[var(--hero-epta)] hover:text-white cursor-pointer'
							: 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed'
					}`}
					onClick={e => {
						if (!isAvailable) e.preventDefault()
					}}
				>
					Присоединиться
				</NavLink>
			)}
		</div>
	)
}
